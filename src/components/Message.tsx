export default function Message({ message }: { message: Message }) {
    return (
        <div class="flex min-h-28 flex-col gap-2.5 rounded-lg border bg-white/10 p-4 text-white">
            <div class="text-md flex items-center gap-2.5 font-bold">
                <img src="/cee.png" class="w-12 rounded-full" />
                <span class="">
                    {message.author} ({message.author})
                </span>
            </div>
            <div>
                <p class="break-words">{message.content}</p>
            </div>
        </div>
    );
}
