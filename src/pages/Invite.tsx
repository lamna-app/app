import { useNavigate, useParams } from "@solidjs/router"
import { createResource, createSignal, onMount, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import Button from "@/components/common/Button"
import CircleX from "~icons/lucide/CircleX"

import type { InviteInfo } from "@/types/client"

export default function Invite() {
  const params = useParams<{ inviteID: string }>()
  const client = useClient()
  const navigate = useNavigate()

  const [loading, setLoading] = createSignal<boolean>(false)
  const [error, setError] = createSignal<boolean>(false)

  onMount(async () => {
    try {
      await client.me()
    } catch {
      const currentPath = encodeURIComponent(location.pathname)
      navigate(`/login?redirect=${currentPath}`, { replace: false })
    }
  })

  const [invite] = createResource(params.inviteID, async (code: string): Promise<InviteInfo> => {
    const invite = await client.getInvite(code)
    return invite.data
  })

  const onAccept = async () => {
    try {
      setLoading(true)

      await client.joinInvite(params.inviteID)
      navigate(`/channels/${invite()?.guild.id}`)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="flex min-h-screen w-full items-center justify-center p-4">
      <div class="bg-dark flex w-full max-w-sm flex-col items-center justify-center gap-6 rounded-xl p-8 shadow-lg text-center">
        <Show when={invite.loading}>
          <div class="animate-pulse flex flex-col items-center gap-6 w-full">
            <div class="size-24 rounded-2xl bg-light/70" />
            <div class="h-4 w-32 rounded bg-light/70" />
            <div class="h-8 w-48 rounded bg-light/70" />
            <div class="mt-2 h-10 w-full rounded-lg bg-light/70" />
          </div>
        </Show>

        <Show when={error() || invite.error}>
          <div class="flex flex-col items-center gap-4">
            <div class="flex items-center justify-center rounded-full bg-white/5 p-4 text-gray-400">
              <CircleX height={48} width={48} stroke-width={1.5} />
            </div>

            <div>
              <h2 class="text-xl font-bold text-white">Invalid Invite</h2>

              <p class="text-sm text-gray-400 mt-1">
                This invite may have expired, or you might not have permission to join.
              </p>
            </div>

            <Button onClick={() => navigate("/channels/@me")}>Back to App</Button>
          </div>
        </Show>

        <Show when={!error() && !invite.error && invite()}>
          {data => (
            <>
              <div class="w-24 h-24 bg-light/70 rounded-2xl" />

              <div class="flex flex-col gap-1">
                <p class="text-sm font-medium text-gray-400">You've been invited to join</p>
                <h1 class="text-2xl font-bold select-none text-white">{data().guild.name}</h1>
              </div>

              <Button onClick={onAccept} isLoading={loading}>
                Accept Invite
              </Button>
            </>
          )}
        </Show>
      </div>
    </div>
  )
}
