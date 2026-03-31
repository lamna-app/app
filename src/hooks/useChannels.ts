import { createEffect, createMemo } from "solid-js"
import { useGuild } from "@/contexts/GuildContext"
import { channels, setChannels } from "@/stores/channelStore"
import { useClient } from "./useClient"

export function useChannels() {
  const client = useClient()
  const { guild } = useGuild()

  createEffect(async () => {
    const g = guild()
    if (!g) return
    if (channels[g.id]) return

    const resp = await client.channels(g.id)
    setChannels(g.id, resp.data)
  })

  return createMemo(() => {
    const g = guild()
    if (!g) return

    return channels[g.id] ?? []
  })
}
