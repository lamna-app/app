import { Channel } from "@/types/models"
import { Option } from "@/types/utils"
import { createContext, useContext } from "solid-js"

const ChannelContext = createContext<{
  channel: () => Option<Channel>
  setChannel: (channel: Option<Channel>) => void
}>()

export const useChannel = () => useContext(ChannelContext)!
export default ChannelContext
