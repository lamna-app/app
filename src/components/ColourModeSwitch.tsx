import { Show } from "solid-js";

import type { Properties } from "~/types";

export default function ColourModeSwitch({ getter, setter }: Properties<boolean>) {
  // TODO: This is temporary, and the styling, etc. should be improved.

  const fallback = <img src="/app/icons/sun.svg" class="invert" />;

  return (
    <button
      onClick={() => setter(a => !a)}
      class="absolute z-50 rounded-full bg-black p-2 transition-all dark:bg-white"
    >
      <Show when={getter()} fallback={fallback}>
        <img src="/app/icons/moon.svg" />
      </Show>
    </button>
  );
}
