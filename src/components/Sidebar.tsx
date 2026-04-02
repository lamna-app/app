import { useNavigate } from "@solidjs/router"
import { Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { useUser } from "@/features/user"

import LogOut from "~icons/lucide/LogOut"

import type { Navigator } from "@solidjs/router"
import type { JSXElement } from "solid-js"
import type { MeResponse } from "@/types/client"

const UserBar = ({ user, navigate, logout }: { user: MeResponse; navigate: Navigator; logout: () => void }) => {
  const onClick = () => {
    logout()
    navigate("/login")
  }

  return (
    <div class="bg-light rounded-full absolute w-[90%] left-1/2 -translate-x-1/2 h-16 bottom-8 flex items-center gap-2">
      <img src="https://itswilli.dev/milo.jpg" class="size-18 rounded-full -ml-2" />
      <div class="flex flex-col">
        <h1 class="text-xl font-semibold">{user.username}</h1>
        <p class="text-sm text-gray-400">{user.id}</p>
      </div>

      <button onClick={onClick} class="absolute right-5 cursor-pointer hover:scale-105 transition-transform">
        <LogOut />
      </button>
    </div>
  )
}

export default function Sidebar({ children }: { children?: JSXElement }) {
  const navigate = useNavigate()
  const client = useClient()
  const user = useUser()

  return (
    <div class="bg-dark w-72 shrink-0 relative">
      {children}

      <Show when={user()}>{user => <UserBar user={user()} navigate={navigate} logout={() => client.logout()} />}</Show>
    </div>
  )
}
