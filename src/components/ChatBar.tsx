import { createMemo, createSignal } from "solid-js";

import type { MessageType } from "~/types";

import type { JSX, Setter } from "solid-js";

export default function ChatBar({ setMessages }: { setMessages: Setter<MessageType[]> }) {
  const [content, setContent] = createSignal<string>("");
  const isEmpty = createMemo(() => content().trim() === "");

  const addMessage: JSX.EventHandler<HTMLFormElement, SubmitEvent> = event => {
    event.preventDefault();

    const newMessage: MessageType = {
      id: Math.floor(Math.random() * 100_000),
      author: "Big Balls Jr. Sr.",
      content: content(),
    };

    setMessages(previousMessages => [...previousMessages, newMessage]);
    setContent("");
  };

  return (
    <form onSubmit={addMessage}>
      <div class="box-border flex items-center rounded-lg bg-black/10 p-3 dark:bg-white/5">
        <input
          name="content"
          class="h-full flex-1 bg-transparent text-black outline-none dark:text-white"
          type="text"
          placeholder="Send a messsage in #general"
          value={content()}
          onInput={e => setContent(e.target.value)}
          autocomplete="off"
        />
        <button
          type="submit"
          disabled={isEmpty()}
          class="w-6 opacity-40 hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-20 dark:invert"
        >
          <img src="/app/icons/paper-plane.svg" />
        </button>
      </div>
    </form>
  );
}
