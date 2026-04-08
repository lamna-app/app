import { createStore } from "solid-js/store"

import type { User } from "@/types/models"

// user_id: User
export const [users, setUsers] = createStore<Record<string, User>>({})
