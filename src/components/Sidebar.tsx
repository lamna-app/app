import { createSignal, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { useUser } from "@/features/user"
import { users } from "@/features/users"
import Settings from "~icons/lucide/Settings"
import Menu, { type MenuItemProps } from "./common/Menu"
import SettingsModal from "./modals/SettingsModal"

import type { JSXElement } from "solid-js"
import type { MeResponse } from "@/types/client"
import type { UserPresence } from "@/types/models"

const UserBar = (props: { user: MeResponse }) => {
  const client = useClient()

  let triggerRef: HTMLDivElement | undefined

  const [isOpen, setIsOpen] = createSignal<boolean>(false)
  const [menuOpen, setMenuOpen] = createSignal<boolean>(false)

  const presence = () => users[props.user.id]?.presence ?? props.user.presence

  const changeStatus = async (status: UserPresence) => {
    await client.updatePresence(status)
  }

  const menuItems: MenuItemProps[] = [
    {
      label: "Online",
      icon: () => <div class="h-1 w-1 rounded-full bg-green-500" />,
      onClick: async () => await changeStatus("online")
    },
    {
      label: "Idle",
      icon: () => <div class="h-1 w-1 rounded-full bg-yellow-500" />,
      onClick: async () => await changeStatus("idle")
    },
    {
      label: "Do Not Disturb",
      icon: () => <div class="h-1 w-1 rounded-full bg-red-500" />,
      onClick: async () => await changeStatus("dnd")
    },
    {
      label: "Invisible",
      icon: () => <div class="h-1 w-1 rounded-full bg-gray-500" />,
      onClick: async () => await changeStatus("offline")
    }
  ]

  return (
    <div class="w-full p-3 relative">
      <div
        ref={triggerRef}
        onClick={() => setMenuOpen(!menuOpen())}
        class="flex items-center w-full gap-2 p-2 transition-colors bg-light/70 rounded-md select-none cursor-pointer hover:bg-light"
      >
        <div class="relative">
          <img src="https://itswilli.dev/milo.jpg" class="size-10 rounded-full" />
          <div
            classList={{
              "bg-green-500": presence() === "online",
              "bg-yellow-500": presence() === "idle",
              "bg-red-500": presence() === "dnd",
              "bg-gray-500": presence() === "offline"
            }}
            class={`absolute right-0 bottom-0 size-3 rounded-full border border-light`}
          />
        </div>

        <div class="flex flex-col flex-1 overflow-hidden">
          <h1 class="text-sm font-semibold leading-tight text-gray-200 truncate">{props.user.username}</h1>

          <p class="text-[11px] leading-tight text-gray-400 truncate">{props.user.id}</p>
        </div>

        <button
          onClick={e => {
            e.stopPropagation()
            setIsOpen(true)
          }}
          class="p-1.5 text-gray-400 transition-colors rounded-md hover:text-gray-100 cursor-pointer"
        >
          <Settings height={18} width={18} />
        </button>

        <SettingsModal open={isOpen()} onClose={() => setIsOpen(false)} />

        <div class="absolute bottom-full left-2 right-2 mt-2 z-50">
          <Menu open={menuOpen()} onClose={() => setMenuOpen(false)} items={menuItems} triggerRef={triggerRef} />
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ children, withUser }: { children?: JSXElement; withUser?: boolean }) {
  const user = useUser()

  return (
    <div class="flex flex-col shrink-0 h-full w-72 bg-dark">
      <div class="flex flex-col flex-1 overflow-hidden">{children}</div>

      <Show when={withUser && user()}>{user => <UserBar user={user()} />}</Show>
    </div>
  )
}
