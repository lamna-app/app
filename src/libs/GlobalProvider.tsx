import { createWS } from "@solid-primitives/websocket";
import { createSignal, JSX } from "solid-js";

import { GlobalContext } from "~/libs/context";
import { setStore, store } from "~/libs/store";

import type { MessageType } from "~/types";

export default function GlobalProvider(props: Record<any, JSX.Element>) {
  const websocket = createWS("ws://localhost:3000/ws");
  const [messages, setMessages] = createSignal<MessageType[]>([]);

  websocket.addEventListener("message", (event: MessageEvent<string>) => {
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
