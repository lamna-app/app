import type { Guild } from "./models"

export enum ChannelType {
  CategoryChannel = 1,
  TextChannel,
  VoiceChannel
}

export interface ModalConsumerProps {
  open: boolean
  onClose: () => void
}

export interface GuildModalConsumerProps extends ModalConsumerProps {
  guild: Guild
}
