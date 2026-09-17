import { closeConfirm, confirmState } from "@/stores/confirmStore"

import Modal from "../utils/Modal"

export default function ConfirmModal() {
  const state = () => confirmState()

  return (
    <Modal
      title={state()?.title}
      open={!!state()}
      onClose={closeConfirm}
      actions={[
        { label: state()?.cancelLabel ?? "Cancel", variant: "ghost", onClick: closeConfirm },
        {
          label: state()?.confirmLabel ?? "Confirm",
          variant: state()?.variant ?? "danger",
          onClick: () => state()?.onConfirm()
        }
      ]}
    >
      {state()?.message}
    </Modal>
  )
}
