import { useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"

import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild } from "@/features/guild"
import ChevronDown from "~icons/lucide/ChevronDown"
import Hash from "~icons/lucide/Hash"
import Plus from "~icons/lucide/Plus"

import type { Navigator } from "@solidjs/router"
import type { Channel } from "@/types/models"

const Channels = ({ channels, navigate }: { channels: () => Channel[]; navigate: Navigator }) => {
  const onClick = (channel: Channel) => {
    setCurrentChannel(channel)
    navigate(`/channels/${currentGuild()?.id}/${currentChannel()?.id ?? ""}`)
  }

  // TODO: present a modal or something with whatever they want for the channel
  const onNewChannel = () => {}

  return (
    <div class="flex w-full flex-col items-center gap-2">
      <div class="flex items-center w-[90%] justify-between m-1 text-gray-400 group/category">
        <div class="flex items-center text-[11px] font-bold uppercase tracking-wider gap-1">
          <ChevronDown height={11} width={11} />
          Text Channels
        </div>

        <Plus height={11} width={11} class="hidden group-hover/category:block cursor-pointer" onClick={onNewChannel} />
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
  const navigate = useNavigate()

  return (
    <Show when={currentGuild()}>
      {guild => (
        <div class="flex flex-col gap-4 overflow-y-auto select-none cursor-pointer">
          <div
            class="flex items-end justify-between w-full h-26 p-4 group/server cursor-pointer border-b border-gray-900 shadow-sm transition-all bg-cover bg-center bg-no-repeat bg-linear-to-br from-gray-800/50 to-gray-900/80 hover:brightness-110"
            // style={{
            //   "background-image": guild().bannerUrl
            //     ? `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent), url('${guild().bannerUrl}')`
            //     : undefined
            // }}
          >
            <h1 class="text-[1.35rem] font-bold leading-tight tracking-tight text-gray-100 line-clamp-2 drop-shadow-md">
              {guild().name}
            </h1>

            <ChevronDown
              class="relative z-10 mb-1 text-gray-300 transition-all duration-200 opacity-0 group-hover/server:opacity-100 group-hover/server:translate-y-0.5"
              height={20}
              width={20}
            />
          </div>

          <Channels channels={() => channels[guild().id] ?? []} navigate={navigate} />
        </div>
      )}
    </Show>
  )
}
