import { For, Show } from "solid-js"

import MessageInput from "@/components/MessageInput"
import { currentChannel } from "@/features/channel"
import { useMessages } from "@/features/message"

import type { Message as MessageT } from "@/types/models"

function Message({ message, compact }: { message: MessageT; compact: boolean }) {
  const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div class="flex flex-col w-full min-w-0" style={{ "margin-top": compact ? "0.125rem" : "1rem" }}>
      {!compact && (
        <div>
          <span class="text-lg font-semibold">{message.author.username}</span>
          <span class="text-xs text-gray-500 ml-2">{formattedTime}</span>
        </div>
      )}

      <div class="break-all whitespace-pre-wrap ">{message.content}</div>
    </div>
  )
}

export default function Channel() {
  return (
    <Show when={currentChannel()}>
      {channel => {
        const messages = useMessages(() => channel().id)

        return (
          <div class="flex flex-col h-full">
            <div class="grow px-8 overflow-y-auto flex flex-col-reverse mb-2">
              <For each={messages()}>{msg => <Message message={msg} compact={false} />}</For>
            </div>

            <MessageInput />
          </div>
        )
      }}
    </Show>
  )
}
