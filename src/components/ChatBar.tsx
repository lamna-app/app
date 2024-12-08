import type { JSX, Setter } from "solid-js";

export default function ChatBar({ setMessages }: { setMessages: Setter<Message[]> }) {
  let elementReference!: HTMLInputElement;

  const addMessage: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    const contentFound = event.currentTarget.value;

    if (event.key !== "Enter") {
      return;
    } else if (!contentFound.trim()) {
      elementReference.value = "";

      return;
    }

    const newMessage: Message = {
      id: 1,
      author: "Big Balls Jr. Sr.",
      content: contentFound,
    };

    setMessages(previousMessages => [...previousMessages, newMessage]);
    elementReference.value = "";
  };

  return (
    <input
      class="rounded-lg p-3 text-black outline-none"
      ref={elementReference}
      type="text"
      onKeyPress={addMessage}
    />
  );
}
