import { useClient } from "@/hooks/useClient"

import { useChannel } from "@/contexts/ChannelContext"

import Send from "~icons/lucide/Send"

export default function MessageInput() {
  const client = useClient()
  const { channel } = useChannel()

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const form = e.currentTarget as HTMLFormElement
    const data = new FormData(form)

    const chn = channel()
    const content = data.get("content") as string

    if (!content || !chn) return
    await client.sendMessage(chn.id, content)
    form?.reset()
  }

  return (
    <form onSubmit={onSubmit} class="p-2 flex">
      <div class="relative w-full">
        <input
          type="text"
          name="content"
          class="w-full bg-light-hl rounded-lg font-medium p-3 outline-none"
          placeholder={`Send a message to ${channel()?.name} `}
          autocomplete="off"
        />

        <button type="submit" class="absolute right-3 top-3.5">
          <Send height={24} width={24} />
        </button>
      </div>
    </form>
  )
}
