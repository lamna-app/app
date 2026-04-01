import { onCleanup, onMount } from "solid-js"

import { setMessages } from "@/stores/messageStore"

import { useSocket } from "./useSocket"

import type { Message } from "@/types/models"

export function useMessageSocket() {
  const socket = useSocket()

  onMount(() => {
    const handler = (message: Message) => {
      setMessages(message.channel_id, messages => [message, ...(messages ?? [])])
    }

    socket.on("message.create", handler)
    onCleanup(() => socket.off("message.create", handler))
  })
}
