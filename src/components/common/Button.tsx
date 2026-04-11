import { Show } from "solid-js"

import Loader from "~icons/lucide/loader-circle"

import type { JSX } from "solid-js"

type Props = { isLoading?: () => boolean } & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({ children, isLoading, ...props }: Props) {
  return (
    <button
      classList={{
        "opacity-50 cursor-none pointer-events-none": isLoading?.(),
        "hover:bg-light-hl cursor-pointer": !isLoading?.()
      }}
      class="bg-light mt-4 w-full rounded-lg px-4 py-2 font-semibold transition-colors inline-flex items-center gap-2 justify-center"
      {...props}
    >
      {children}

      <Show when={isLoading?.()}>
        <Loader class="animate-spin" width={16} height={16} />
      </Show>
    </button>
  )
}
