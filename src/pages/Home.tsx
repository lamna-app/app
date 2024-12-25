import { useContext } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";
import { GlobalContext } from "~/libs/context";

export default function Home() {
  const context = useContext(GlobalContext)!;

  return (
    <>
      <ChatLog messages={context.store.messages?.getter!} />
      <ChatBar />
    </>
  );
}
