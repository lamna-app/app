import { useClient } from "@/hooks/useClient"
import { useNavigate } from "@solidjs/router"
import { onMount } from "solid-js"

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
    <div class="flex h-screen w-screen justify-center pt-12">
      <form onSubmit={onSubmit} class="w-64">
        <div class="flex flex-col">
          <label for="email">Email</label>
          <input name="email" type="text" class="border border-white" />
        </div>

        <div class="flex flex-col">
          <label for="password">Password</label>
          <input name="password" type="text" class="border border-white" />
        </div>
        <button class="border border-white p-1">Login</button>
      </form>
    </div>
  )
}
