import { createEffect, For } from "solid-js";

import Message from "~/components/Message";

import type { Message as MessageType } from "~/types";
import type { Moment } from "moment";

import "~/assets/styles/ChatLog.css";

import { store } from "~/libs/store";

export default function ChatLog() {
  let elementReference!: HTMLDivElement;

  const scrollToEnd = (_: any) =>
    elementReference.scrollTo({
      top: elementReference.scrollHeight,
      behavior: "smooth",
    });

  createEffect(() => {
    scrollToEnd(store.messages);
  });

  const isConsecutive = (before: Moment, after: Moment) => after.diff(before) < 1 * 60 * 1000;

  const shouldBeGrouped = (message: MessageType, idx: number): boolean => {
    const previousMessage = store.messages[idx - 1];
    if (!previousMessage) return false;

    return (
      isConsecutive(previousMessage.timestamp, message.timestamp) &&
      previousMessage.author.id == message.author.id
    );
  };

  return (
    <div
      id="message-container"
      class="flex h-full flex-col overflow-y-scroll"
      ref={elementReference}
    >
      <For each={store.messages.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))}>
        {(data, index) => <Message message={data} grouped={shouldBeGrouped(data, index())} />}
      </For>
    </div>
  );
}
