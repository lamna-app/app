import { Message } from "@/types/models"
import { createStore } from "solid-js/store"

export const [messages, setMessages] = createStore<Record<string, Message[]>>({})
