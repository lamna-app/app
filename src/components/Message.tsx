import clsx from "clsx";

import type { MessageType } from "~/types";

export default function Message({ message, grouped }: { message: MessageType; grouped: boolean }) {
  return (
    <div
      class="box-border flex w-full origin-bottom transform flex-row items-start gap-2 rounded-lg bg-gray-300 p-4 dark:bg-white/5"
      style={{
        "border-radius": grouped ? "0" : undefined,
        transform: grouped ? "none" : undefined,
      }}
      data-grouped={grouped}
    >
      <div class="author flex gap-2">
        <div class="mb-auto aspect-square size-6 hover:cursor-pointer">
          <img
            class="size-full rounded-full"
            src="https://avatars.githubusercontent.com/u/190493638"
          />
        </div>

        <div class="mb-auto flex h-6 items-center">
          <span class="whitespace-nowrap pr-2 font-bold text-gray-700 dark:text-white/85">
            {message.author}
          </span>
        </div>
      </div>
      <div class="flex w-full flex-col gap-2.5">
        <div class="group flex flex-row gap-2">
          <p class="flex-1 text-gray-900 dark:text-white">{message.content}</p>

          <p
            class={clsx(
              "transition-animate h-full w-max select-none italic text-black opacity-0 duration-200 group-hover:opacity-100 dark:text-white",
              "hover:opacity-20",
            )}
          >
            {message.timestamp.calendar()}
          </p>
        </div>
      </div>
    </div>
  );
}
