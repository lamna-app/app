import { onCleanup, onMount } from "solid-js"

import { setGuilds } from "@/stores/guildStore"
import { setUser } from "@/stores/userStore"

import { useSocket } from "./useSocket"

import type { MeResponse } from "@/types/client"
import type { Guild } from "@/types/models"

export function useGuildSocket() {
  const socket = useSocket()

  onMount(() => {
    const authenticatedHandler = (data: MeResponse) => {
      setUser(data)
    }

    const readyHandler = (data: { guilds: Guild[] }) => {
      setGuilds(data.guilds)
    }

    const handler = (guild: Guild) => {
      setGuilds(guilds => [guild, ...(guilds ?? [])])
    }

    socket.on("authenticated", authenticatedHandler)
    socket.on("ready", readyHandler)
    socket.on("guild.join", handler)

    onCleanup(() => {
      socket.off("authenticated", authenticatedHandler)
      socket.off("ready", readyHandler)
      socket.off("guild.join", handler)
    })
  })
}
