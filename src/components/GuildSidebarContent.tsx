import { useGuild } from "@/contexts/GuildContext"
import { useChannels } from "@/hooks/useChannels"
import { Channel, Guild } from "@/types/models"
import { Accessor, For, Show } from "solid-js"

import { Hash } from "lucide-solid"
import { useChannel } from "@/contexts/ChannelContext"
import { type Navigator, useNavigate } from "@solidjs/router"

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
          <div
            onClick={() => onClick(channel)}
            classList={{
              "bg-light": channel.id == currentChannel()?.id
            }}
            class="hover:bg-light active:bg-light w-[90%] cursor-default rounded-lg p-1 font-medium">
            <span class="flex items-center gap-1">
              <Hash size={18} />
              {channel.name}
            </span>
          </div>
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
