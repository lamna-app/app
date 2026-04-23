import { splitProps } from "solid-js"

import Check from "~icons/lucide/Check"

import type { JSX } from "solid-js"

type Props = {
  label: string
  description: string
  value: number
  default?: boolean
} & JSX.InputHTMLAttributes<HTMLInputElement>

export default function RadioInput(props: Props) {
  const [local, rest] = splitProps(props, ["value", "label", "description", "default"])

  const _for = `${local.value}-item`

  return (
    <label for={_for} class="flex items-center cursor-pointer select-none w-full">
      <input type="radio" id={_for} class="peer sr-only" checked={local.default ?? false} value={local.value} {...rest} />

      <div
        class="w-6 h-6 rounded border-2 border-gray-600 bg-transparent 
               text-transparent peer-checked:text-white 
               transition-colors duration-200 
               flex items-center justify-center shrink-0 
               cursor-pointer pointer-events-none"
      >
        <Check class="w-4 h-4" stroke-width="3" />
      </div>

      <div class="ml-3">
        <span class="block text-sm font-medium text-white">{local.label}</span>
        <p class="block mt-0.5 text-sm text-gray-400">{local.description}</p>
      </div>
    </label>
  )
}
