import { splitProps } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { ChannelType } from "@/types/utils"
import InputField, { Label } from "../common/Input"
import Modal from "../utils/Modal"

import type { JSX } from "solid-js"
import type { GuildModalConsumerProps } from "@/types/utils"

type Props = {
  label: string
  description: string
  value: number
  default?: boolean
} & JSX.InputHTMLAttributes<HTMLInputElement>

function RadioOption(props: Props) {
  const [local, rest] = splitProps(props, ["value", "label", "description", "default"])

  const _for = `${local.value}-item`

  return (
    <div class="flex items-center">
      <input
        type="radio"
        class="appearance-none w-6 h-6 rounded border-2 border-gray-600 
               checked:bg-blue-600 cursor-pointer relative shrink-0"
        id={_for}
        checked={local.default ?? false}
        value={local.value}
        {...rest}
      />

      <label for={_for} class="flex items-center cursor-pointer text-sm">
        <div class="block ml-3">
          <span class="text-sm w-full">{local.label}</span>

          <p class="text-gray-400 mt-0.5 w-full">{local.description}</p>
        </div>
      </label>
    </div>
  )
}

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

  return (
    <Modal title="Create Channel" open={props.open} actions={[{ label: "Create", variant: "primary", onClick }]}>
      <form
        class="space-y-4"
        id="create-channel-form"
        onSubmit={e => {
          e.preventDefault()
          onClick()
        }}
      >
        <div>
          <Label>Channel Type</Label>

          <div class="mt-1 space-y-2">
            <RadioOption
              label="Text Channel"
              description="Send messages, images & files"
              value={ChannelType.TextChannel}
              name="channel-type"
              default={true}
            />

            {!props.parentChannel && (
              <RadioOption
                label="Category Channel"
                description="Organize Channels into groups"
                value={ChannelType.CategoryChannel}
                name="channel-type"
              />
            )}

            <RadioOption
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
