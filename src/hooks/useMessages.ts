import { createEffect, createMemo, onCleanup, onMount } from "solid-js"

import { messages, setMessages } from "@/stores/messageStore"

import { useChannel } from "@/contexts/ChannelContext"

import { useClient } from "./useClient"
import { useSocket } from "./useSocket"

import type { Message } from "@/types/models"

export function useMessages() {
  const client = useClient()
  const socket = useSocket()
  const { channel } = useChannel()

  createEffect(async () => {
    const c = channel()
    if (!c) return
    if (messages[c.id]) return

    const resp = await client.messages(c.id)
    setMessages(c.id, resp.data)
  })

  onMount(() => {
    const handler = (msg: Message) => {
      console.log("msg recv", msg)
      setMessages(msg.channel_id, msgs => [...(msgs ?? []), msg])
    }

    socket.on("message.create", handler)
    onCleanup(() => console.log("cleanup"))
  })

  return createMemo(() => {
    const c = channel()
    if (!c) return []
    return messages[c.id] ?? []
  })
}
