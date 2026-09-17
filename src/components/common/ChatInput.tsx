import { createEffect } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { currentChannel } from "@/features/channel"
import { cancelReply, replyingTo } from "@/features/messageDraft"
import Plus from "~icons/lucide/Plus"
import Smile from "~icons/lucide/Smile"
import X from "~icons/lucide/x"

export default function MessageInput() {
  const client = useClient()

  createEffect(() => {
    const reply = replyingTo()
    if (reply && reply.channel_id !== currentChannel()?.id) cancelReply()
  })

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)

    const chn = currentChannel()
    const content = data.get("content") as string

    if (!content || !chn) return

    await client.sendMessage(chn.id, content, replyingTo()?.id)
    cancelReply()
    form?.reset()
  }

  return (
    <form onSubmit={onSubmit} class="px-6 pb-6 pt-2 shrink-0">
      {replyingTo() && (
        <div class="w-full bg-dark/70 rounded-t-xl flex items-center justify-between px-4 py-1.5 text-sm text-gray-400 border border-b-0 border-dark/50">
          <span>
            Replying to <span class="font-semibold text-gray-300">{replyingTo()?.author.username}</span>
          </span>

          <button
            type="button"
            onClick={cancelReply}
            class="cursor-pointer hover:text-gray-200 transition-colors"
            aria-label="Cancel reply"
          >
            <X width={16} height={16} />
          </button>
        </div>
      )}

      <div
        classList={{ "rounded-t-none": Boolean(replyingTo()) }}
        class="w-full bg-dark rounded-xl flex items-center px-4 py-3 shadow-sm border border-dark/50 focus-within:border-indigo-500/50 transition-colors"
      >
        <button class="cursor-pointer hover:text-gray-400 transition-colors mr-3">
          <Plus />
        </button>

        <input
          type="text"
          name="content"
          class="flex-1 bg-transparent border-none outline-none text-md"
          placeholder={`Message #${currentChannel()?.name} `}
          autocomplete="off"
        />

        <button class="cursor-pointer hover:text-gray-400 transition-colors">
          <Smile />
        </button>
      </div>
    </form>
  )
}
