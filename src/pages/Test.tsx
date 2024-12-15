import { invoke } from "@tauri-apps/api/core";

export default function Test() {
  return (
    <button
      onClick={() => {
        // can be async too afaik
        invoke("send_message", { msg: "Hello, world." });
      }}
    >
      please click me
    </button>
  );
}
