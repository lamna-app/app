import { setChannels } from "../channel"
import { setGuilds } from "../guild"
import { guildMembers, setGuildMember, setGuildMembers } from "../guild_members"
import { chatStore, setChatStore } from "../message"
import { setUser } from "../user"
import { setUsers, users } from "../users"

import type { Socket } from "@/libs/socket"
import type { MeResponse } from "@/types/client"
import type { Channel, Guild, MemberJoinPayload, Message, PresenceUpdatePayload, ReadyPayload } from "@/types/models"

export const registerEvents = (socket: Socket) => {
  socket.on("authenticated", (data: MeResponse) => {
    setUser(data)
  })

  socket.on("ready", ({ guilds, guild_members, users }: ReadyPayload) => {
    guilds.forEach(g => {
      setGuilds(g.id, g)
      setChannels(g.id, g.channels ?? [])
    })

    guild_members.forEach(m => {
      if (!guildMembers[m.guild_id]) {
        setGuildMembers(m.guild_id, {})
      }

      setGuildMember(m.guild_id, m.user_id, m)
    })

    users.forEach(u => {
      setUsers(u.id, u)
    })
  })

  socket.on("guild.join", (data: Guild) => {
    setGuilds(data.id, data)
    setChannels(data.id, data.channels ?? [])
  })

  socket.on("member.join", ({ member, user }: MemberJoinPayload) => {
    setUsers(user.id, user)

    if (!guildMembers[member.guild_id]) {
      setGuildMembers(member.guild_id, {})
    }

    if (!guildMembers[member.guild_id][member.user_id]) {
      setGuildMember(member.guild_id, member.user_id, member)
    }
  })

  socket.on("message.create", (data: Message) => {
    const msg = data
    data.created_at = new Date(data.created_at)

    if (chatStore[data.channel_id]) {
      setChatStore(data.channel_id, "messages", prevMessages => [msg, ...prevMessages])
    }
  })

  socket.on("message.delete", (data: Message) => {
    if (chatStore[data.channel_id]) {
      setChatStore(data.channel_id, "messages", prevMessages => prevMessages.filter(msg => msg.id !== data.id))
    }
  })

  socket.on("channel.create", (data: Channel) => {
    setChannels(data.guild_id, channels => [...channels, data])
  })

  socket.on("channel.delete", (data: Channel) => {
    setChannels(data.guild_id, channels => channels.filter(ch => ch.id !== data.id))
  })

  socket.on("presence.update", (data: PresenceUpdatePayload) => {
    if (users[data.user_id]) {
      setUsers(data.user_id, "presence", data.status)
    }
  })
}
