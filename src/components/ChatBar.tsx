import type { JSX } from "solid-js";

export default function ChatBar() {
  let elementReference!: HTMLInputElement;

  const addMessage: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = event => {
    const contentFound = event.currentTarget.value;

    if (event.key !== "Enter") {
      return;
    }
    if (!contentFound.trim()) {
      return;
    }

    fetch(`http://localhost:3000/createMessage?content=${contentFound}`);
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
