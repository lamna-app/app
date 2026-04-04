import { useParams } from "@solidjs/router"
import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from "solid-js"

import MessageInput from "@/components/MessageInput"
import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild, guilds, setCurrentGuild } from "@/features/guild"
import { useMessages } from "@/features/message"

import type { Message as MessageT } from "@/types/models"

const MESSAGE_GROUP_TIME_LIMIT = 2 * 60000

function MessageSkeleton(props: { compact: boolean }) {
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

function Message(props: { message: MessageT; compact: boolean }) {
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

const shouldGroup = (current: MessageT, previous?: MessageT) => {
  if (!previous) return false

  const isSameUser = current.author.username === previous.author.username
  const timeDiff = Math.abs(current.created_at.getTime() - previous.created_at.getTime())

  const isWithinTimeLimit = timeDiff < MESSAGE_GROUP_TIME_LIMIT

  return isSameUser && isWithinTimeLimit
}

function ChannelChatSkeleton(props: { chats: number }) {
  return (
    <div class="flex flex-col-reverse">
      <For each={Array(props.chats).fill(0)}>{(_, i) => <MessageSkeleton compact={i() % 3 !== 0} />}</For>
    </div>
  )
}

function ChannelChat(props: { channelId: string }) {
  const { messages, loading, loadingMore, hasMore, loadMore } = useMessages(() => props.channelId)

  const [topBoundary, setTopBoundary] = createSignal<HTMLDivElement>()
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

  createEffect(() => {
    const el = topBoundary()
    if (!el) return

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) loadMore()
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    onCleanup(() => observer.disconnect())
  })

  return (
    <div class="flex flex-col h-full">
      <div class="grow overflow-y-auto flex flex-col-reverse mb-4">
        <div ref={bottomRef} />

        <Show when={!loading()} fallback={<ChannelChatSkeleton chats={10} />}>
          <For each={messages()}>
            {(message, index) => {
              const previousMessage = messages()[index() + 1]
              const isGrouped = shouldGroup(message, previousMessage)

              return <Message message={message} compact={isGrouped} />
            }}
          </For>

          <Show when={loadingMore()}>
            <ChannelChatSkeleton chats={4} />
          </Show>

          <Show when={hasMore() && !loading()}>
            <div ref={setTopBoundary} class="h-4 w-full shrink-0" />
          </Show>

          <Show when={!hasMore() && !loading()}>
            <div class="px-10 py-12 mt-12 mb-6 rounded-2xl text-center select-none">
              <div class="w-20 h-20 rounded-xl bg-light mb-6 flex items-center justify-center mx-auto">
                <span class="text-5xl text-neutral-400 font-extralight">#</span>
              </div>

              <h1 class="text-4xl font-extrabold text-neutral-50 mb-3">Welcome to #{currentChannel()?.name}!</h1>
              <p class="text-neutral-300">This is the beginning of this channel.</p>
            </div>
          </Show>
        </Show>
      </div>

      <MessageInput />
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

        const channel = guildChannels.find(ch => ch.id === channelID)

        if (channel && currentChannel()?.id !== channel.id) {
          setCurrentChannel(channel)
        }
      }
    )
  )

  return <Show when={currentChannel()}>{channel => <ChannelChat channelId={channel().id} />}</Show>
}
