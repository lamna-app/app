import moment from "moment";

import { setStore, store } from "~/libs/store";
import { MessageType } from "~/types";

export default function ChatBar() {
  const formHandler = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!event.currentTarget) return;

    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const content = formData.get("content");

    if (!content) return;

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/channels/0/messages`, {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
      });
    } finally {
      (event.target as HTMLFormElement).reset();
    }
  };
  return (
    <form onSubmit={formHandler}>
      <div class="box-border flex items-center rounded-lg bg-gray-300 p-3 dark:bg-white/5">
        <input
          name="content"
          class="h-full flex-1 bg-transparent text-black outline-none dark:text-white"
          type="text"
          placeholder="Send a messsage in #general"
          autocomplete="off"
        />

        <button
          type="submit"
          // disabled={isEmpty()}
          class="w-6 opacity-40 hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-20 dark:invert"
        >
          <img src="/app/icons/paper-plane.svg" />
        </button>
      </div>
    </form>
  );
}
