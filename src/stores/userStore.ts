import { createSignal } from "solid-js"

import type { MeResponse } from "@/types/client"

export const [user, setUser] = createSignal<Option<MeResponse>>(null)
