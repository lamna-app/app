import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

import { channels, setCurrentChannel } from "../channel"

import type { Guild } from "@/types/models"

// guild_id: guild
export const [guilds, setGuilds] = createStore<Record<string, Guild>>({})

export const [currentGuild, setCurrentGuild] = createSignal<Option<Guild>>(null)

export const selectGuild = async (guild: Guild, channelID?: string) => {
  setCurrentGuild(guild)
  if (!channels[guild.id]) {
    setCurrentChannel(null)
    return
  }

  const ch = channelID
    ? channels[guild.id].find(ch => ch.id === channelID)
    : channels[guild.id].find(ch => ch.channel_type === 2)

  setCurrentChannel(ch ?? null)
}
