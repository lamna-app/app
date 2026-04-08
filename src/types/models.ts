export interface Guild {
  id: string
  name: string
  icon_url?: string
  owner_id: string
  channels: Channel[]
  created_at: string
}

export enum ChannelType {
  CategoryChannel = 1,
  TextChannel = 2,
  VoiceChannel = 3
}

export interface Channel {
  id: string
  name: string
  guild_id: string
  parent_id: string | null
  channel_type: ChannelType
  created_at: string
}

export interface Message {
  id: string
  content: string
  author: {
    id: string
    username: string
    created_at: string
  }
  channel_id: string
  created_at: Date
}

export interface GuildMember {
  user_id: string
  guild_id: string
  joined_at: string
}

export type UserStatus = "online" | "dnd" | "idle" | "offline"

export interface User {
  id: string
  username: string
  status: UserStatus
  created_at: string
}

export interface ReadyPayload {
  guilds: Guild[]
  guild_members: GuildMember[]
  users: User[]
}

export interface PresenceUpdatePayload {
  user_id: string
  status: UserStatus
}
