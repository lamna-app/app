export function getAvatar(userID: string, hash: string): string {
  const BASE = import.meta.env.VITE_S3_URL
  return `${BASE}/avatars/${userID}/${hash}.png` // TODO: eventually fix this (.png)
}
