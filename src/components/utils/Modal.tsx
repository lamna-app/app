import { onMount, Show } from "solid-js"
import { Portal } from "solid-js/web"

import X from "~icons/lucide/x"

import type { JSXElement } from "solid-js"

interface ModalAction {
  label: string
  onClick: () => void
  variant?: "primary" | "danger" | "ghost"
  disabled?: boolean
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: JSXElement
  actions?: ModalAction[]
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export default function Modal(props: ModalProps) {
  let dialogRef: HTMLDialogElement | undefined

  const syncDialog = () => {
    if (!dialogRef) return
    if (props.open && !dialogRef.open) dialogRef.showModal()
    else if (!props.open && dialogRef.open) dialogRef.close()
  }

  onMount(() => syncDialog())

  const onBackdropClick = (e: MouseEvent) => {
    if (props.closeOnBackdrop ?? true) {
      const rect = dialogRef?.getBoundingClientRect()
      if (!rect) return

      const clickedOutside =
        e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom

      if (clickedOutside) {
        props.onClose()
      }
    }
  }

  return (
    <>
      <Show when={props.open}>
        <Portal>
          <dialog
            ref={el => {
              dialogRef = el
              queueMicrotask(() => {
                if (!el.open) el.showModal()
              })
            }}
            onClick={onBackdropClick}
            class="rounded-lg max-w-120 w-full bg-dark text-white p-6 absolute top-1/2 left-1/2 -translate-1/2"
          >
            <Show when={props.title}>
              <header class="flex justify-between items-center mb-2">
                <h1 class="text-2xl font-semibold">{props.title}</h1>
                <button
                  onClick={props.onClose}
                  aria-label="Close"
                  class="cursor-pointer hover:bg-light-hl p-1 rounded-lg transition-colors"
                >
                  <X />
                </button>
              </header>
            </Show>

            <div>{props.children}</div>

            <Show when={props.actions?.length}>
              <div class="flex justify-end gap-2 mt-5">
                {props.actions?.map(action => (
                  <button
                    onClick={action.onClick}
                    disabled={action.disabled}
                    classList={{
                      "bg-indigo-400 hover:bg-indigo-500": action.variant === "primary",
                      "bg-red-400 hover:bg-red-500": action.variant === "danger",
                      "bg-light-hl hover:bg-dark": action.variant === "ghost"
                    }}
                    class="py-2 px-3 rounded-xl font-semibold cursor-pointer disabled:cursor-not-allowed! transition-colors duration-200 select-none"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </Show>
          </dialog>
        </Portal>
      </Show>

      <style>
        {`dialog:open::backdrop {
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
        }`}
      </style>
    </>
  )
}
