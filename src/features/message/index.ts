import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import { useClient } from "@/hooks/useClient"

import type { Accessor } from "solid-js"
import type { Message } from "@/types/models"

// channel_id: message[]
export const [messages, setMessages] = createStore<Record<string, Message[]>>({})
const [loading, setLoading] = createStore<Record<string, boolean>>({})

export const useMessages = (channelID: Accessor<string>) => {
  const client = useClient()

  createEffect(async () => {
    const id = channelID()
    if (messages[id] !== undefined) return

    setLoading(id, true)
    setMessages(id, [])

    try {
      const resp = await client.messages(id)
      setMessages(
        id,
        resp.data?.map(msg => ({ ...msg, created_at: new Date(msg.created_at) }))
      )
    } finally {
      setLoading(id, false)
    }
  })

  // return () => messages[channelID()] ?? []
  return {
    messages: () => messages[channelID()] ?? [],
    loading: () => loading[channelID()] ?? false
  }
}
