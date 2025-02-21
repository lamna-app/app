import { useNavigate } from "@solidjs/router";
import { createEffect, useContext } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";
import { GlobalContext } from "~/libs/context";

export default function Home() {
  const context = useContext(GlobalContext)!;
  const navigate = useNavigate();

  createEffect(() => {
    if (!context.store.isAuthed?.getter()) {
      navigate("/login");
    }
  });

  return (
    <>
      <ChatLog messages={context.store.messages?.getter!} />
      <ChatBar />
    </>
  );
}
