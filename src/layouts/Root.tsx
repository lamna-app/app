import clsx from "clsx";
import { createSignal } from "solid-js";

export default function RootLayout(props: any) {
  const [isDarkMode, setIsDarkMode] = createSignal<boolean>(true);

  return (
    <div
      class={clsx(
        "box-border h-dvh w-dvw p-4 dark:bg-dark-bg dark:text-dark-bg-text",
        isDarkMode() && "dark",
      )}
    >
      {props.children}
    </div>
  );
}
