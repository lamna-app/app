import { produce } from "solid-js/store"

import { channels, setChannels } from "../channel"
import { setGuilds } from "../guild"
import { guildMembers, setGuildMember, setGuildMembers } from "../guild_members"
import { chatStore, setChatStore } from "../message"
import { setUser } from "../user"
import { setUsers, users } from "../users"

import type { Socket } from "@/libs/socket"
import type { MeResponse } from "@/types/client"
import type {
  Channel,
  Guild,
  GuildJoinPayload,
  MemberJoinPayload,
  MemberLeavePayload,
  Message,
  PresenceUpdatePayload,
  ReadyPayload
} from "@/types/models"

export const registerEvents = (socket: Socket) => {
  socket.on("authenticated", (data: MeResponse) => {
    setUser(data)
  })

  socket.on("ready", ({ guilds, members, users }: ReadyPayload) => {
    guilds.forEach(g => {
      setGuilds(g.id, g)
      setChannels(g.id, g.channels ?? [])
    })

    members.forEach(m => {
      if (!guildMembers[m.guild_id]) {
        setGuildMembers(m.guild_id, {})
      }

      setGuildMember(m.guild_id, m.user_id, m)
    })

    users.forEach(u => {
      setUsers(u.id, u)
    })
  })

  socket.on("guild.join", ({ guild, members }: GuildJoinPayload) => {
    setGuilds(guild.id, guild)
    setChannels(guild.id, guild.channels ?? [])

    members.forEach(m => {
      if (!guildMembers[m.guild_id]) {
        setGuildMembers(m.guild_id, {})
      }

      setGuildMember(m.guild_id, m.user_id, m)
    })
  })

  socket.on("guild.update", (data: Guild) => {
    setGuilds(data.id, data)
    setChannels(data.id, data.channels ?? [])
  })

  socket.on("guild.leave", (guildId: string) => {
    const channelIds = channels[guildId]?.map(c => c.id)

    setChatStore(
      produce(state => {
        channelIds.forEach(id => {
          delete state[id]
        })
      })
    )

    setGuildMembers(
      produce(state => {
        delete state[guildId]
      })
    )

    setChannels(
      produce(state => {
        delete state[guildId as keyof typeof state]
      })
    )

    setGuilds(
      produce(state => {
        delete state[guildId as keyof typeof state]
      })
    )

    // TODO: push the user to another guild/home if they're currently in the deleted guild
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

  socket.on("member.leave", ({ guild_id, user_id }: MemberLeavePayload) => {
    setGuildMembers(
      guild_id,
      produce(members => {
        delete members[user_id]
      })
    )

    // TODO: like guild.leave, if user_id is the current logged in user, push to somewhere else
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
      setUsers(data.user_id, "presence", data.presence)
    }
  })
}
