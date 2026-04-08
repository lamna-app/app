import { createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import { useClient } from "@/hooks/useClient"

import type { Accessor } from "solid-js"
import type { Message } from "@/types/models"

const CHUNK = 25

type ChatState = {
  messages: Message[]
  isFetching: boolean
  hasMore: boolean
}

export const [chatStore, setChatStore] = createStore<Record<string, ChatState>>({})

export const useMessages = (channelID: Accessor<string>) => {
  const client = useClient()

  const state = () => chatStore[channelID()] || { messages: [], isFetching: false, hasMore: true }

  createEffect(async () => {
    const id = channelID()
    if (chatStore[id]) return

    setChatStore(id, { messages: [], isFetching: true, hasMore: true })

    try {
      const resp = await client.messages(id, CHUNK)
      const newMessages =
        resp.data?.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at)
        })) || []

      setChatStore(id, {
        messages: newMessages,
        isFetching: false,
        hasMore: newMessages.length === CHUNK
      })
    } catch {
      setChatStore(id, "isFetching", false)
    }
  })

  const loadMore = async () => {
    const id = channelID()
    const current = state()
    if (current.isFetching || !current.hasMore || current.messages.length === 0) return

    setChatStore(id, "isFetching", true)

    const oldestMessage = current.messages[current.messages.length - 1]

    try {
      const resp = await client.messages(id, CHUNK, oldestMessage.id)
      const newMessages =
        resp.data?.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at)
        })) || []

      setChatStore(id, {
        messages: [...current.messages, ...newMessages],
        isFetching: false,
        hasMore: newMessages.length === CHUNK
      })
    } catch {
      setChatStore(id, "isFetching", false)
    }
  }

  return {
    messages: () => state().messages,
    loading: () => state().isFetching && state().messages.length === 0,
    loadingMore: () => state().isFetching && state().messages.length > 0,
    hasMore: () => state().hasMore,
    loadMore
  }
}
