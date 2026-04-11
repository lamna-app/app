import InputField from "../common/Input"
import Modal from "../utils/Modal"

interface AddServerModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (inviteCode: string) => Promise<void>
}

export default function AddServerModal(props: AddServerModalProps) {
  let inputRef: HTMLInputElement | undefined

  const onSubmit = async () => {
    if (!inputRef) return
    await props.onSubmit(inputRef.value)
  }

  return (
    <Modal
      title="Got an invite?"
      open={props.open}
      onClose={props.onClose}
      actions={[{ label: "Join Guild", variant: "primary", onClick: onSubmit }]}
    >
      <p class="text-sm -mt-2 text-text/75">Join an existing guild by entering the invite below</p>
      <div class="pt-4">
        <InputField ref={inputRef} label="Invite Code" placeholder="lamna.gg/abc123def" />
      </div>
    </Modal>
  )
}
