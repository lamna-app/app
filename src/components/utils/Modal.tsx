import { createTimeline } from "animejs"
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js"
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

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  message?: string
  children: JSXElement
  actions?: ModalAction[]
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}

export default function Modal(props: ModalProps) {
  let dialogRef: HTMLDialogElement | undefined
  let backdropRef: HTMLDivElement | undefined

  const [loadingIndex, setLoadingIndex] = createSignal<Option<number>>(null)
  const [error, setError] = createSignal<Option<string>>(null)

  const isLoading = () => loadingIndex() !== null

  const syncDialog = () => {
    if (!dialogRef) return
    if (props.open && !dialogRef.open) dialogRef.showModal()
    else if (!props.open && dialogRef.open) dialogRef.close()
  }

  onMount(() => {
    syncDialog()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || !props.open) return

      e.preventDefault()
      e.stopImmediatePropagation()

      if (isLoading()) return
      if (props.closeOnEscape ?? true) closeWithAnimation()
    }
    window.addEventListener("keydown", handleKeyDown, true)
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown, true))
  })

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
        if (action.closeOnSuccess ?? true) closeWithAnimation()
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setLoadingIndex(null)
      }
    } else if (action.closeOnSuccess ?? true) {
      closeWithAnimation()
    }
  }

  const onBackdropClick = (e: MouseEvent) => {
    if (isLoading() || e.target !== dialogRef) return
    if (props.closeOnBackdrop ?? true) {
      const rect = dialogRef?.getBoundingClientRect()
      if (!rect) return

      const clickedOutside =
        e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom

      if (clickedOutside) {
        closeWithAnimation()
      }
    }
  }
  const closeWithAnimation = () => {
    if (!dialogRef || !backdropRef) return
    createTimeline({ defaults: { duration: 150, ease: "inQuad" } })
      .add([backdropRef, dialogRef], { opacity: [1, 0] }, 0)
      .add(dialogRef, { scale: [1, 0.95] }, 0)
      .then(() => props.onClose())
  }

  return (
    <>
      <Show when={props.open}>
        <Portal>
          <div ref={backdropRef} style={{ opacity: 0 }} class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          <dialog
            ref={el => {
              dialogRef = el
              queueMicrotask(() => {
                if (!el.open) el.showModal()
                if (!dialogRef) return
                createTimeline({ defaults: { duration: 150, playbackEase: "outQuad" } })
                  .add([backdropRef, el], { opacity: { from: 0, to: 1 } }, 0)
                  .add(el, { scale: { from: 0.95, to: 1 } }, 0)
              })
            }}
            onClick={onBackdropClick}
            style={{ opacity: 0, scale: 0.95 }}
            class="rounded-lg max-w-120 w-full bg-dark text-white p-6 m-auto"
          >
            <Show when={props.title}>
              <header class="flex justify-between items-center mb-2">
                <div class="grid gap-2">
                  <h1 class="text-2xl font-semibold">{props.title}</h1>
                  <Show when={props.subtitle}>
                    <p class="text-sm -mt-2 text-text/75">{props.subtitle}</p>
                  </Show>
                </div>
                <button
                  onClick={() => !isLoading() && closeWithAnimation()}
                  disabled={isLoading()}
                  aria-label="Close"
                  class="cursor-pointer hover:bg-light-hl p-1 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X />
                </button>
              </header>
            </Show>

            <Show when={error()}>
              <div class="mt-4 rounded-lg bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-3 py-2">
                {error()}
              </div>
            </Show>

            <Show when={props.message}>
              <div class="mt-4 rounded-lg bg-green-500/10 border border-green-500/40 text-green-300 text-sm px-3 py-2">
                {props.message}
              </div>
            </Show>

            <div classList={{ "mt-2": Boolean(props.message) || Boolean(error()) }}>{props.children}</div>

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
          opacity: 0;
        }`}
      </style>
    </>
  )
}
