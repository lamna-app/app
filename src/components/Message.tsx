import type { MessageType } from "~/types";

export default function Message(message: MessageType) {
  return (
    <div class="box-border flex w-full origin-bottom transform flex-row items-start gap-2 rounded-lg bg-gray-300 p-4 dark:bg-white/5">
      <div class="mb-auto aspect-square size-6 hover:cursor-pointer">
        <img
          class="size-full rounded-full"
          src="https://avatars.githubusercontent.com/u/190493638"
        />
      </div>

      <div class="mb-auto flex h-6 items-center">
        <span class="whitespace-nowrap pr-2 font-bold text-gray-700 dark:text-white/85">
          Lamna User
        </span>
      </div>

      <div class="flex w-full flex-col gap-2.5">
        <div class="group flex flex-row gap-2">
          <p class="w-full text-gray-900 dark:text-white">{message.content}</p>

          <p class="transition-animate h-full italic text-gray-500 opacity-0 duration-300 group-hover:opacity-100">
            7:99
          </p>
        </div>
      </div>
    </div>
  );
}
