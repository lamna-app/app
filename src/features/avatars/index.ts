import { getAvatar } from "@/utils"

export function getCachedAvatarUrl(userId?: string | null, hash?: string | null) {
  if (!userId || !hash) return null
  return getAvatar(userId, hash)
}
