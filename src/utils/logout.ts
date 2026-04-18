import { reconcile } from "solid-js/store"

import { useClient } from "@/hooks/useClient"
import { useSocket } from "@/hooks/useSocket"

import { setUser } from "@/stores/userStore"

import { setChannels, setCurrentChannel } from "@/features/channel"
import { setCurrentGuild, setGuilds } from "@/features/guild"
import { setGuildMembers } from "@/features/guild_members"
import { setChatStore } from "@/features/message"
import { setUsers } from "@/features/users"

export default function logout() {
  const client = useClient()
  const socket = useSocket()

  socket.disconnect()
  client.logout()

  setUser(null)
  setCurrentGuild(null)
  setCurrentChannel(null)
  setGuilds(reconcile({}))
  setChannels(reconcile({}))
  setGuildMembers(reconcile({}))
  setChatStore(reconcile({}))
  setUsers(reconcile({}))
}
