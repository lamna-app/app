import { useLocation, useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

import { useClient } from "@/hooks/useClient"
import { useSocket } from "@/hooks/useSocket"

import { setUser } from "@/stores/userStore"

import GuildPicker from "@/components/GuildPicker"
import GuildSidebar from "@/components/GuildSidebar"
import Sidebar from "@/components/Sidebar"
import UserSidebar from "@/components/UserSidebar"
import { registerEvents } from "@/features/socket/events"

import type { JSXElement } from "solid-js"

export default function HomeLayout<T extends { children?: JSXElement }>(props: T) {
  const client = useClient()
  const navigate = useNavigate()
  const location = useLocation()
  const socket = useSocket()

  onMount(async () => {
    try {
      const { data: me } = await client.me()

      setUser(me)
    } catch {
      if (location.pathname !== "/login") {
        const currentPath = encodeURIComponent(location.pathname)
        navigate(`/login?redirect=${currentPath}`, { replace: true })
      }
    }

    if (!socket.isOpen()) {
      registerEvents(socket)
      socket.connect(localStorage.getItem("token") as string)
    }
  })

  return (
    <div class="flex h-screen overflow-hidden flex-col">
      <GuildPicker />

      <div class="flex min-h-0 flex-1">
        <Sidebar withUser={true}>
          <GuildSidebar />
        </Sidebar>

        <main class="flex-1">{props.children}</main>

        <Sidebar>
          <UserSidebar />
        </Sidebar>
      </div>
    </div>
  )
}
