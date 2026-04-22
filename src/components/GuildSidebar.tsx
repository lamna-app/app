import { useNavigate } from "@solidjs/router"
import { createSignal, For, Show } from "solid-js"

import { createModalRouter, ModalRouterProvider, useModalRouter } from "@/hooks/useModalRouter"

import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild } from "@/features/guild"
import { ChannelType } from "@/types/utils"
import ChevronDown from "~icons/lucide/ChevronDown"
import Hash from "~icons/lucide/Hash"
import Plus from "~icons/lucide/Plus"
import UserPlus from "~icons/lucide/UserPlus"
import Menu from "./common/Menu"
import CreateChannelModal from "./modals/CreateChannelModal"
import CreateInviteModal from "./modals/CreateInviteModal"

import type { Channel, Guild } from "@/types/models"
import type { MenuItemProps } from "./common/Menu"

type GuildModal = "createChannel" | "createInvite" | "leave"

function GuildBanner(props: { guild: Guild }) {
  const [menuOpen, setMenuOpen] = createSignal<boolean>(false)
  const modals = useModalRouter<GuildModal>()

  const openModal = (modal: GuildModal) => {
    setMenuOpen(false)
    modals.open(modal)
  }

  const menuItems = [
    { label: "Create invite", icon: UserPlus, onClick: () => openModal("createInvite") },
    { label: "Create channel", icon: Hash, onClick: () => openModal("createChannel") }
  ] satisfies MenuItemProps[]

  return (
    <div class="relative shrink-0">
      <div
        onClick={e => {
          e.stopImmediatePropagation()
          setMenuOpen(!menuOpen())
        }}
        class="flex items-end justify-between w-full h-26 p-4 group/server cursor-pointer border-b border-gray-900 shadow-sm transition-all bg-cover bg-center bg-no-repeat bg-linear-to-br from-gray-800/50 to-gray-900/80 hover:brightness-110 shrink-0"
      >
        <h1 class="text-[1.35rem] font-bold leading-tight tracking-tight text-gray-100 line-clamp-2 drop-shadow-md">
          {props.guild.name}
        </h1>

        <ChevronDown
          class="relative z-10 mb-1 text-gray-300 transition-all duration-200 opacity-0 group-hover/server:opacity-100 group-hover/server:translate-y-0.5"
          height={20}
          width={20}
        />
      </div>

      <div class="absolute top-full left-2 right-2 mt-2 z-50">
        <Menu open={menuOpen()} onClose={() => setMenuOpen(false)} items={menuItems} />
      </div>

      <CreateInviteModal
        open={modals.isOpen("createInvite")}
        onClose={modals.close}
        guild={props.guild}
        {...modals.getArgs("createInvite")}
      />

      <CreateChannelModal
        open={modals.isOpen("createChannel")}
        onClose={modals.close}
        guild={props.guild}
        {...modals.getArgs<{ parentChannel: string }>("createChannel")}
      />
    </div>
  )
}

function ChannelItem(props: { channel: Channel; isActive: boolean; onChannelClick: (c: Channel) => void }) {
  return (
    <button
      onClick={() => props.onChannelClick(props.channel)}
      classList={{
        "bg-light text-white": props.isActive,
        "text-gray-500 hover:text-white hover:bg-light/20": !props.isActive
      }}
      class="w-[90%] transition-colors duration-100 cursor-default rounded-lg p-1 font-medium hover:cursor-pointer"
    >
      <span class="flex items-center gap-1">
        <Hash width={18} height={18} />

        {props.channel.name}
      </span>
    </button>
  )
}

function CategoryItem(props: {
  category: Channel
  channels: Channel[]
  currentChannelId?: string
  onChannelClick: (c: Channel) => void
  onNewChannel: (parentId: string) => void
}) {
  return (
    <div class="flex w-full flex-col items-center gap-1 mt-2">
      <div class="flex items-center w-[90%] justify-between m-1 text-gray-400 group/category">
        <div class="flex items-center text-[11px] font-bold uppercase tracking-wider gap-1 cursor-pointer hover:text-gray-300">
          <ChevronDown height={11} width={11} />
          {props.category.name}
        </div>

        <Plus
          height={11}
          width={11}
          class="hidden group-hover/category:block cursor-pointer"
          onClick={() => props.onNewChannel(props.category.id)}
        />
      </div>

      <For each={props.channels}>
        {channel => (
          <ChannelItem
            channel={channel}
            isActive={channel.id === props.currentChannelId}
            onChannelClick={props.onChannelClick}
          />
        )}
      </For>
    </div>
  )
}

const Channels = (props: { channels: () => Channel[] }) => {
  const navigate = useNavigate()
  const modals = useModalRouter<GuildModal>()

  const categories = () => props.channels().filter(c => c.channel_type === ChannelType.CategoryChannel)
  const uncategorizedChannels = () =>
    props.channels().filter(c => c.channel_type !== ChannelType.CategoryChannel && c.parent_id === null)

  const getChildrenForCategory = (categoryId: string) => props.channels().filter(c => c.parent_id === categoryId)

  const onChannelClick = (channel: Channel) => {
    setCurrentChannel(channel)
    navigate(`/channels/${currentGuild()?.id}/${channel.id}`)
  }

  const onNewChannel = (parentChannel?: string) => {
    modals.open("createChannel", { parentChannel })
  }

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

export default function GuildSidebar() {
  const modals = createModalRouter<GuildModal>()

  return (
    <ModalRouterProvider router={modals}>
      <Show when={currentGuild()}>
        {guild => (
          <div class="flex flex-col h-full w-full select-none gap-2">
            <GuildBanner guild={guild()} />

            <div class="flex-1 overflow-y-auto">
              <Channels channels={() => channels[guild().id] ?? []} />
            </div>
          </div>
        )}
      </Show>
    </ModalRouterProvider>
  )
}
