import { ChannelType } from "@/types/utils"
import logout from "@/utils/logout"

import type { ClientResponse, Invite, LoginResponse, MeResponse } from "@/types/client"
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
        logout()
      }

      const err = await resp.text()
      throw new APIError(err, resp.status)
    }

    if (["/auth/login", "/auth/register"].includes(endpoint)) {
      this.token = resp.headers.get("Authorization")?.split(" ")[1] as string
    }

    if (resp.status === 204) {
      return {
        data: null as unknown as T,
        status: resp.status
      }
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

  async login(email: string, password: string) {
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

  async me() {
    return await this.request<MeResponse>("/@me", "GET")
  }

  async getInvite(code: string) {
    return await this.request(`/invite/${code}`, "GET")
  }

  async joinInvite(code: string) {
    return await this.request(`/invite/${code}`, "POST")
  }

  async createInvite(guildID: string, maxAge: number, maxUses: number) {
    return await this.request<Invite>(`/guilds/${guildID}/invites`, "POST", { max_age: maxAge, max_uses: maxUses })
  }

  async guilds() {
    return await this.request<Guild[]>("/@me/guilds", "GET")
  }

  async createGuild(name: string) {
    return await this.request<Guild>("/guilds", "POST", { name })
  }

  async leaveGuild(guildID: string) {
    return await this.request(`/@me/guilds/${guildID}`, "DELETE")
  }

  async channels(guildID: string) {
    return await this.request<Channel[]>(`/guilds/${guildID}/channels`, "GET")
  }

  async createChannel(guildID: string, name: string, type: ChannelType = ChannelType.TextChannel, parentChannelId?: string) {
    return await this.request<Channel>(`/guilds/${guildID}/channels`, "POST", {
      name,
      channel_type: type,
      parent: parentChannelId
    })
  }

  async messages(channelID: string, limit: number = 50, before?: string) {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (before) params.append("before", before)

    return await this.request<Message[]>(`/channels/${channelID}/messages?${params.toString()}`, "GET")
  }

  async sendMessage(channelID: string, content: string) {
    return await this.request(`/channels/${channelID}/messages`, "POST", { content })
  }
}
