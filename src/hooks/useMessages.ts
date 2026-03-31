import { createEffect, createMemo } from "solid-js"

import { messages, setMessages } from "@/stores/messageStore"

import { useChannel } from "@/contexts/ChannelContext"

import { useClient } from "./useClient"

export function useMessages() {
  const client = useClient()
  const { channel } = useChannel()

  createEffect(async () => {
    const c = channel()
    if (!c) return
    if (messages[c.id]) return

    const resp = await client.messages(c.id)
    setMessages(c.id, resp.data)
  })

  return createMemo(() => {
    const c = channel()
    if (!c) return []
    return messages[c.id] ?? []
  })
}
