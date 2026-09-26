export function getAvatar(userID: string, hash: string, size?: number): string {
  const BASE = import.meta.env.VITE_CDN_URL
  const url = `${BASE}/avatars/${userID}/${hash}`
  return size ? `${url}?size=${size}` : url
}

const PHOTON_AVATAR_SIZES = [64, 128, 256, 512] as const

export function pickAvatarSize(px: number): number {
  const target = px * (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1)
  return PHOTON_AVATAR_SIZES.find(size => size >= target) ?? PHOTON_AVATAR_SIZES[PHOTON_AVATAR_SIZES.length - 1]
}
