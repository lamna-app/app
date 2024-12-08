import { createSignal } from "solid-js";

import ChatBar from "../components/ChatBar";
import ChatLog from "../components/ChatLog";

export default function Home() {
  const [messages, setMessages] = createSignal<Message[]>([]);
  console.log(messages());
  return (
    <div class="flex h-screen w-screen flex-col overflow-hidden">
      <div class="overflow-auto">
        <ChatLog messages={messages} />
      </div>
      <ChatBar setMessages={setMessages} />
    </div>
  );
}
