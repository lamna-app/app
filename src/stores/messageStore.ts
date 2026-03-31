import { createStore } from "solid-js/store"
import type { Message } from "@/types/models"

export const [messages, setMessages] = createStore<Record<string, Message[]>>({})
