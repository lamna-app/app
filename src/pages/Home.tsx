import { useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";

import ChatBar from "~/components/ChatBar";
import ChatLog from "~/components/ChatLog";
import { store } from "~/libs/store";

export default function Home() {
  const navigate = useNavigate();

  createEffect(() => {
    if (!store.isAuthed) {
      navigate("/login");
    }
  });

  return (
    <>
      <ChatLog />
      <ChatBar />
    </>
  );
}
