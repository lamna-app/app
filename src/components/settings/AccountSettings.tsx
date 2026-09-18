import { createEffect, createSignal, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"
import { useUser } from "@/hooks/useUser"

import { setUser } from "@/stores/userStore"

import { setUsers, users } from "@/features/users"
import { getAvatar } from "@/utils"
import Camera from "~icons/lucide/camera"
import Button from "../common/Button"

const MAX_AVATAR_SIZE = 8 * 1024 * 1024
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"]

export default function AccountSettings() {
  const client = useClient()
  const user = useUser()

  let fileInputRef: HTMLInputElement | undefined

  const [avatarUrl, setAvatarUrl] = createSignal<Option<string>>(null)
  const [isUploading, setIsUploading] = createSignal(false)
  const [error, setError] = createSignal<Option<string>>(null)

  const refreshAvatarUrl = async () => {
    if (!user()?.avatar) {
      setAvatarUrl(null)
      return
    }

    const u = user()
    if (u?.avatar) {
      setAvatarUrl(getAvatar(u.id, u.avatar))
    }
  }

  createEffect(() => {
    if (user()) void refreshAvatarUrl()
  })

  const usernameLetters = () => user()?.username.slice(0, 2).toUpperCase() ?? ""

  const onFileSelected = async (e: Event & { currentTarget: HTMLInputElement }) => {
    const file = e.currentTarget.files?.[0]
    e.currentTarget.value = ""
    if (!file) return

    setError(null)

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      setError("Avatars must be a PNG, JPEG, GIF, or WEBP image")
      return
    }

    if (file.size > MAX_AVATAR_SIZE) {
      setError("Avatars must be smaller than 8MB")
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setAvatarUrl(previewUrl)
    setIsUploading(true)

    try {
      const { data } = await client.updateAvatar(file)
      setUser(current => (current ? { ...current, avatar: data.avatar } : current))

      const userId = user()?.id
      if (userId && users[userId]) {
        setUsers(userId, "avatar", data.avatar)
      }

      await refreshAvatarUrl()
    } catch {
      setError("Failed to upload avatar")
      await refreshAvatarUrl()
    } finally {
      URL.revokeObjectURL(previewUrl)
      setIsUploading(false)
    }
  }

  return (
    <div class="flex flex-col gap-4 max-w-md">
      <div class="flex items-center gap-4">
        <button
          type="button"
          class="relative size-20 shrink-0 cursor-pointer overflow-hidden rounded-full bg-light-hl grid place-items-center group disabled:pointer-events-none disabled:opacity-50"
          onClick={() => fileInputRef?.click()}
          disabled={isUploading()}
        >
          <Show when={avatarUrl()} fallback={<p class="font-bold text-2xl">{usernameLetters()}</p>}>
            {url => <img src={url()} alt="Your avatar" class="h-full w-full object-cover" />}
          </Show>

          <div class="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera class="size-6" />
          </div>
        </button>

        <div class="flex flex-col gap-2">
          <p class="font-semibold">{user()?.username}</p>

          <Button
            type="button"
            variant="ghost"
            isLoading={isUploading()}
            onClick={() => fileInputRef?.click()}
            class="w-auto px-3 py-1.5 text-sm"
          >
            Change Avatar
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_AVATAR_TYPES.join(",")}
          class="hidden"
          onChange={onFileSelected}
        />
      </div>

      <Show when={error()}>
        <div class="rounded-lg border border-danger/50 bg-danger/10 p-3 text-center text-sm font-medium text-danger">
          {error()}
        </div>
      </Show>
    </div>
  )
}
