import type { ClientResponse, LoginResponse, MeResponse } from "@/types/client"
import type { Channel, Guild, Message } from "@/types/models"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export class APIError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)

    this.name = "APIError"
    this.status = status
  }
}

export class Client {
  private static BASE = import.meta.env.VITE_API_URL
  private static VERSION = 1
  private token: Option<string> = null

  constructor() {
    this.token = localStorage.getItem("token") as string
  }

  private async request<T>(endpoint: string, method: Method, body?: Record<string, unknown>): Promise<ClientResponse<T>> {
    const resp = await fetch(`${Client.BASE}/v${Client.VERSION}${endpoint}`, {
      body: body ? JSON.stringify(body) : null,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
      }
    })

    if (!resp.ok) {
      if (resp.status === 401) {
        if (window.location.pathname !== "/login") {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
      }

      const err = await resp.text()
      throw new APIError(err, resp.status)
    }

    if (["/auth/login", "/auth/register"].includes(endpoint)) {
      this.token = resp.headers.get("Authorization")?.split(" ")[1] as string
    }

    return {
      data: await resp.json(),
      status: resp.status
    }
  }

  async register(username: string, email: string, password: string) {
    const resp = await this.request<LoginResponse>("/auth/register", "POST", {
      username,
      email,
      password
    })

    localStorage.setItem("token", this.token as string)

    return resp
  }

  async login(email: string, password: string): Promise<ClientResponse<LoginResponse>> {
    const resp = await this.request<LoginResponse>("/auth/login", "POST", {
      email,
      password
    })

    localStorage.setItem("token", this.token as string)

    return resp
  }

  logout() {
    this.token = null
    localStorage.removeItem("token")
  }

  async me(): Promise<ClientResponse<MeResponse>> {
    return await this.request<MeResponse>("/@me", "GET")
  }

  async guilds(): Promise<ClientResponse<Guild[]>> {
    return await this.request<Guild[]>("/@me/guilds", "GET")
  }

  async channels(guildID: string): Promise<ClientResponse<Channel[]>> {
    return await this.request<Channel[]>(`/guilds/${guildID}/channels`, "GET")
  }

  async messages(channelID: string): Promise<ClientResponse<Message[]>> {
    return await this.request<Message[]>(`/channels/${channelID}/messages`, "GET")
  }

  async sendMessage(channelID: string, content: string) {
    return await this.request(`/channels/${channelID}/messages`, "POST", { content })
  }
}
