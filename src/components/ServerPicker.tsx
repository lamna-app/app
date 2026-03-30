import { Guild } from "@/types/basic"
import { Plus } from "lucide-solid"

export default function ServerPicker({ guilds }: { guilds: Guild[] }) {
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

  return (
    <div class="bg-dark-hl p-2">
      <div onWheel={e => onScroll(e)} class="no-scrollbar flex gap-2 overflow-x-auto">
        <div class="bg-hl flex size-13.5 shrink-0 cursor-pointer items-center justify-center rounded-3xl hover:rounded-2xl">
          <Plus size={48} />
        </div>
        {guilds.map(guild => (
          <div class="shrink-0 cursor-pointer">
            <img src={guild.icon_url} class="rounded-3xl transition-all duration-50 hover:rounded-2xl" width={54} />
          </div>
        ))}
      </div>
    </div>
  )
}
