import { useNavigate } from "@solidjs/router"
import { createSignal, onMount, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { APIError } from "@/libs/client"

import Logo from "@/assets/logo.svg?component-solid"

import type { JSX } from "solid-js"

const InputField = ({
  label,
  name,
  type = "text",
  minLength,
  maxLength
}: {
  label: string
  name: string
  type?: JSX.InputHTMLAttributes<HTMLInputElement>["type"]
  minLength?: number
  maxLength?: number
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
      minLength={minLength}
      maxLength={maxLength}
      class="bg-dark-hl rounded-lg p-2 outline-none transition-all focus:ring-2 focus:ring-light"
    />
  </div>
)

type Props = {
  onToggle: () => void
  onSubmit: JSX.CustomEventHandlersCamelCase<HTMLFormElement>["onSubmit"]
}

function Register({ onToggle, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} class="flex w-full flex-col space-y-4">
      <InputField label="Username" name="username" minLength={2} maxLength={25} />
      <InputField label="Email" name="email" type="email" />
      <InputField label="Password" name="password" type="password" minLength={5} />

      <button
        type="submit"
        class="bg-light hover:bg-light-hl mt-4 w-full cursor-pointer rounded-lg px-4 py-2 font-semibold transition-colors"
      >
        Register
      </button>

      <div class="mt-2 text-sm text-gray-400">
        Already have an account?{" "}
        <button type="button" onClick={onToggle} class="text-blue-400 hover:underline cursor-pointer font-medium">
          Login
        </button>
      </div>
    </form>
  )
}

function Login({ onToggle, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} class="flex w-full flex-col space-y-4">
      <InputField label="Email" name="email" type="email" />
      <InputField label="Password" name="password" type="password" minLength={5} />

      <button
        type="submit"
        class="bg-light hover:bg-light-hl mt-4 w-full cursor-pointer rounded-lg px-4 py-2 font-semibold transition-colors"
      >
        Login
      </button>

      <div class="mt-2 text-sm text-gray-400">
        Need an account?{" "}
        <button type="button" onClick={onToggle} class="text-blue-400 hover:underline cursor-pointer font-medium">
          Register
        </button>
      </div>
    </form>
  )
}

export default function Entry() {
  const client = useClient()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = createSignal<boolean>(true)
  const [error, setError] = createSignal<Option<string>>(null)

  onMount(async () => {
    try {
      await client.me()
      navigate("/channels/@me")
    } catch {}
  })

  const onLogin = async (e: SubmitEvent) => {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget as HTMLFormElement)

    const email = data.get("email") as string
    const password = data.get("password") as string

    try {
      const resp = await client.login(email, password)

      if (resp.status === 200) {
        navigate("/channels/@me")
      }
    } catch (err) {
      if (!(err instanceof APIError)) {
        return
      }

      if (err.status >= 500) {
        setError("Failed to register account")
      } else {
        setError(err.message)
      }
    }
  }

  const onRegister = async (e: SubmitEvent) => {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget as HTMLFormElement)

    const username = data.get("username") as string
    const email = data.get("email") as string
    const password = data.get("password") as string

    try {
      const resp = await client.register(username, email, password)

      if (resp.status === 201) {
        navigate("/")
      }
    } catch (err) {
      if (!(err instanceof APIError)) {
        return
      }

      if (err.status >= 500) {
        setError("Failed to register account")
      } else {
        setError(err.message)
      }
    }
  }

  return (
    <div class="flex min-h-screen w-full items-center justify-center p-4">
      <div class="bg-dark flex w-full max-w-sm flex-col items-center justify-center rounded-xl p-8 shadow-lg">
        <div class="flex items-center gap-3 mb-8">
          <Logo class="size-18" />

          <h1 class="text-5xl font-bold select-none">Lamna</h1>
        </div>

        <div class="flex w-full flex-col gap-4">
          <Show when={error()}>
            <div class="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400">
              {error()}
            </div>
          </Show>

          <Show
            when={isLogin()}
            fallback={
              <Register
                onToggle={() => {
                  setIsLogin(true)
                }}
                onSubmit={onRegister}
              />
            }
          >
            <Login
              onToggle={() => {
                setIsLogin(false)
              }}
              onSubmit={onLogin}
            />
          </Show>
        </div>
      </div>
    </div>
  )
}
