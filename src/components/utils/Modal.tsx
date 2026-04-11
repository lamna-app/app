import { createEffect, createSignal, onMount, Show } from "solid-js"
import { Portal } from "solid-js/web"

import Loader from "~icons/lucide/loader-circle"
import X from "~icons/lucide/x"

import type { JSXElement } from "solid-js"

interface ModalAction {
  label: string
  onClick: () => void | Promise<void>
  variant?: "primary" | "danger" | "ghost"
  disabled?: boolean
  closeOnSuccess?: boolean
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

  const [loadingIndex, setLoadingIndex] = createSignal<number | null>(null)
  const [error, setError] = createSignal<string | null>(null)

  const isLoading = () => loadingIndex() !== null

  const syncDialog = () => {
    if (!dialogRef) return
    if (props.open && !dialogRef.open) dialogRef.showModal()
    else if (!props.open && dialogRef.open) dialogRef.close()
  }

  onMount(() => syncDialog())

  createEffect(() => {
    if (props.open) {
      setLoadingIndex(null)
      setError(null)
    }
  })

  const handleAction = async (action: ModalAction, index: number) => {
    if (isLoading() || action.disabled) return
    setError(null)

    let result: void | Promise<void>
    try {
      result = action.onClick()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
      return
    }

    if (result && typeof (result as Promise<void>).then === "function") {
      setLoadingIndex(index)
      try {
        await result
        if (action.closeOnSuccess ?? true) props.onClose()
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoadingIndex(null)
      }
    } else if (action.closeOnSuccess ?? true) {
      props.onClose()
    }
  }

  const onBackdropClick = (e: MouseEvent) => {
    if (isLoading()) return
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
                  onClick={() => !isLoading() && props.onClose()}
                  disabled={isLoading()}
                  aria-label="Close"
                  class="cursor-pointer hover:bg-light-hl p-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X />
                </button>
              </header>
            </Show>

            <div>{props.children}</div>

            <Show when={error()}>
              <div class="mt-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-3 py-2">
                {error()}
              </div>
            </Show>

            <Show when={props.actions?.length}>
              <div class="flex justify-end gap-2 mt-5">
                {props.actions?.map((action, i) => {
                  const thisLoading = () => loadingIndex() === i
                  return (
                    <button
                      onClick={() => handleAction(action, i)}
                      disabled={action.disabled || isLoading()}
                      classList={{
                        "bg-indigo-400 hover:bg-indigo-500": action.variant === "primary",
                        "bg-red-400 hover:bg-red-500": action.variant === "danger",
                        "bg-light-hl hover:bg-dark": action.variant === "ghost"
                      }}
                      class="py-2 px-3 rounded-xl font-semibold cursor-pointer disabled:cursor-not-allowed! disabled:opacity-60 transition-colors duration-200 select-none inline-flex items-center gap-2 justify-center"
                    >
                      <Show when={thisLoading()}>
                        <Loader class="animate-spin" width={16} height={16} />
                      </Show>
                      {action.label}
                    </button>
                  )
                })}
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
