import { createSignal } from "solid-js"
import { createStore } from "solid-js/store"

import type { Channel } from "@/types/models"

// guild id: channel[]
export const [channels, setChannels] = createStore<Record<string, Channel[]>>({})
export const [currentChannel, setCurrentChannel] = createSignal<Option<Channel>>(null)

export const selectChannel = (channel: Channel) => {
  setCurrentChannel(channel)
}
