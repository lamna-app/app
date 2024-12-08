import { Setter } from "solid-js";

export default function ChatBar({ setMessages }: { setMessages: Setter<Message[]> }) {
  const doThing = (content: string): Message => {
    return {
      id: 1,
      author: "Big Balls Jr. Sr.",
      content,
    } satisfies Message;
  };
  return (
    <input
      class="w-full rounded-lg p-3 text-black outline-none"
      type="text"
      onKeyPress={e => {
        if (e.key == "Enter") {
          setMessages(a => [...a, doThing(e.currentTarget.value)]);
        }
      }}
    />
  );
}
