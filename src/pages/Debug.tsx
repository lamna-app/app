import { createSignal } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Modal from "@/components/utils/Modal"

import type { MeResponse } from "@/types/client"

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
  const [isOpen, setisOpen] = createSignal<boolean>(true)
  return (
    <div class="flex w-screen gap-4">
      <Me />
      <Modal
        open={isOpen()}
        onClose={() => setisOpen(false)}
        title="modal bober"
        actions={[
          { label: "Ghost", onClick: () => console.log("click ghost"), variant: "ghost" },
          { label: "Primary", onClick: () => console.log("click primary"), variant: "primary" },
          { label: "Danger", onClick: () => console.log("click danger"), variant: "danger" }
        ]}
      >
        <p>helloworld</p>
        <p>helloworld</p>
        <p>helloworld</p>
        <p>helloworld</p>
        <p>helloworld</p>
        <p>helloworld</p>
      </Modal>
    </div>
  )
}
