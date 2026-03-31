import { useNavigate } from "@solidjs/router"
import { Hash } from "lucide-solid"
import { For, Show } from "solid-js"

import { useChannels } from "@/hooks/useChannels"

import { useChannel } from "@/contexts/ChannelContext"
import { useGuild } from "@/contexts/GuildContext"

import type { Navigator } from "@solidjs/router"
import type { Accessor } from "solid-js"
import type { Channel, Guild } from "@/types/models"

const Channels = ({
  channels,
  guild,
  navigate
}: {
  channels: Accessor<Channel[] | undefined>
  guild: Guild
  navigate: Navigator
}) => {
  const { setChannel, channel: currentChannel } = useChannel()
  const onClick = (channel: Channel) => {
    setChannel(channel)
    navigate(`/channels/${guild.id}/${channel.id}`)
  }
  return (
    <div class="flex w-full flex-col items-center gap-2">
      <For each={channels()}>
        {channel => (
          <button
            onClick={() => onClick(channel)}
            classList={{
              "bg-light": channel.id === currentChannel()?.id
            }}
            class="hover:bg-light active:bg-light w-[90%] transition-colors duration-100 cursor-default rounded-lg p-1 font-medium"
          >
            <span class="flex items-center gap-1">
              <Hash size={18} />
              {channel.name}
            </span>
          </button>
        )}
      </For>
    </div>
  )
}

export default function GuildSidebarContent() {
  const { guild } = useGuild()

  const channels = useChannels()
  const navigate = useNavigate()

  return (
    <Show when={guild()}>
      {guild => (
        <div class="flex flex-col gap-4">
          <h1 class="pt-4 text-center text-2xl font-semibold">{guild().name}</h1>
          <Channels channels={channels} guild={guild()} navigate={navigate} />
        </div>
      )}
    </Show>
  )
}
