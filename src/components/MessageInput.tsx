import { useChannel } from "@/contexts/ChannelContext"
import { useClient } from "@/hooks/useClient"

export default function MessageInput() {
  const client = useClient()
  const { channel } = useChannel()

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget as HTMLFormElement)

    const chn = channel()
    const content = data.get("content") as string

    if (!content || !chn) return
    await client.sendMessage(chn.id, content)
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="content" class="border" placeholder="message" />
      <button type="submit">send</button>
    </form>
  )
}
