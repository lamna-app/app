import { Plus } from "lucide-solid"
import { For, type JSXElement, type Resource } from "solid-js"
import Icon from "@/assets/icon.png"
import { useGuild } from "@/contexts/GuildContext"
import type { Guild } from "@/types/models"
import type { Option } from "@/types/utils"
import GuildIcon from "./utils/GuildIcon"

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

const GuildCircle = ({ children, onClick }: { children: JSXElement; onClick?: () => void }) => {
  return (
    <div
      onClick={onClick}
      class="bg-light flex size-13.5 shrink-0 cursor-pointer items-center justify-center rounded-3xl transition-[border-radius] duration-100 *:rounded-3xl hover:rounded-2xl"
    >
      {children}
    </div>
  )
}

export default function ServerPicker({ guilds }: { guilds: Resource<Guild[]> }) {
  const { setGuild } = useGuild()
  const onClick = (g: Option<Guild>) => setGuild(g)

  return (
    <div class="bg-dark p-2">
      <div onWheel={e => onScroll(e)} class="no-scrollbar flex gap-2 overflow-x-auto">
        <GuildCircle onClick={() => setGuild(null)}>
          <img src={Icon} width={38} />
        </GuildCircle>
        <For each={guilds()}>
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
        <GuildCircle>
          <Plus size={32} />
        </GuildCircle>
      </div>
    </div>
  )
}
