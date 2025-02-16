import { Accessor, createEffect, For } from "solid-js";

import Message from "~/components/Message";

import type { MessageType } from "~/types";

export default function ChatLog({ messages }: { messages: Accessor<MessageType[]> }) {
  let elementReference!: HTMLDivElement;

  const scrollToEnd = (_: any) =>
    elementReference.scrollTo({
      top: elementReference.scrollHeight,
      behavior: "smooth",
    });

  createEffect(() => {
    scrollToEnd(messages());
  });

  const shouldBeGrouped = (message: MessageType, idx: number): boolean => {
    return false;
  };

  return (
    <div class="verflow-y-scroll flex h-full flex-col" ref={elementReference}>
      <For each={messages()}>{(data, index) => <Message message={data} grouped={false} />}</For>
    </div>
  );
}
