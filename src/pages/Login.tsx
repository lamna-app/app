import { useNavigate, useSearchParams } from "@solidjs/router"
import { createSignal, onMount, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"
import { useSocket } from "@/hooks/useSocket"

import { APIError } from "@/libs/client"

import Logo from "@/assets/logo.svg?component-solid"

import Button from "@/components/common/Button"
import InputField from "@/components/common/Input"

import type { Accessor, JSX } from "solid-js"

type Props = {
  onToggle: () => void
  onSubmit: JSX.CustomEventHandlersCamelCase<HTMLFormElement>["onSubmit"]
  isLoading: Accessor<boolean>
}

function Register(props: Props) {
  return (
    <form onSubmit={props.onSubmit} class="flex w-full flex-col space-y-4">
      <InputField label="Username" name="username" minLength={2} maxLength={25} disabled={props.isLoading()} />
      <InputField label="Email" name="email" type="email" disabled={props.isLoading()} />
      <InputField label="Password" name="password" type="password" minLength={5} disabled={props.isLoading()} />

      <Button type="submit" isLoading={props.isLoading()}>
        Register
      </Button>

      <div class="mt-2 text-sm text-gray-400">
        Already have an account?{" "}
        <button type="button" onClick={props.onToggle} class="text-blue-400 hover:underline cursor-pointer font-medium">
          Login
        </button>
      </div>
    </form>
  )
}

function Login(props: Props) {
  return (
    <form onSubmit={props.onSubmit} class="flex w-full flex-col space-y-4">
      <InputField label="Email" name="email" type="email" disabled={props.isLoading()} />
      <InputField label="Password" name="password" type="password" minLength={5} disabled={props.isLoading()} />

      <Button type="submit" isLoading={props.isLoading()}>
        Login
      </Button>

      <div class="mt-2 text-sm text-gray-400">
        Need an account?{" "}
        <button type="button" onClick={props.onToggle} class="text-blue-400 hover:underline cursor-pointer font-medium">
          Register
        </button>
      </div>
    </form>
  )
}

export default function Entry() {
  const client = useClient()
  const socket = useSocket()
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  const [isLogin, setIsLogin] = createSignal<boolean>(true)
  const [error, setError] = createSignal<Option<string>>(null)

  const [isLoading, setLoading] = createSignal<boolean>(false)

  const getRedirectPath = (): string => {
    return (searchParams.redirect as string) || "/channels/@me"
  }

  onMount(async () => {
    if (socket.isOpen()) socket.disconnect()
    try {
      await client.me()
      navigate(getRedirectPath(), { replace: true })
    } catch {}
  })

  const onLogin = async (e: SubmitEvent) => {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget as HTMLFormElement)

    const email = data.get("email") as string
    const password = data.get("password") as string

    try {
      setLoading(true)
      const resp = await client.login(email, password)

      if (resp.status === 200) {
        navigate(getRedirectPath(), { replace: true })
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
    } finally {
      setLoading(false)
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
      setLoading(true)
      const resp = await client.register(username, email, password)

      if (resp.status === 201) {
        navigate(getRedirectPath(), { replace: true })
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
    } finally {
      setLoading(false)
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
            <div class="rounded-lg border border-danger/50 bg-danger/10 p-3 text-center text-sm font-medium text-danger">
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
                isLoading={isLoading}
              />
            }
          >
            <Login
              onToggle={() => {
                setIsLogin(false)
              }}
              onSubmit={onLogin}
              isLoading={isLoading}
            />
          </Show>
        </div>
      </div>
    </div>
  )
}
