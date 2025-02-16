import { createWS } from "@solid-primitives/websocket";
import { createSignal } from "solid-js";

import { GlobalContext } from "~/libs/context";
import { setStore, store } from "~/libs/store";

import type { MessageType } from "~/types";

// TODO: Fix type, don't use `any`
export default function GlobalProvider(props: any) {
  const websocket = createWS("ws://100.88.207.41:3000/api/v1/ws");
  const [messages, setMessages] = createSignal<MessageType[]>([]);

  fetch("http://100.88.207.41:3000/api/v1/channels/2/messages", { mode: "no-cors" }).then(data =>
    console.log(data),
  );

  websocket.addEventListener("message", (event: MessageEvent<string>) => {
    console.debug(`WS Recv: ${event.data}`);

    const newMessage = {
      id: 0,
      author: "Big Balls Jr. Sr.",
      content: event.data,
    } satisfies MessageType;

    setMessages([...messages(), newMessage]);
  });

  setStore({ websocket, messages: { getter: messages, setter: setMessages } });

  return <GlobalContext.Provider value={{ store }}>{props.children}</GlobalContext.Provider>;
}
