import { Accessor, Context, createContext, Setter } from "solid-js";
import type { MessageType } from "~/types";

// FIXME: Don't pass message signal through the websocket context data.
type WebsocketContextData = {
  websocket: WebSocket;
  messages: Accessor<MessageType[]>;
  setMessages: Setter<MessageType[]>;
};

export const WebsocketContext: Context<WebsocketContextData | undefined> = createContext(undefined);

export function sendWSMessage(ws: WebSocket, message: string) {
  ws.send(message);
}
