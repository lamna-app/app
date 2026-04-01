import { onCleanup, onMount } from "solid-js"

import { setGuilds } from "@/stores/guildStore"

import { useSocket } from "./useSocket"

import type { Guild } from "@/types/models"

export function useGuildSocket() {
  const socket = useSocket()

  onMount(() => {
    const handler = (guild: Guild) => {
      setGuilds(guilds => [guild, ...(guilds ?? [])])
    }

    const readyHandler = (data: { guilds: Guild[] }) => {
      setGuilds(data.guilds)
    }

    socket.on("guild.join", handler)
    socket.on("ready", readyHandler)
    onCleanup(() => {
      socket.off("guild.join", handler)
      socket.off("ready", readyHandler)
    })
  })
}
