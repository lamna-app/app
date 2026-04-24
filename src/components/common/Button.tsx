import { Show, splitProps } from "solid-js"

import Loader from "~icons/lucide/loader-circle"

import type { JSX } from "solid-js"

type Props = {
  isLoading?: boolean
  variant?: "primary" | "danger" | "ghost"
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>

export default function Button(props: Props) {
  const [local, rest] = splitProps(props, ["variant", "classList", "class", "isLoading", "children"])

  const getVariantClasses = () => {
    switch (local.variant) {
      case "primary":
        return "border-accent bg-accent hover:bg-accent/70 text-white"
      case "danger":
        return "border-danger bg-danger hover:bg-danger/70 text-white"
      default:
        return "border-light bg-light hover:bg-light/70"
    }
  }

  return (
    <button
      classList={{
        ...local.classList,
        "opacity-50 cursor-auto pointer-events-none": local.isLoading
      }}
      class={`
        w-full px-4 py-2 gap-2 font-semibold rounded-lg
        transition-colors duration-200 cursor-pointer
        inline-flex items-center justify-center select-none 
        ${getVariantClasses()} ${local.class || ""}
      `}
      {...rest}
    >
      {local.children}

      <Show when={local.isLoading}>
        <Loader class="animate-spin" width={16} height={16} />
      </Show>
    </button>
  )
}
