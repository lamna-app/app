import { createSignal } from "solid-js"

import { useClient } from "@/hooks/useClient"

import InputField from "../common/Input"
import Modal from "../utils/Modal"

import type { GuildModalConsumerProps } from "@/types/utils"

export default function CreateChannelModal(props: GuildModalConsumerProps) {
  const client = useClient()
  const [channelName, setChannelName] = createSignal<string>("")

  const onClick = async () => {
    if (!channelName()) return
    await client.createChannel(props.guild.id, channelName())
  }

  return (
    <Modal
      title="Create a channel"
      open={props.open}
      onClose={props.onClose}
      actions={[{ label: "Create channel", variant: "primary", onClick: onClick }]}
    >
      <InputField placeholder="general" label="Channel Name" onInput={e => setChannelName(e.target.value)} />
    </Modal>
  )
}
