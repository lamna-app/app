export interface Guild {
  id: string
  name: string
  icon_url?: string
  owner_id: string
  channels: Channel[]
  created_at: string
}

export interface Channel {
  id: string
  name: string
  channel_type: number
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
