import { Show } from "solid-js"

import { getCachedAvatarUrl } from "@/features/avatars"

type Props = {
  userId?: string | null
  username?: string
  avatar?: string | null
  class?: string
}

export default function Avatar(props: Props) {
  const url = () => getCachedAvatarUrl(props.userId, props.avatar)

  const initials = () => (props.username ?? "").trim().slice(0, 2).toUpperCase()

  return (
    <div
      class={`relative shrink-0 overflow-hidden rounded-full bg-light/70 grid place-items-center text-white ${props.class ?? "size-10"}`}
    >
      <Show when={url()} fallback={<span class="font-semibold select-none">{initials()}</span>}>
        {u => <img src={u()} alt={props.username} class="h-full w-full object-cover" />}
      </Show>
    </div>
  )
}
