import { A } from "@solidjs/router";
import clsx from "clsx";
import { createSignal } from "solid-js";

import ColourModeSwitch from "~/components/ColourModeSwitch";

export default function RootLayout(props: any) {
  const [isDarkMode, setIsDarkMode] = createSignal<boolean>(true);

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
        </div>
      </div>

      {props.children}
    </div>
  );
}
