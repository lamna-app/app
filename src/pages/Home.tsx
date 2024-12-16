import { Event, listen } from "@tauri-apps/api/event";
import { createSignal } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";

export default function Home() {
  const [messages, setMessages] = createSignal<Message[]>([]);

  listen("", (event: Event<MessageCreateEvent>) => {
    console.log("Payload:", event.payload);

    const newMessage: Message = {
      id: Math.floor(Math.random() * 100_000),
      author: "Big Balls Jr. Sr.",
      content: event.payload.message,
    };

    setMessages([...messages(), newMessage]);
  });

  return (
    <>
      <ChatLog messages={messages} />
      <ChatBar />
    </>
  );
}
