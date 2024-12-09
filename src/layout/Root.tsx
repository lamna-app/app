import clsx from "clsx";
import { createSignal } from "solid-js";

import ColourModeSwitch from "~/components/ColourModeSwitch";

export default function RootLayout(props: any) {
  const [isDarkMode, setIsDarkMode] = createSignal<boolean>(true);
  return (
    <div
      class={clsx(
        "box-border flex h-dvh w-dvw flex-col gap-4 bg-light-bg p-4 font-noto text-light-bg-text dark:bg-dark-bg dark:text-dark-bg-text",
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
