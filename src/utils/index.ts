export function getAvatar(userID: string, hash: string): string {
  const BASE = import.meta.env.VITE_CDN_URL
  return `${BASE}/avatars/${userID}/${hash}`
}
