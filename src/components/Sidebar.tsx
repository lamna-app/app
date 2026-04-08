import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { useUser } from "@/features/user"
import Settings from "~icons/lucide/Settings"

import type { Navigator } from "@solidjs/router"
import type { JSXElement } from "solid-js"
import type { MeResponse } from "@/types/client"

const UserBar = ({ user, navigate, logout }: { user: MeResponse; navigate: Navigator; logout: () => void }) => {
  const onClick = () => {
    logout()
    navigate("/login")
  }

  return (
    <div class="w-full p-3">
      <div class="flex items-center w-full gap-2 p-2 transition-colors bg-light/70 rounded-md select-none">
        <img src="https://itswilli.dev/milo.jpg" class="size-10 rounded-full" />

        <div class="flex flex-col flex-1 overflow-hidden">
          <h1 class="text-sm font-semibold leading-tight text-gray-200 truncate">{user.username}</h1>

          <p class="text-[11px] leading-tight text-gray-400 truncate">{user.id}</p>
        </div>

        <button
          onClick={onClick}
          class="p-1.5 text-gray-400 transition-colors rounded-md hover:text-gray-100 cursor-pointer"
        >
          <Settings height={18} width={18} />
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ children }: { children?: JSXElement }) {
  const navigate = useNavigate()
  const client = useClient()

  const user = useUser()

  return (
    <div class="flex flex-col shrink-0 h-full w-72 bg-dark">
      <div class="flex flex-col flex-1 overflow-hidden">{children}</div>

      <Show when={user()}>{user => <UserBar user={user()} navigate={navigate} logout={() => client.logout()} />}</Show>
    </div>
  )
}
