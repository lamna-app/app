import { Accessor, Context, createContext, Setter } from "solid-js";

// FIXME: Don't pass message signal through the websocket context data.
type WebsocketContextData = {
  websocket: WebSocket;
  messages: Accessor<Message[]>;
  setMessages: Setter<Message[]>;
};

export const WebsocketContext: Context<WebsocketContextData | undefined> = createContext(undefined);

export function sendWSMessage(ws: WebSocket, message: string) {
  ws.send(message);
}
