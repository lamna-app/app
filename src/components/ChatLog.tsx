import { Accessor, createEffect, For } from "solid-js";

import Message from "~/components/Message";

import type { MessageType } from "~/types";

export default function ChatLog({ messages }: { messages: Accessor<MessageType[]> }) {
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
