import { getAvatar } from "@/utils"

export function getCachedAvatarUrl(userId?: string | null, hash?: string | null, size?: number) {
  if (!userId || !hash) return null
  return getAvatar(userId, hash, size)
}
