export default function Message(properties: Message) {
  return (
    <div class="box-border flex min-h-28 flex-col gap-2.5 rounded-lg bg-black/50 p-4 text-white dark:bg-white/10">
      <div class="text-md flex items-center gap-2.5 font-bold">
        <img src="/app/cee.png" class="w-12 rounded-full" />

        <span>{properties.author}</span>
      </div>

      <div>
        <p class="break-words">{properties.content}</p>
      </div>
    </div>
  );
}
