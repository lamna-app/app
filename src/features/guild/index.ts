import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

import { channels, setChannels, setCurrentChannel } from "../channel"

import type { Client } from "@/libs/client"
import type { Guild } from "@/types/models"

// guild id: guild
export const [guilds, setGuilds] = createStore<Record<string, Guild>>({})

export const [currentGuild, setCurrentGuild] = createSignal<Option<Guild>>(null)
export const useGuild = () => currentGuild

export const selectGuild = async (guild: Guild, client: Client) => {
  setCurrentChannel(null)
  setCurrentGuild(guild)
  if (channels[guild.id]) {
    setCurrentChannel(channels[guild.id][0])
    return
  }
  const resp = await client.channels(guild.id)
  setChannels(guild.id, resp.data)
  setCurrentChannel(resp.data[0])
}

export const useGuildChannels = (guildID: string) => () => channels[guildID] ?? []
