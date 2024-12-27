import { useNavigate } from "@solidjs/router";
import { isTauri } from "@tauri-apps/api/core";
import clsx from "clsx";
import { createSignal } from "solid-js";

import ColourModeSwitch from "~/components/ColourModeSwitch";

export default function RootLayout(props: any) {
  const [isDarkMode, setIsDarkMode] = createSignal<boolean>(true);

  // Make sure that the correct route it used.
  if (isTauri()) {
    useNavigate()("/");
  }

  return (
    <div
      class={clsx(
        "box-border flex h-dvh w-dvw flex-col gap-4 bg-light-bg p-4 text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text",
        isDarkMode() && "dark",
      )}
    >
      <div class="absolute right-0 w-16">
        <ColourModeSwitch getter={isDarkMode} setter={setIsDarkMode} />
      </div>

      {props.children}
    </div>
  );
}
