import { useParams } from "@solidjs/router"
import { createEffect, For, on, onCleanup, onMount, Show } from "solid-js"

import MessageInput from "@/components/MessageInput"
import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild, guilds, setCurrentGuild } from "@/features/guild"
import { useMessages } from "@/features/message"
import Radar from "~icons/lucide/Radar"

import type { Message as MessageT } from "@/types/models"

const MESSAGE_GROUP_TIME_LIMIT = 2 * 60000

function Message({ message, compact }: { message: MessageT; compact: boolean }) {
  const time = message.created_at.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })

  return (
    <div class="group flex items-start px-6 hover:bg-white/5" style={{ "margin-top": compact ? "0.125rem" : "0.9rem" }}>
      <div class="flex w-12 shrink-0 mr-2 items-center justify-center" style={{ height: compact ? "24px" : undefined }}>
        {compact ? (
          <span class="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 tabular-nums select-none">{time}</span>
        ) : (
          <div class="w-10 h-10 rounded-full bg-gray-500/30 shrink-0 my-0.5" />
        )}
      </div>

      <div class="flex-1 min-w-0">
        {!compact && (
          <div class="flex items-baseline gap-2 select-none">
            <span class="font-semibold text-white leading-tight">{message.author.username}</span>
            <span class="text-[10px] text-gray-500 tabular-nums">{time}</span>
          </div>
        )}

        <div class="text-[15px] leading-6 break-all whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  )
}

export default function Channel() {
  const params = useParams<{ guildID: string; channelID?: string }>()

  // Set guild from guildID param
  createEffect(() => {
    const guildID = params.guildID
    if (!guildID) return

    if (guildID === "@me") {
      setCurrentGuild(null)
      setCurrentChannel(null)

      return
    }

    const guild = guilds[guildID]
    if (!guild) return

    if (currentGuild()?.id !== guild.id) {
      setCurrentGuild(guild)
    }
  })

  // When the URL has a channelID and the channel data is available
  // find the matching channel and set it to active.
  // Uses on() to reliably re-trigger when the store gets populated
  createEffect(
    on(
      () => [params.guildID, params.channelID, channels[params.guildID]] as const, // <- watch these
      // run this when they change
      ([guildID, channelID, guildChannels]) => {
        if (!guildID || !channelID || !guildChannels?.length) return

        const channel = guildChannels.find(ch => String(ch.id) === channelID)

        if (channel && currentChannel()?.id !== channel.id) {
          setCurrentChannel(channel)
        }
      }
    )
  )

  let bottomRef: HTMLDivElement | undefined

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        bottomRef?.scrollIntoView({ behavior: "smooth" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown))
  })

  const shouldGroup = (current: MessageT, previous?: MessageT) => {
    if (!previous) return false

    const isSameUser = current.author.username === previous.author.username
    const timeDiff = Math.abs(current.created_at.getTime() - previous.created_at.getTime())

    const isWithinTimeLimit = timeDiff < MESSAGE_GROUP_TIME_LIMIT

    return isSameUser && isWithinTimeLimit
  }

  return (
    <Show when={currentChannel()}>
      {channel => {
        const { messages, loading } = useMessages(() => channel().id)

        return (
          <div class="flex flex-col h-full">
            <div class="grow overflow-y-auto flex flex-col-reverse mb-4">
              <div ref={bottomRef} />

              <Show
                when={!loading()}
                fallback={
                  <div class="flex items-center justify-center gap-4 animate-pulse">
                    <Radar class="size-16" />

                    <p class="text-4xl font-medium">Scanning for messages...</p>
                  </div>
                }
              >
                <For each={messages()}>
                  {(message, index) => {
                    const previousMessage = messages()[index() + 1]
                    const isGrouped = shouldGroup(message, previousMessage)

                    return <Message message={message} compact={isGrouped} />
                  }}
                </For>
              </Show>
            </div>

            <MessageInput />
          </div>
        )
      }}
    </Show>
  )
}
