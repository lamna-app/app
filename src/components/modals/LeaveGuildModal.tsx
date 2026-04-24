import { useNavigate } from "@solidjs/router"

import { useClient } from "@/hooks/useClient"

import Modal from "../utils/Modal"

import type { GuildModalConsumerProps } from "@/types/utils"

export default function LeaveGuildModal(props: GuildModalConsumerProps) {
  const client = useClient()
  const navigate = useNavigate()

  const onClick = async () => {
    await client.leaveGuild(props.guild.id)
    // Let the animation play before navigating
    setTimeout(() => navigate("/channels/@me"), 200)
  }

  return (
    <Modal
      title={`Leave ${props.guild.name}`}
      open={props.open}
      onClose={props.onClose}
      actions={[
        { label: "Cancel", variant: "ghost", onClick: props.onClose },
        { label: "Leave", variant: "danger", onClick }
      ]}
    >
      <span class="text-gray-400 ">
        Are you sure you want to leave <span class=" font-extrabold">{props.guild.name}</span>? You'll need a new invite link
        to join back.
      </span>
    </Modal>
  )
}
