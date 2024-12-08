import { createEffect, For } from "solid-js";

import Message from "~/components/Message";

import type { Accessor } from "solid-js";

export default function ChatLog({ messages }: { messages: Accessor<Message[]> }) {
  let elementReference!: HTMLDivElement;

  const scrollToEnd = (_: any) =>
    elementReference.scrollTo({
      top: elementReference.scrollHeight,
    });

  createEffect(() => {
    scrollToEnd(messages());
  });

  return (
    <div class="flex h-full flex-col gap-4 overflow-y-scroll" ref={elementReference}>
      <For each={messages()}>{properties => <Message {...properties} />}</For>
    </div>
  );
}
