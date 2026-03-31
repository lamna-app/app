import { createContext, useContext } from "solid-js"

import type { Guild } from "@/types/models"

const GuildContext = createContext<{
  guild: () => Option<Guild>
  setGuild: (guild: Option<Guild>) => void
}>()

// biome-ignore lint/style/noNonNullAssertion: context is always provided within provider
export const useGuild = () => useContext(GuildContext)!
export default GuildContext
