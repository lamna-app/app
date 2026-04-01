import { createStore } from "solid-js/store"

import type { Guild } from "@/types/models"

export const [guilds, setGuilds] = createStore<Guild[]>([])
