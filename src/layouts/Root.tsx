import { A, useNavigate } from "@solidjs/router";
import clsx from "clsx";
import { createEffect, createSignal } from "solid-js";

import ColourModeSwitch from "~/components/ColourModeSwitch";
import { setStore, store, tempGetCookie, tempSetCookie } from "~/libs/store";

export default function RootLayout(props: any) {
  const [isDarkMode, setIsDarkMode] = createSignal<boolean>(true);
  const navigate = useNavigate();

  createEffect(async () => {
    const cookie = tempGetCookie("lamna-auth");
    if (cookie) {
      setStore("auth", { auth: cookie, refresh: "" });
      setStore("isAuthed", true);
      let resp;
      try {
        resp = await fetch(import.meta.env.VITE_BACKEND_URL + `/api/v1/me`, {
          headers: { Authorisation: `Bearer ${cookie}` },
        });
      } catch (err) {
        console.error(err);
        return;
      }

      const json = await resp.json();
      setStore("user", { username: json.username, id: json.id });
    }
  });

  return (
    <div
      class={clsx(
        "box-border flex h-dvh w-dvw flex-col gap-4 bg-light-bg p-4 text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text",
        isDarkMode() && "dark",
      )}
    >
      <div class="absolute right-0 top-0 z-[99] m-4">
        <div class="flex h-max w-full flex-col gap-2 p-2">
          <ColourModeSwitch getter={isDarkMode} setter={setIsDarkMode} />
          <div class="flex flex-col font-semibold">
            <A href="/">Home</A>
            <A href="/login">Login</A>
          </div>
          <div>
            <div class="flex flex-col gap-2">
              <div>
                User:
                <br />
                {store.user?.username}
              </div>
              <button
                onClick={() => {
                  tempSetCookie("");
                  setStore("auth", {});
                  setStore("isAuthed", false);
                  setStore("user", {});
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {props.children}
    </div>
  );
}
