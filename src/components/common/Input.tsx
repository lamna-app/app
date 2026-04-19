import { splitProps } from "solid-js"

import type { JSX } from "solid-js"

export function Label(props: { for?: string } & JSX.InputHTMLAttributes<HTMLLabelElement>) {
  const [local, rest] = splitProps(props, ["for", "class", "children"])

  return (
    <label for={local.for} class={`text-sm font-medium select-none ${local.class}`} {...rest}>
      {local.children}
    </label>
  )
}

type Props = { label: string } & JSX.InputHTMLAttributes<HTMLInputElement>

export default function Input(props: Props) {
  const [local, rest] = splitProps(props, ["label", "name", "children"])

  return (
    <div class="flex flex-col gap-1">
      <Label for={local.name} class="text-sm font-medium select-none">
        {local.label}
      </Label>

      <div class="relative">
        <input
          id={local.name}
          name={local.name}
          autocomplete="off"
          {...rest}
          class="bg-dark-hl rounded-lg w-full p-2 outline-none transition-all focus:ring-2 focus:ring-light disabled:opacity-50 disabled:pointer-events-auto"
        />
        {local.children}
      </div>
    </div>
  )
}
