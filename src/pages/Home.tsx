import { useContext } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";
import { WebsocketContext } from "~/libs/websocket";

export default function Home() {
  const websocket = useContext(WebsocketContext);

  return (
    <>
      <ChatLog messages={websocket?.messages!} />
      <ChatBar />
    </>
  );
}
