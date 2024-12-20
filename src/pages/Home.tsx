import { createSignal } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";

import type { MessageType } from "~/types";

export default function Home() {
  // TODO: Retrieve externally
  const [messages, setMessages] = createSignal<MessageType[]>([]);

  return (
    <>
      <ChatLog messages={messages} />
      <ChatBar setMessages={setMessages} />
    </>
  );
}
