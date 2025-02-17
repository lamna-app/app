import { Accessor, createEffect, For } from "solid-js";

import Message from "~/components/Message";

import type { MessageType } from "~/types";
import type { Moment } from "moment";

import "~/assets/styles/ChatLog.css";

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

  const isConsecutive = (before: Moment, after: Moment) => after.diff(before) < 1 * 60 * 1000;

  const shouldBeGrouped = (message: MessageType, idx: number): boolean => {
    const message_store = messages();

    const afterMessage = message_store[idx - 1];
    if (!afterMessage) return false;

    return isConsecutive(afterMessage.timestamp, message.timestamp);
  };

  return (
    <div
      id="message-container"
      class="flex h-full flex-col overflow-y-scroll"
      ref={elementReference}
    >
      <For each={messages()}>
        {(data, index) => <Message message={data} grouped={shouldBeGrouped(data, index())} />}
      </For>
    </div>
  );
}
