import { useNavigate } from "@solidjs/router"
import { createEffect, createSignal, onMount } from "solid-js"

import { useGuildSocket } from "@/hooks/socket/useGuildsSocket"
import { useMessageSocket } from "@/hooks/socket/useMessageSocket"
import { useSocket } from "@/hooks/socket/useSocket"
import { useClient } from "@/hooks/useClient"

import ChannelContext from "@/contexts/ChannelContext"
import GuildContext from "@/contexts/GuildContext"

import GuildSidebarContent from "@/components/GuildSidebarContent"
import ServerPicker from "@/components/ServerPicker"
import Sidebar from "@/components/Sidebar"

import type { JSXElement } from "solid-js"
import type { Channel, Guild } from "@/types/models"

export default function HomeLayout<T extends { children?: JSXElement }>(props: T) {
  const client = useClient()
  const navigate = useNavigate()
  const socket = useSocket()

  onMount(async () => {
    try {
      await client.me()
    } catch {
      navigate("/login")
    }

    socket.connect(localStorage.getItem("token") as string)
  })

  useGuildSocket()
  useMessageSocket()

  const [guild, setGuild] = createSignal<Option<Guild>>(null)
  const [channel, setChannel] = createSignal<Option<Channel>>(null)

  createEffect(() => {
    guild()
    setChannel(null)
  })

  return (
    <GuildContext.Provider value={{ guild, setGuild }}>
      <ChannelContext.Provider value={{ channel, setChannel }}>
        <div class="flex h-screen overflow-hidden flex-col">
          <ServerPicker />

          <div class="flex min-h-0 flex-1">
            <Sidebar>
              <GuildSidebarContent />
            </Sidebar>

            <main class="flex-1">{props.children}</main>
          </div>
        </div>
      </ChannelContext.Provider>
    </GuildContext.Provider>
  )
}
