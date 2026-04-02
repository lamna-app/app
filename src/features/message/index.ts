import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import { useClient } from "@/hooks/useClient"

import type { Accessor } from "solid-js"
import type { Message } from "@/types/models"

// channel_id: message[]
export const [messages, setMessages] = createStore<Record<string, Message[]>>({})
export const useMessages = (channelID: Accessor<string>) => {
  const client = useClient()
  createEffect(async () => {
    const id = channelID()

    if (messages[id] !== undefined) return
    setMessages(id, [])

    const resp = await client.messages(id)
    setMessages(id, resp.data)
  })

  return () => messages[channelID()] ?? []
}
