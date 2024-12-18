import { createWS } from "@solid-primitives/websocket";
import { createSignal } from "solid-js";

import { WebsocketContext } from "./websocket";

export default function WebsocketProvider(props: any) {
  const websocket = createWS("ws://localhost:3000/ws");
  const [messages, setMessages] = createSignal<Message[]>([]);

  // TODO: Don't do message logic inside the websocket provider.
  websocket.addEventListener("message", (event: MessageEvent<string>) => {
    const newMessage = {
      content: event.data,
      author: "Big Balls Jr. Sr.",
      id: 0,
    } satisfies Message;
    setMessages([...messages(), newMessage]);
  });

  return (
    <WebsocketContext.Provider value={{ websocket, messages, setMessages }}>
      {props.children}
    </WebsocketContext.Provider>
  );
}
