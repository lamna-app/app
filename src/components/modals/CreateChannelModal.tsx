import { useClient } from "@/hooks/useClient"

import { channels } from "@/features/channel"
import { ChannelType } from "@/types/utils"
import InputField, { Label } from "../common/Input"
import RadioInput from "../common/RadioInput"
import Modal from "../utils/Modal"

import type { GuildModalConsumerProps } from "@/types/utils"

interface CreateChannelModalProps extends GuildModalConsumerProps {
  parentChannel?: string
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
  const client = useClient()

  const onClick = async () => {
    const form = document.getElementById("create-channel-form")
    const data = new FormData(form as HTMLFormElement)

    const channelName = data.get("channel-name") as string
    const channelType = data.get("channel-type") as string

    if (!channelName || !channelType) return

    await client.createChannel(props.guild.id, channelName, Number(channelType), props.parentChannel)
    props.onClose()
  }

  const subtitle = () => {
    if (!props.parentChannel) return undefined
    const ch = channels[props.guild.id]?.find(ch => ch.id === props.parentChannel)

    return ch ? `in ${ch.name}` : undefined
  }

  return (
    <Modal
      title="Create Channel"
      subtitle={subtitle()}
      open={props.open}
      actions={[{ label: "Create", variant: "primary", onClick }]}
    >
      <form
        class="space-y-4 my-5"
        id="create-channel-form"
        onSubmit={e => {
          e.preventDefault()
          onClick()
        }}
      >
        <div>
          <Label>Channel Type</Label>

          <div class="mt-1 space-y-2">
            <RadioInput
              label="Text Channel"
              description="Send messages, images & files"
              value={ChannelType.TextChannel}
              name="channel-type"
              default={true}
            />

            {!props.parentChannel && (
              <RadioInput
                label="Category Channel"
                description="Organize Channels into groups"
                value={ChannelType.CategoryChannel}
                name="channel-type"
              />
            )}

            <RadioInput
              label="Voice Channel"
              description="Communicate through audio & video"
              value={ChannelType.VoiceChannel}
              name="channel-type"
            />
          </div>
        </div>

        <InputField placeholder="General" label="Channel Name" name="channel-name" />
      </form>
    </Modal>
  )
}
