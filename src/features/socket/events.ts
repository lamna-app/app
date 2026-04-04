import { channels, setChannels } from "../channel"
import { setGuilds } from "../guild"
import { setMessages } from "../message"
import { setUser } from "../user"

import type { Socket } from "@/libs/socket"
import type { MeResponse } from "@/types/client"
import type { Channel, Guild, Message } from "@/types/models"

export const registerEvents = (socket: Socket) => {
  socket.on("authenticated", (data: MeResponse) => {
    setUser(data)
  })

  socket.on("ready", (data: { guilds: Guild[] }) => {
    data.guilds.forEach(g => {
      setGuilds(g.id, g)
      setChannels(g.id, g.channels ?? [])
    })
  })

  socket.on("guild.join", (data: Guild) => {
    setGuilds(data.id, data)
  })

  socket.on("message.create", (data: Message) => {
    const msg = data
    msg.created_at = new Date(msg.created_at)

    setMessages(data.channel_id, messages => [msg, ...messages])
  })

  socket.on("message.delete", (data: Message) => {
    setMessages(data.channel_id, messages => messages.filter(msg => msg.id !== data.id))
  })

  socket.on("channel.create", (data: Channel) => {
    setChannels(data.guild_id, channels => [...channels, data])
  })

  socket.on("channel.delete", (data: Channel) => {
    setChannels(data.guild_id, channels => channels.filter(ch => ch.id !== data.id))
  })
}
