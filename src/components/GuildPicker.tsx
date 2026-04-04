import { useNavigate } from "@solidjs/router"
import { createSignal, For } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Logo from "@/assets/logo.svg?component-solid"

import { currentChannel, setCurrentChannel } from "@/features/channel"
import { guilds, selectGuild, setCurrentGuild } from "@/features/guild"
import Plus from "~icons/lucide/Plus"
import AddServerModal from "./modals/AddServerModal"
import GuildIcon from "./utils/GuildIcon"

import type { JSXElement } from "solid-js"
import type { Guild } from "@/types/models"

let scroll = 0
const onScroll = (e: WheelEvent) => {
  e.preventDefault()
  const target = e.currentTarget as HTMLDivElement
  scroll += e.deltaY

  const animate = () => {
    const diff = scroll * 0.1
    if (Math.abs(diff) < 0.5) {
      scroll = 0
      return
    }

    target.scrollLeft += diff
    scroll -= diff
    requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
}

const GuildCircle = (props: { children: JSXElement; onClick?: (event: MouseEvent) => void }) => {
  return (
    <button
      onClick={props.onClick}
      class="bg-light flex size-13.5 shrink-0 cursor-pointer items-center justify-center rounded-3xl transition-[border-radius] duration-100 *:rounded-3xl hover:rounded-2xl"
    >
      {props.children}
    </button>
  )
}

export default function ServerPicker() {
  const navigate = useNavigate()
  const client = useClient()

  const onClick = async (g: Option<Guild>) => {
    if (!g) {
      HomeClick()
      return
    }

    await selectGuild(g)
    const channelID = currentChannel()?.id
    navigate(`/channels/${g.id}${channelID ? `/${channelID}` : ""}`)
  }

  const HomeClick = () => {
    setCurrentGuild(null)
    setCurrentChannel(null)

    navigate("/channels/@me")
  }

  const [modalOpen, setModalOpen] = createSignal<boolean>(false)
  const onInviteSubmit = async (code: string) => {
    await client.invite(code)
    setModalOpen(false)
  }

  return (
    <div class="bg-dark p-2">
      <div onWheel={e => onScroll(e)} class="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <GuildCircle onClick={HomeClick}>
          <Logo class="size-9" />
        </GuildCircle>

        <div class="mx-1 w-0.5 h-8 rounded-full bg-light" />

        <For each={Object.values(guilds)}>
          {guild => (
            <GuildCircle onClick={() => onClick(guild)}>
              {guild.icon_url ? (
                <img src={guild.icon_url} class="rounded-3xl transition-all duration-50 hover:rounded-2xl" width={54} />
              ) : (
                <GuildIcon name={guild.name} />
              )}
            </GuildCircle>
          )}
        </For>

        <GuildCircle
          onClick={() => {
            console.log("click")
            setModalOpen(true)
          }}
        >
          <Plus height={32} width={32} />
        </GuildCircle>

        <AddServerModal open={modalOpen()} onClose={() => setModalOpen(false)} onSubmit={onInviteSubmit} />
      </div>
    </div>
  )
}
