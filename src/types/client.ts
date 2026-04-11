import type { Guild } from "./models"

export type ClientResponse<T> = {
  data: T
  status: number
}

export type LoginResponse = {
  email: string
  id: string
  username: string
}

export type MeResponse = {
  id: string
  email: string
  username: string
}

export type Invite = {
  id: string
  code: string
  guild_id: string
  inviter_id: string
  uses: number
  max_uses: number
  max_age: number
  created_at: string
}

export type InviteInfo = {
  guild: Guild
  invite: Invite
}
