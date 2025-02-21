import { createWS } from "@solid-primitives/websocket";
import moment from "moment";
import { ParentProps } from "solid-js";

import { setStore } from "~/libs/store";

import type { MessageType } from "~/types";

type Properties = ParentProps;
type APIMessageResponse = {
  id: string;
  content: string;
  timestamp: string;
};

export default function GlobalProvider(properties: Properties) {
  const websocket = createWS(import.meta.env.VITE_WS_URL);

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
      setStore("messages", messages => [...messages, ...toAdd]);
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

    setStore("messages", messages => [...messages, newMessage]);
  });

  websocket.addEventListener("close", (_: CloseEvent) => {
    // we need to handle this better, but for now this is fine.
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  });

  setStore("websocket", websocket);

  // return <GlobalContext.Provider value={{ store }}>{properties.children}</GlobalContext.Provider>;
  return <>{properties.children}</>;
}
