import { createEffect, createSignal } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Copy from "~icons/lucide/Copy"
import InputField from "../common/Input"
import Modal from "../utils/Modal"

import type { GuildModalConsumerProps } from "@/types/utils"

export default function CreateInviteModal(props: GuildModalConsumerProps) {
  const client = useClient()

  const [code, setCode] = createSignal<string>("")

  createEffect(async () => {
    if (!props.open) return
    setCode("")

    const { data } = await client.createInvite(props.guild.id, 3600, 0)
    setCode(data.code)
  })

  return (
    <Modal title={`Invite for ${props.guild.name}`} open={props.open} onClose={props.onClose}>
      <InputField onInput={e => (e.target.value = code())} value={code()} label="Invite Code">
        <button class="absolute cursor-pointer hover:opacity-80 transition-opacity right-2 top-1/2 -translate-y-1/2 ">
          <Copy width={18} height={18} />
        </button>
      </InputField>
    </Modal>
  )
}
