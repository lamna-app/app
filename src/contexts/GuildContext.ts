import { Guild } from "@/types/models"
import { Option } from "@/types/utils"
import { createContext, useContext } from "solid-js"

const GuildContext = createContext<{
  guild: () => Option<Guild>
  setGuild: (guild: Option<Guild>) => void
}>()

export const useGuild = () => useContext(GuildContext)!
export default GuildContext
