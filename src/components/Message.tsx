export default function Message(properties: Message) {
  return (
    <div class="box-border flex min-h-28 flex-col gap-2.5 rounded-lg bg-black/10 p-4 text-black dark:bg-white/10 dark:text-white">
      <div class="text-md flex items-center gap-2.5 font-bold">
        <img src="/cee.png" class="w-12 rounded-full" />

        <span>{properties.author}</span>
        <span class="pt-1 text-xs text-black/40 dark:text-white/30">Today at 07:99</span>
      </div>

      <div>
        <p class="break-words">{properties.content}</p>
      </div>
    </div>
  );
}
