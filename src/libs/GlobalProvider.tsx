import { createWS } from "@solid-primitives/websocket";
import moment from "moment";
import { createSignal } from "solid-js";

import { GlobalContext } from "~/libs/context";
import { setStore, store, StoreData } from "~/libs/store";

import type { MessageType } from "~/types";

type APIMessageResponse = {
  id: string;
  content: string;
  timestamp: string;
};

// TODO: Fix type, don't use `any`
export default function GlobalProvider(props: any) {
  const websocket = createWS(import.meta.env.VITE_WS_URL);
  const [messages, setMessages] = createSignal<MessageType[]>([]);

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/channels/0/messages`).then(data =>
    data.json().then((json: APIMessageResponse[]) => {
      let toAdd = [] as MessageType[];

      json.forEach(i => {
        const date = moment(i.timestamp, moment.ISO_8601);

        const msg = {
          author: "Lamna User",
          content: i.content,
          id: i.id,
          timestamp: date,
        } satisfies MessageType;

        toAdd.push(msg);
      });

      toAdd.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
      setMessages([...messages(), ...toAdd]);
    }),
  );

  websocket.addEventListener("message", (event: MessageEvent<string>) => {
    const message = JSON.parse(event.data);

    const newMessage = {
      id: message.id,
      author: "Lamna User",
      content: message.content,
      timestamp: moment(message.timestamp, moment.ISO_8601),
    } satisfies MessageType;

    setMessages([...messages(), newMessage]);
  });

  websocket.addEventListener("close", (_: CloseEvent) => {
    // we need to handle this better, but for now this is fine.
    window.location.reload();
  });

  setStore({
    websocket,
    messages: { getter: messages, setter: setMessages },
  } satisfies StoreData);

  return <GlobalContext.Provider value={{ store }}>{props.children}</GlobalContext.Provider>;
}
