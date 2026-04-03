import { useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

import { useClient } from "@/hooks/useClient"
import { useSocket } from "@/hooks/useSocket"

import { setUser } from "@/stores/userStore"

import GuildPicker from "@/components/GuildPicker"
import GuildSidebar from "@/components/GuildSidebar"
import Sidebar from "@/components/Sidebar"
import { registerEvents } from "@/features/socket/events"

import type { JSXElement } from "solid-js"

export default function HomeLayout<T extends { children?: JSXElement }>(props: T) {
  const client = useClient()
  const navigate = useNavigate()
  const socket = useSocket()

  onMount(async () => {
    try {
      setUser((await client.me()).data)
    } catch {
      navigate("/login")
    }

    if (!socket.isOpen()) {
      registerEvents(socket)
      socket.connect(localStorage.getItem("token") as string)
    }
  })

  // createEffect(() => {
  //   const g = guild()
  //   const c = channels()
  //   if (!g || !c || c.length === 0) {
  //     setChannel(null)
  //     return
  //   }
  //   setChannel(c[0])
  // })

  return (
    <div class="flex h-screen overflow-hidden flex-col">
      <GuildPicker />

      <div class="flex min-h-0 flex-1">
        <Sidebar>
          <GuildSidebar />
        </Sidebar>

        <main class="flex-1">{props.children}</main>
      </div>
    </div>
  )
}
