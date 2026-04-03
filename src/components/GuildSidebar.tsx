import { useNavigate } from "@solidjs/router"
import { For, Show } from "solid-js"

import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild } from "@/features/guild"
import ChevronDown from "~icons/lucide/ChevronDown"
import Hash from "~icons/lucide/Hash"
import Plus from "~icons/lucide/Plus"

import type { Navigator } from "@solidjs/router"
import type { Channel, Guild } from "@/types/models"

const ChannelItem = ({
  channel,
  isActive,
  onChannelClick
}: {
  channel: Channel
  isActive: boolean
  onChannelClick: (c: Channel) => void
}) => {
  return (
    <button
      onClick={() => onChannelClick(channel)}
      classList={{
        "bg-light text-white": isActive,
        "text-gray-500 hover:text-white hover:bg-light/20": !isActive
      }}
      class="w-[90%] transition-colors duration-100 cursor-default rounded-lg p-1 font-medium hover:cursor-pointer"
    >
      <span class="flex items-center gap-1">
        <Hash width={18} height={18} />

        {channel.name}
      </span>
    </button>
  )
}

const CategoryItem = ({
  category,
  channels,
  currentChannelId,
  onChannelClick,
  onNewChannel
}: {
  category: Channel
  channels: Channel[]
  currentChannelId?: string
  onChannelClick: (c: Channel) => void
  onNewChannel: (parentId: string) => void
}) => {
  return (
    <div class="flex w-full flex-col items-center gap-1 mt-2">
      <div class="flex items-center w-[90%] justify-between m-1 text-gray-400 group/category">
        <div class="flex items-center text-[11px] font-bold uppercase tracking-wider gap-1 cursor-pointer hover:text-gray-300">
          <ChevronDown height={11} width={11} />
          {category.name}
        </div>

        <Plus
          height={11}
          width={11}
          class="hidden group-hover/category:block cursor-pointer"
          onClick={() => onNewChannel(category.id)}
        />
      </div>

      <For each={channels}>
        {channel => (
          <ChannelItem channel={channel} isActive={channel.id === currentChannelId} onChannelClick={onChannelClick} />
        )}
      </For>
    </div>
  )
}

const Channels = ({ channels, navigate }: { channels: () => Channel[]; navigate: Navigator }) => {
  const categories = () => channels().filter(c => c.channel_type === 1)
  const uncategorizedChannels = () => channels().filter(c => c.channel_type !== 1 && c.parent_id === null)

  const getChildrenForCategory = (categoryId: string) => channels().filter(c => c.parent_id === categoryId)

  const onChannelClick = (channel: Channel) => {
    setCurrentChannel(channel)
    navigate(`/channels/${currentGuild()?.id}/${channel.id}`)
  }

  // TODO: present a modal or something with whatever they want for the channel
  const onNewChannel = (_parentId?: string) => {}

  return (
    <div class="flex w-full flex-col items-center gap-2">
      <For each={uncategorizedChannels()}>
        {channel => (
          <ChannelItem channel={channel} isActive={channel.id === currentChannel()?.id} onChannelClick={onChannelClick} />
        )}
      </For>

      <For each={categories()}>
        {category => (
          <CategoryItem
            category={category}
            channels={getChildrenForCategory(category.id)}
            currentChannelId={currentChannel()?.id}
            onChannelClick={onChannelClick}
            onNewChannel={onNewChannel}
          />
        )}
      </For>
    </div>
  )
}

const GuildBanner = ({ guild }: { guild: Guild }) => {
  return (
    <div
      class="flex items-end justify-between w-full h-26 p-4 group/server cursor-pointer border-b border-gray-900 shadow-sm transition-all bg-cover bg-center bg-no-repeat bg-linear-to-br from-gray-800/50 to-gray-900/80 hover:brightness-110 shrink-0"
      // style={{
      //   "background-image": guild().bannerUrl
      //     ? `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2), transparent), url('${guild().bannerUrl}')`
      //     : undefined
      // }}
    >
      <h1 class="text-[1.35rem] font-bold leading-tight tracking-tight text-gray-100 line-clamp-2 drop-shadow-md">
        {guild.name}
      </h1>

      <ChevronDown
        class="relative z-10 mb-1 text-gray-300 transition-all duration-200 opacity-0 group-hover/server:opacity-100 group-hover/server:translate-y-0.5"
        height={20}
        width={20}
      />
    </div>
  )
}

export default function GuildSidebarContent() {
  const navigate = useNavigate()

  return (
    <Show when={currentGuild()}>
      {guild => (
        <div class="flex flex-col h-full w-full select-none gap-2">
          <GuildBanner guild={guild()} />

          <div class="flex-1 overflow-y-auto">
            <Channels channels={() => channels[guild().id] ?? []} navigate={navigate} />
          </div>
        </div>
      )}
    </Show>
  )
}
