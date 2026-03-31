import { createEffect, createResource, createSignal } from "solid-js"

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
  const [guilds] = createResource(async () => {
    return (await client.guilds()).data
  })

  const [guild, setGuild] = createSignal<Option<Guild>>(null)
  const [channel, setChannel] = createSignal<Option<Channel>>(null)

  createEffect(() => {
    guild()
    setChannel(null)
  })

  return (
    <GuildContext.Provider value={{ guild, setGuild }}>
      <ChannelContext.Provider value={{ channel, setChannel }}>
        {/* */}
        <div class="flex h-screen flex-col overflow-hidden">
          <ServerPicker guilds={guilds} />
          <div class="flex min-h-0 flex-1">
            <Sidebar>
              <GuildSidebarContent />
            </Sidebar>
            <main class="min-w-0 flex-1 overflow-hidden">{props.children}</main>
          </div>
        </div>
        {/* */}
      </ChannelContext.Provider>
    </GuildContext.Provider>
  )
}
