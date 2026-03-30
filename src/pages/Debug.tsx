import { useClient } from "@/hooks/useClient"
import { MeResponse } from "@/types/client"
import { createSignal } from "solid-js"

const Me = () => {
  const client = useClient()
  const [me, setMe] = createSignal<MeResponse>()

  const onClick = async () => {
    const { data } = await client.me()
    setMe(data)
  }

  return (
    <div>
      <p>Username: {me()?.username}</p>
      <p>Email: {me()?.email}</p>
      <p>ID: {me()?.id}</p>
      <button onClick={onClick} class="border border-white p-1">
        Me
      </button>
    </div>
  )
}

export default function Debug() {
  return (
    <div class="flex w-screen gap-4">
      <Me />
    </div>
  )
}
