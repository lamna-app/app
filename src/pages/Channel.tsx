import { useParams } from "@solidjs/router"
import { createEffect, createSignal, For, on, onCleanup, onMount, Show } from "solid-js"

import ChatInput from "@/components/common/ChatInput"
import { Message, MessageSkeleton, shouldMessageGroup } from "@/components/common/Message"
import { channels, currentChannel, setCurrentChannel } from "@/features/channel"
import { currentGuild, guilds, setCurrentGuild } from "@/features/guild"
import { useMessages } from "@/features/message"

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
              const isGrouped = shouldMessageGroup(message, previousMessage)

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

      <ChatInput />
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
