import { Client } from "@/libs/client"

const client = new Client()
export function useClient(): Client {
  return client
}
