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
      console.log("ready", data.guilds)
      setGuilds(data.guilds)
    }

    socket.on("guild.join", handler)
    socket.on("ready", readyHandler)
    onCleanup(() => console.log("cleanup")) // TOOD: add socket.off
  })
}
