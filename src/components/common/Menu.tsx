import { For, onCleanup, onMount, Show } from "solid-js"

import type { Component } from "solid-js"

export type MenuItemProps = {
  label: string
  onClick: () => void
  icon?: Component<{ class?: string; width?: number; height?: number }>
  variant?: "default" | "danger"
  disabled?: boolean
}

type MenuProps = {
  open: boolean
  onClose?: () => void
  items: MenuItemProps[]
  triggerRef?: HTMLElement
}

function MenuItem(props: MenuItemProps) {
  return (
    <button
      onClick={() => !props.disabled && props.onClick()}
      disabled={props.disabled}
      classList={{
        "hover:bg-light text-text": props.variant !== "danger" && !props.disabled,
        "text-danger hover:bg-danger/15 hover:text-danger": props.variant === "danger" && !props.disabled,
        "text-text/40 cursor-not-allowed": props.disabled
      }}
      class="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-sm font-medium text-left transition-colors duration-100 cursor-pointer"
    >
      {props.icon && <props.icon width={15} height={15} class="shrink-0 opacity-75" />}
      <span>{props.label}</span>
    </button>
  )
}

export default function Menu(props: MenuProps) {
  let menuRef: HTMLDivElement | undefined

  onMount(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!props.open) return
      const target = e.target as Node
      if (menuRef?.contains(target) || props.triggerRef?.contains(target)) return
      props.onClose?.()
    }
    document.addEventListener("click", onDocClick)
    onCleanup(() => document.removeEventListener("click", onDocClick))
  })
  return (
    <Show when={props.open}>
      <div ref={menuRef} class="bg-dark border border-white/5 rounded-lg p-1 shadow-lg shadow-black/40">
        <For each={props.items}>{item => <MenuItem {...item} />}</For>
      </div>
    </Show>
  )
}
