import { useNavigate } from "@solidjs/router"
import { ChevronDown, Hash, Plus } from "lucide-solid"
import { createEffect, For, For, Show, Show } from "solid-js"

import { useChannels } from "@/hooks/useChannels"

import { useChannel } from "@/contexts/ChannelContext"
import { useGuild } from "@/contexts/GuildContext"

import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { useGuild } from "@/features/guild"
import Hash from "~icons/lucide/home"

import type { Navigator } from "@solidjs/router"
import type { Channel, Guild } from "@/types/models"

const Channels = ({ channels, guild, navigate }: { channels: () => Channel[]; guild: Guild; navigate: Navigator }) => {
  // createEffect(() => {
  //   const chns = channels()
  //   if (!chns || chns.length === 0) return
  //   onClick(chns[0])
  // })

  const onClick = (channel: Channel) => {
    setCurrentChannel(channel)
    navigate(`/channels/${guild.id}/${channel.id}`)
  }

  // present a modal or something with whatever they want for the channel
  const onNewChannel = () => {}

  return (
    <div class="flex w-full flex-col items-center gap-2 select-none">
      <div class="flex items-center w-[90%] justify-between m-1 text-gray-400 group">
        <div class="flex items-center text-[11px] font-bold uppercase tracking-wider gap-1">
          <ChevronDown size={11} />
          Text Channels
        </div>

        <Plus size={11} class="hidden group-hover:block cursor-pointer" onClick={onNewChannel} />
      </div>

      <For each={channels()}>
        {channel => (
          <button
            onClick={() => onClick(channel)}
            classList={{
              "bg-light text-white": channel.id === currentChannel()?.id,
              "text-gray-500 hover:text-white hover:bg-light/20": channel.id !== currentChannel()?.id
            }}
            class="w-[90%] transition-colors duration-100 cursor-default rounded-lg p-1 font-medium hover:cursor-pointer"
          >
            <span class="flex items-center gap-1">
              <Hash width={18} height={18} />
              {channel.name}
            </span>
          </button>
        )}
      </For>
    </div>
  )
}

export default function GuildSidebarContent() {
  const guild = useGuild()

  const navigate = useNavigate()

  return (
    <Show when={guild()}>
      {guild => (
        <div class="flex flex-col gap-4">
          <h1 class="pt-4 text-center text-2xl font-semibold">{guild().name}</h1>
          <Channels channels={() => channels[guild().id] ?? []} guild={guild()} navigate={navigate} />
        </div>
      )}
    </Show>
  )
}
