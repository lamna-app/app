import { createContext, useContext } from "solid-js"
import type { Guild } from "@/types/models"
import type { Option } from "@/types/utils"

const GuildContext = createContext<{
  guild: () => Option<Guild>
  setGuild: (guild: Option<Guild>) => void
}>()

export const useGuild = () => useContext(GuildContext)!
export default GuildContext
