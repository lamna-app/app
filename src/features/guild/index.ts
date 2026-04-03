import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

import { channels, setCurrentChannel } from "../channel"

import type { Guild } from "@/types/models"

// guild_id: guild
export const [guilds, setGuilds] = createStore<Record<string, Guild>>({})

export const [currentGuild, setCurrentGuild] = createSignal<Option<Guild>>(null)
export const useGuild = () => currentGuild

export const selectGuild = async (guild: Guild) => {
  setCurrentChannel(null)
  setCurrentGuild(guild)

  if (channels[guild.id]) {
    setCurrentChannel(channels[guild.id][0])
    return
  }
}

export const useGuildChannels = (guildID: string) => () => channels[guildID] ?? []
