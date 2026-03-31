import { For } from "solid-js"
import MessageInput from "@/components/MessageInput"
import { useMessages } from "@/hooks/useMessages"

export default function Channel() {
  const messages = useMessages()
  return (
    <div>
      <div class="mt-4 ml-8 flex flex-col-reverse">
        <For each={messages()}>
          {message => (
            <div class="flex flex-col">
              <span class="text-lg font-semibold">{message.author.username}</span>
              <span>{message.content}</span>
            </div>
          )}
        </For>
      </div>
      <div class="sticky bottom-0">
        <MessageInput />
      </div>
    </div>
  )
}
