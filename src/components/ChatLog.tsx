import { For } from "solid-js";

import Message from "./Message";

export default function ChatLog({ messages }: { messages: Message[] }) {
    console.log("Hello, world.");

    return (
        <div class="h-full w-full">
            <For each={messages}>{message => <Message message={message} />}</For>
        </div>
    );
}
