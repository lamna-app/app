import { createMemo, createSignal } from "solid-js";

import type { JSX } from "solid-js";

export default function ChatBar() {
  const [content, setContent] = createSignal<string>("");
  const isEmpty = createMemo(() => content().trim() === "");

  const addMessage: JSX.EventHandler<HTMLFormElement, SubmitEvent> = event => {
    event.preventDefault();

    fetch("http://localhost:3000/v1/createMessage", {
      method: "POST",
      body: JSON.stringify({ content: content() }),
      mode: "no-cors", // FIXME: Fix CORS.
    });

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
