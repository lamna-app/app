import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import { useClient } from "@/hooks/useClient"

import type { Accessor } from "solid-js"
import type { Message } from "@/types/models"

// channel_id: message[]
export const [messages, setMessages] = createStore<Record<string, Message[]>>({})
const [loading, setLoading] = createStore<Record<string, boolean>>({})
const [loadingMore, setLoadingMore] = createStore<Record<string, boolean>>({})
const [hasMore, setHasMore] = createStore<Record<string, boolean>>({})

const CHUNK = 25

export const useMessages = (channelID: Accessor<string>) => {
  const client = useClient()

  createEffect(async () => {
    const id = channelID()
    if (messages[id] !== undefined) return

    setLoading(id, true)
    setMessages(id, [])
    setHasMore(id, true)

    try {
      const resp = await client.messages(id, CHUNK)
      const newMessages =
        resp.data?.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at)
        })) || []

      setMessages(id, newMessages)

      if (newMessages.length < CHUNK) setHasMore(id, false)
    } finally {
      setLoading(id, false)
    }
  })

  const loadMore = async () => {
    const id = channelID()
    if (loading[id] || loadingMore[id] || !hasMore[id]) return

    const currentMessages = messages[id] || []
    if (currentMessages.length === 0) return

    const oldestMessage = currentMessages[currentMessages.length - 1]
    setLoadingMore(id, true)
    try {
      const resp = await client.messages(id, 50, oldestMessage.id)
      const newMessages =
        resp.data?.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at)
        })) || []

      if (newMessages.length > 0) {
        setMessages(id, [...currentMessages, ...newMessages])
      }

      if (newMessages.length < 50) {
        setHasMore(id, false)
      }
    } finally {
      setLoadingMore(id, false)
    }
  }

  return {
    messages: () => messages[channelID()] ?? [],
    loading: () => loading[channelID()] ?? false,
    loadingMore: () => loadingMore[channelID()] ?? false,
    hasMore: () => hasMore[channelID()] ?? true,
    loadMore
  }
}
