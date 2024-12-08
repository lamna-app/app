import type { JSX, Setter } from "solid-js";

export default function ChatBar({ setMessages }: { setMessages: Setter<Message[]> }) {
  const addMessage: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    if (event.key !== "Enter") {
      return;
    }

    const newMessage: Message = {
      id: 1,
      author: "Big Balls Jr. Sr.",
      content: event.currentTarget.value,
    };

    setMessages(previousMessages => [...previousMessages, newMessage]);
  };

  return (
    <input class="rounded-lg p-3 text-black outline-none" type="text" onKeyPress={addMessage} />
  );
}
