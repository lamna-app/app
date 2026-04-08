import { createStore } from "solid-js/store"

import type { GuildMember } from "@/types/models"

// guild_id: { user_id: GuildMember }
export const [guildMembers, setGuildMembers] = createStore<Record<string, Record<string, GuildMember>>>({})

export const setGuildMember = (guildId: string, userId: string, member: GuildMember) => {
  setGuildMembers(guildId, prevGuildMembers => ({
    ...prevGuildMembers,
    [userId]: member
  }))
}
