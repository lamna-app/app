import { Accessor, Setter, Show } from "solid-js";

export default function ColourModeSwitch({
  getter,
  setter,
}: {
  getter: Accessor<boolean>;
  setter: Setter<boolean>;
}) {
  // FIXME: This is temporary, and the styling, etc. should be improved.
  return (
    <button
      onClick={() => setter(a => !a)}
      class="absolute rounded-full bg-black p-2 transition-all dark:bg-white"
    >
      <Show when={getter()} fallback={<img src="/icons/sun.svg" class="invert" />}>
        <img src="/icons/moon.svg" />
      </Show>
    </button>
  );
}
