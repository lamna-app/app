import { createStore } from "solid-js/store"

import type { Channel } from "@/types/models"

export const [channels, setChannels] = createStore<Record<string, Channel[]>>({})
