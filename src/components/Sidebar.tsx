import { createSignal, Show } from "solid-js"

import { useUser } from "@/features/user"
import Settings from "~icons/lucide/Settings"
import SettingsModal from "./modals/SettingsModal"

import type { JSXElement } from "solid-js"
import type { MeResponse } from "@/types/client"

const UserBar = ({ user }: { user: MeResponse }) => {
  const [isOpen, setIsOpen] = createSignal<boolean>(false)

  return (
    <div class="w-full p-3">
      <div class="flex items-center w-full gap-2 p-2 transition-colors bg-light/70 rounded-md select-none">
        <img src="https://itswilli.dev/milo.jpg" class="size-10 rounded-full" />

        <div class="flex flex-col flex-1 overflow-hidden">
          <h1 class="text-sm font-semibold leading-tight text-gray-200 truncate">{user.username}</h1>

          <p class="text-[11px] leading-tight text-gray-400 truncate">{user.id}</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          class="p-1.5 text-gray-400 transition-colors rounded-md hover:text-gray-100 cursor-pointer"
        >
          <Settings height={18} width={18} />
        </button>

        <SettingsModal open={isOpen()} onClose={() => setIsOpen(false)} />
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
