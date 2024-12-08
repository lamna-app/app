import { Accessor, For } from "solid-js";

import Message from "./Message";

export default function ChatLog({ messages }: { messages: Accessor<Message[]> }) {
  console.log("Hello, world.");

  return (
    <div class="flex h-full w-full flex-col gap-4">
      <For each={messages()}>{message => <Message message={message} />}</For>
    </div>
  );
}
