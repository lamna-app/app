import { createSignal, For, onCleanup, onMount, Show } from "solid-js"
import { Portal } from "solid-js/web"

import { closeContextMenu, contextMenu } from "@/stores/contextMenuStore"

import { MenuItem } from "./Menu"

export default function ContextMenu() {
  let menuRef: HTMLDivElement | undefined

  const [style, setStyle] = createSignal<{ left: string; top: string }>({ left: "0px", top: "0px" })

  onMount(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!contextMenu()) return
      if (menuRef?.contains(e.target as Node)) return
      closeContextMenu()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeContextMenu()
    }

    document.addEventListener("click", onDocClick, true)
    document.addEventListener("contextmenu", onDocClick, true)
    document.addEventListener("scroll", closeContextMenu, true)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("blur", closeContextMenu)

    onCleanup(() => {
      document.removeEventListener("click", onDocClick, true)
      document.removeEventListener("contextmenu", onDocClick, true)
      document.removeEventListener("scroll", closeContextMenu, true)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("blur", closeContextMenu)
    })
  })

  const place = (el: HTMLDivElement) => {
    const menu = contextMenu()
    if (!menu) return

    const rect = el.getBoundingClientRect()
    const x = Math.min(menu.x, window.innerWidth - rect.width - 8)
    const y = Math.min(menu.y, window.innerHeight - rect.height - 8)

    setStyle({ left: `${Math.max(x, 8)}px`, top: `${Math.max(y, 8)}px` })
  }

  return (
    <Show when={contextMenu()}>
      {menu => (
        <Portal>
          <div
            ref={el => {
              menuRef = el
              queueMicrotask(() => place(el))
            }}
            style={{ position: "fixed", left: style().left, top: style().top, "z-index": 100 }}
            class="bg-dark border border-white/5 rounded-lg p-1 shadow-lg shadow-black/40 min-w-40"
          >
            <For each={menu().items}>
              {item => (
                <MenuItem
                  {...item}
                  onClick={() => {
                    item.onClick()
                    closeContextMenu()
                  }}
                />
              )}
            </For>
          </div>
        </Portal>
      )}
    </Show>
  )
}
