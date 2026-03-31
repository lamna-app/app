import { For } from "solid-js"

import { useMessages } from "@/hooks/useMessages"

import MessageInput from "@/components/MessageInput"

import type { Message as MessageT } from "@/types/models"

function Message(message: MessageT) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div class="flex flex-col">
      <div>
        <span class="text-lg font-semibold">{message.author.username}</span>
        <span class="text-xs text-gray-500 ml-2">{formattedTime}</span>
      </div>

      <span>{message.content}</span>
    </div>
  )
}

export default function Channel() {
  const messages = useMessages()

  return (
    <div class="flex flex-col h-full">
      <div class="grow px-4 overflow-y-auto flex flex-col-reverse space-y-2">
        <For each={messages()}>{message => <Message {...message} />}</For>
      </div>

      <MessageInput />
    </div>
  )
}
