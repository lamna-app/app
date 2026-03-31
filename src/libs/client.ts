import type { ClientResponse, LoginResponse, MeResponse } from "@/types/client"
import type { Channel, Guild, Message } from "@/types/models"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export class Client {
  private static BASE = "http://localhost:3000/v1"
  private token?: string

  constructor() {
    this.token = localStorage.getItem("token") as string
  }

  private async request<T>(endpoint: string, method: Method, body?: Record<string, unknown>): Promise<ClientResponse<T>> {
    const resp = await fetch(`${Client.BASE}${endpoint}`, {
      body: body ? JSON.stringify(body) : null,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.token ?? ""
      }
    })

    if (!resp.ok) {
      if (resp.status === 401) {
        if (window.location.pathname !== "/app/login") {
          window.location.href = "/app/login"
        }
      }

      throw new Error(await resp.text())
    }

    if (endpoint === "/auth/login") {
      this.token = resp.headers.get("Authorization") as string
    }

    return {
      data: await resp.json(),
      status: resp.status
    }
  }

  async login(email: string, password: string): Promise<ClientResponse<LoginResponse>> {
    const resp = await this.request<LoginResponse>("/auth/login", "POST", {
      email,
      password
    })
    localStorage.setItem("token", this.token as string)
    return resp
  }

  async register(_email: string, _username: string, _password: string) {}

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
