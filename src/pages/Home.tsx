import { createSignal } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";

import type { MessageT } from "~/types";

export default function Home() {
  // TODO: Retrieve externally
  const [messages, setMessages] = createSignal<MessageT[]>([]);

  return (
    <>
      <ChatLog messages={messages} />
      <ChatBar setMessages={setMessages} />
    </>
  );
}
