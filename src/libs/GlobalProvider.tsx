import { createWS } from "@solid-primitives/websocket";
import { createSignal } from "solid-js";

import { GlobalContext } from "~/libs/context";
import { setStore, store } from "~/libs/store";

import type { MessageType } from "~/types";

// TODO: Fix type, don't use `any`
export default function GlobalProvider(props: any) {
  const websocket = createWS("ws://localhost:3000/ws");
  const [messages, setMessages] = createSignal<MessageType[]>([]);

  websocket.addEventListener("message", (event: MessageEvent<string>) => {
    console.debug(`WS Recv: ${event.data}`);

    const newMessage = {
      content: event.data,
      author: "Big Balls Jr. Sr.",
      id: 0,
    } satisfies MessageType;

    setMessages([...messages(), newMessage]);
  });

  setStore({ websocket, messages: { getter: messages, setter: setMessages } });

  return <GlobalContext.Provider value={{ store }}>{props.children}</GlobalContext.Provider>;
}
