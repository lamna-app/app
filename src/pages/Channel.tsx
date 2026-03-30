import { useMessages } from "@/hooks/useMessages"
import { For } from "solid-js"

export default function Channel() {
  const messages = useMessages()
  return (
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
  )
}
