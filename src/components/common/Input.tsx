import type { JSX } from "solid-js"

type Props = { label: string } & JSX.InputHTMLAttributes<HTMLInputElement>

export default function InputField({ label, name, ...props }: Props) {
  return (
    <div class="flex flex-col gap-1">
      <label for={name} class="text-sm font-medium select-none">
        {label}
      </label>

      <input
        id={name}
        name={name}
        autocomplete="off"
        {...props}
        class="bg-dark-hl rounded-lg p-2 outline-none transition-all focus:ring-2 focus:ring-light"
      />
    </div>
  )
}
