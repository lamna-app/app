import { createSignal } from "solid-js"

import type { ComponentProps, JSXElement } from "solid-js"
import type Button from "@/components/common/Button"

export type ConfirmOptions = {
  title: string
  message: JSXElement
  confirmLabel?: string
  cancelLabel?: string
  variant?: ComponentProps<typeof Button>["variant"]
  onConfirm: () => void | Promise<void>
}

export const [confirmState, setConfirmState] = createSignal<Option<ConfirmOptions>>(null)

export function confirm(options: ConfirmOptions) {
  setConfirmState(options)
}

export function closeConfirm() {
  setConfirmState(null)
}
