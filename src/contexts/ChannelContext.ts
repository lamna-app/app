import { createContext, useContext } from "solid-js"
import type { Channel } from "@/types/models"
import type { Option } from "@/types/utils"

const ChannelContext = createContext<{
  channel: () => Option<Channel>
  setChannel: (channel: Option<Channel>) => void
}>()

// biome-ignore lint/style/noNonNullAssertion: context is always provided within provider
export const useChannel = () => useContext(ChannelContext)!
export default ChannelContext
