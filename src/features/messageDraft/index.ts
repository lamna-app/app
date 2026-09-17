import { createSignal } from "solid-js"

import type { Message } from "@/types/models"

export const [replyingTo, setReplyingTo] = createSignal<Option<Message>>(null)

export const startReply = (message: Message) => setReplyingTo(message)
export const cancelReply = () => setReplyingTo(null)
