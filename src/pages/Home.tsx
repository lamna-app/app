import { listen } from "@tauri-apps/api/event";
import { createSignal } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";

export default function Home() {
  // TODO: Retrieve externally
  const [messages, setMessages] = createSignal<Message[]>([]);

  listen("messageCreate", (e: any) => {
    // TODO: Type payload
    console.log("Payload:", e.payload);

    const newMessage: Message = {
      id: Math.floor(Math.random() * 100_000),
      author: "Big Balls Jr. Sr.",
      content: e.payload.message,
    };

    setMessages([...messages(), newMessage]);
  });

  return (
    <>
      <a href="/test">Go to Test</a>
      <ChatLog messages={messages} />
      <ChatBar />
    </>
  );
}
