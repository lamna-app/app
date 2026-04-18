import type { JSX } from "solid-js"

type Props = { label: string } & JSX.InputHTMLAttributes<HTMLInputElement>

export default function InputField({ label, name, value, children, ...props }: Props) {
  return (
    <div class="flex flex-col gap-1">
      <label for={name} class="text-sm font-medium select-none">
        {label}
      </label>

      <div class="relative">
        <input
          id={name}
          name={name}
          value={value ?? ""}
          autocomplete="off"
          {...props}
          class="bg-dark-hl rounded-lg w-full p-2 outline-none transition-all focus:ring-2 focus:ring-light disabled:opacity-50 disabled:pointer-events-auto disabled:bg-red-300"
        />
        {children}
      </div>
    </div>
  )
}
