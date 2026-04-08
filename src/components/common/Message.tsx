import type { Message as MessageT } from "@/types/models"

const MESSAGE_GROUP_TIME_LIMIT = 2 * 60000

export const shouldMessageGroup = (current: MessageT, previous?: MessageT) => {
  if (!previous) return false

  const isSameUser = current.author.username === previous.author.username
  const timeDiff = Math.abs(current.created_at.getTime() - previous.created_at.getTime())

  const isWithinTimeLimit = timeDiff < MESSAGE_GROUP_TIME_LIMIT

  return isSameUser && isWithinTimeLimit
}

export function MessageSkeleton(props: { compact: boolean }) {
  return (
    <div class="flex items-start px-6 w-full animate-pulse" style={{ "margin-top": props.compact ? "0.125rem" : "0.9rem" }}>
      <div
        class="flex w-12 shrink-0 mr-2 items-start justify-center pt-1"
        style={{ height: props.compact ? "24px" : undefined }}
      >
        {!props.compact && <div class="w-10 h-10 rounded-full bg-white/10 shrink-0" />}
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-1.5 pt-1">
        {!props.compact && (
          <div class="flex items-baseline gap-2 mb-0.5">
            <div class="h-4 w-24 bg-white/10 rounded" />
            <div class="h-3 w-16 bg-white/5 rounded" />
          </div>
        )}

        {!props.compact && <div class="h-4 w-3/4 bg-white/10 rounded" />}
        <div class="h-4 w-full bg-white/10 rounded" />
      </div>
    </div>
  )
}

export function Message(props: { message: MessageT; compact: boolean }) {
  // TODO: fix the time and make it display the relative time when the date is beyond today,
  // and if its beyond that then just display the date
  const time = props.message.created_at.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })

  return (
    <div
      class="group flex items-start px-6 hover:bg-white/5"
      style={{ "margin-top": props.compact ? "0.125rem" : "0.9rem" }}
    >
      <div
        class="flex w-12 shrink-0 mr-2 items-center justify-center"
        style={{ height: props.compact ? "24px" : undefined }}
      >
        {props.compact ? (
          <span class="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 tabular-nums select-none">{time}</span>
        ) : (
          <div class="w-10 h-10 rounded-full bg-gray-500/30 shrink-0 my-0.5" />
        )}
      </div>

      <div class="flex-1 min-w-0">
        {!props.compact && (
          <div class="flex items-baseline gap-2 select-none">
            <span class="font-semibold text-white leading-tight">{props.message.author.username}</span>
            <span class="text-[10px] text-gray-500 tabular-nums">{time}</span>
          </div>
        )}

        <div class="text-[15px] leading-6 break-all whitespace-pre-wrap">{props.message.content}</div>
      </div>
    </div>
  )
}
