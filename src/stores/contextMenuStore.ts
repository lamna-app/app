import { createSignal } from "solid-js"

import type { MenuItemProps } from "@/components/common/Menu"

type ContextMenuState = {
  x: number
  y: number
  items: MenuItemProps[]
}

export const [contextMenu, setContextMenu] = createSignal<Option<ContextMenuState>>(null)

export function openContextMenu(e: MouseEvent, items: MenuItemProps[]) {
  e.preventDefault()
  e.stopPropagation()

  setContextMenu({ x: e.clientX, y: e.clientY, items })
}

export function closeContextMenu() {
  setContextMenu(null)
}
