import { Channel } from "@/types/models"
import { createStore } from "solid-js/store"

export const [channels, setChannels] = createStore<Record<string, Channel[]>>({})
