import { animate } from "animejs"
import { format, isToday, isYesterday } from "date-fns"
import { onMount } from "solid-js"

import { useClient } from "@/hooks/useClient"
import { useUser } from "@/hooks/useUser"

import { confirm } from "@/stores/confirmStore"
import { openContextMenu } from "@/stores/contextMenuStore"

import { startReply } from "@/features/messageDraft"
import Copy from "~icons/lucide/copy"
import CornerUpLeft from "~icons/lucide/corner-up-left"
import Reply from "~icons/lucide/reply"
import Trash from "~icons/lucide/trash-2"

import type { Message as MessageT } from "@/types/models"
import type { MenuItemProps } from "./Menu"

const MESSAGE_GROUP_TIME_LIMIT = 2 * 60000

export const shouldMessageGroup = (current: MessageT, previous?: MessageT) => {
  if (!previous) return false
  if (current.reference_id) return false

  const isSameUser = current.author.username === previous.author.username
  const timeDiff = Math.abs(current.created_at.getTime() - previous.created_at.getTime())

  const isWithinTimeLimit = timeDiff < MESSAGE_GROUP_TIME_LIMIT

  return isSameUser && isWithinTimeLimit
}

const formatTime = (date: Date, compact: boolean) => {
  const timeString = format(date, "HH:mm")

  if (compact) {
    return timeString
  }

  if (isToday(date)) {
    return `Today at ${timeString}`
  } else if (isYesterday(date)) {
    return `Yesterday at ${timeString}`
  }

  return `${format(date, "dd/MM/yyyy")} ${timeString}`
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
  const client = useClient()
  const user = useUser()

  const time = () => formatTime(props.message.created_at, props.compact)

  const jumpToMessage = (id: string) => {
    const el = document.getElementById(`message-${id}`)
    if (!el) return

    el.scrollIntoView({ behavior: "smooth", block: "center" })

    animate(el, {
      backgroundColor: ["rgba(99, 102, 241, 0.15)", "rgba(99, 102, 241, 0)"],
      duration: 1000,
      ease: "outQuad",
      onComplete: () => {
        el.style.backgroundColor = ""
      }
    })
  }

  const onContextMenu = (e: MouseEvent) => {
    const items: MenuItemProps[] = [
      {
        label: "Reply",
        icon: Reply,
        onClick: () => startReply(props.message)
      },
      {
        label: "Copy Text",
        icon: Copy,
        onClick: () => navigator.clipboard.writeText(props.message.content)
      }
    ]

    if (props.message.author.id === user()?.id) {
      items.push({
        label: "Delete Message",
        icon: Trash,
        variant: "danger",
        onClick: () =>
          confirm({
            title: "Delete Message",
            message: "Are you sure you want to delete this message? This cannot be undone.",
            confirmLabel: "Delete",
            variant: "danger",
            onConfirm: async () => {
              await client.deleteMessage(props.message.channel_id, props.message.id)
            }
          })
      })
    }

    openContextMenu(e, items)
  }

  const isOnText = (e: MouseEvent) => (e.target as HTMLElement).closest("[data-selectable]") !== null

  const onMouseDown = (e: MouseEvent) => {
    if (e.detail > 1 && !isOnText(e)) e.preventDefault()
  }

  const onDoubleClick = (e: MouseEvent) => {
    if (isOnText(e)) return
    if (props.message.author.id === user()?.id) return
    startReply(props.message)
  }

  let ref: HTMLDivElement | undefined
  onMount(() => {
    if (!ref) return

    animate(ref, {
      opacity: [0, 1],
      translateY: [5, 0],
      duration: 75,
      ease: "outQuad"
    })
  })

  return (
    <div
      ref={ref}
      id={`message-${props.message.id}`}
      onContextMenu={onContextMenu}
      onDblClick={onDoubleClick}
      onMouseDown={onMouseDown}
      class="group flex items-start px-6 hover:bg-white/5"
      style={{ "margin-top": props.compact ? "0.125rem" : "0.9rem" }}
    >
      <div
        class="flex w-12 shrink-0 mr-2 items-center justify-center"
        style={{ height: props.compact ? "24px" : undefined }}
      >
        {props.compact ? (
          <span class="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 tabular-nums select-none">{time()}</span>
        ) : (
          <div class="w-10 h-10 rounded-full bg-light/70 shrink-0 my-0.5" />
        )}
      </div>

      <div class="flex-1 min-w-0">
        {props.message.reference_id && (
          <div class="flex items-center gap-1.5 mb-1 text-xs text-gray-500 select-none">
            <CornerUpLeft width={13} height={13} class="shrink-0" />
            {props.message.referenced_message ? (
              <button
                type="button"
                onClick={() => jumpToMessage(props.message.referenced_message?.id ?? "")}
                class="flex items-center gap-1.5 min-w-0 cursor-pointer hover:text-gray-300"
              >
                <span class="font-medium text-gray-400">{props.message.referenced_message.author.username}</span>
                <span class="truncate">{props.message.referenced_message.content}</span>
              </button>
            ) : (
              <span class="italic">Original message was deleted</span>
            )}
          </div>
        )}

        {!props.compact && (
          <div class="flex items-baseline gap-2 select-none">
            <span class="font-semibold text-white leading-tight">{props.message.author.username}</span>
            <span class="text-[10px] text-gray-500 tabular-nums">{time()}</span>
          </div>
        )}

        <div class="text-[15px] leading-6 break-all whitespace-pre-wrap">
          <span data-selectable>{props.message.content}</span>
        </div>
      </div>
    </div>
  )
}
