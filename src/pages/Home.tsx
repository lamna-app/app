import { createSignal } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";

export default function Home() {
  // TODO: Retrieve externally
  const [messages, setMessages] = createSignal<Message[]>([]);

  return (
    <>
      <ChatLog messages={messages} />
      <ChatBar setMessages={setMessages} />
    </>
  );
}
