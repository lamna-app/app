import { useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Logo from "@/assets/logo.svg?component-solid"

import type { JSX } from "solid-js"

const InputField = ({
  label,
  name,
  type = "text"
}: {
  label: string
  name: string
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"]
}) => (
  <div class="flex flex-col gap-1">
    <label for={name} class="text-sm font-medium select-none">
      {label}
    </label>

    <input
      id={name}
      name={name}
      type={type}
      autocomplete="off"
      class="bg-dark-hl rounded-lg p-2 outline-none transition-all focus:ring-2 focus:ring-light"
    />
  </div>
)

export default function Login() {
  const client = useClient()
  const navigate = useNavigate()

  onMount(async () => {
    try {
      await client.me()
      navigate("/")
    } catch {}
  })

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget as HTMLFormElement)

    const email = data.get("email") as string
    const password = data.get("password") as string

    const resp = await client.login(email, password)
    if (resp.status === 200) {
      navigate("/")
    }
  }

  return (
    <div class="flex min-h-screen w-full items-center justify-center p-4">
      <div class="bg-dark flex w-full max-w-sm flex-col items-center justify-center gap-8 rounded-xl p-8 shadow-lg">
        <div class="flex items-center gap-3">
          <Logo class="size-18" />

          <h1 class="text-5xl font-bold select-none">Lamna</h1>
        </div>

        <form onSubmit={onSubmit} class="flex w-full flex-col space-y-4">
          <InputField label="Email" name="email" />
          <InputField label="Password" name="password" type="password" />

          <button
            type="submit"
            class="bg-light hover:bg-light-hl mt-4 w-full cursor-pointer rounded-lg px-4 py-2 font-semibold transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
