import { Send } from "lucide-solid"

import { useClient } from "@/hooks/useClient"

import { useChannel } from "@/contexts/ChannelContext"

import { currentChannel } from "@/features/channel"
import Send from "~icons/lucide/Send"

export default function MessageInput() {
  const client = useClient()

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)

    const chn = currentChannel()
    const content = data.get("content") as string

    if (!content || !chn) return
    await client.sendMessage(chn.id, content)
    form?.reset()
  }

  return (
    <form onSubmit={onSubmit} class="px-6 pb-6 pt-2 shrink-0">
      <div class="w-full bg-dark rounded-xl flex items-center px-4 py-3 shadow-sm border border-dark/50 focus-within:border-indigo-500/50 transition-colors">
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
