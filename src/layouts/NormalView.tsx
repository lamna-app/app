import { createWS } from "@solid-primitives/websocket";
import moment from "moment";

import { APIClient } from "~/libs/client";
import { setStore } from "~/libs/store";

export default function NormalView(props: any) {
  const websocket = createWS(import.meta.env.VITE_WS_URL);

  APIClient.channelHistory(1).then(({ data }) => {
    setStore("messages", messages => [...messages, ...data]);
  });

  websocket.addEventListener("message", (event: MessageEvent<string>) => {
    const message = JSON.parse(event.data);
    const newMessage = {
      ...message,
      timestamp: moment(message.timestamp, moment.ISO_8601),
    };

    setStore("messages", messages => [...messages, newMessage]);
  });

  websocket.addEventListener("close", (_: CloseEvent) => {
    // TODO: we need to handle this better, but for now this is fine.
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  });

  setStore("websocket", websocket);
  return (
    <>
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      {props.children}
    </>
  );
}
