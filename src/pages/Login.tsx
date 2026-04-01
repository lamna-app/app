import { useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Logo from "@/assets/logo.svg?component-solid"

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
    <div class="flex h-screen w-screen justify-center items-center">
      <div class="bg-dark w-75 h-96 rounded-lg flex flex-col items-center justify-center gap-6">
        <div class="flex items-center">
          <Logo class="size-18" />
          <h1 class="text-5xl font-bold">Lamna</h1>
        </div>
        <form onSubmit={onSubmit} class="w-64 ">
          <div class="flex flex-col">
            <label for="email">Email</label>
            <input name="email" type="text" class="rounded-lg p-2 bg-dark-hl outline-0" />
          </div>

          <div class="flex flex-col">
            <label for="password">Password</label>
            <input name="password" type="text" class="rounded-lg bg-dark-hl outline-0 p-2" />
          </div>
          <button class="rounded-lg px-4 py-2 font-semibold bg-light mt-4 cursor-pointer hover:bg-light-hl">Login</button>
        </form>
      </div>
    </div>
  )
}
