import { createMemo, For, Show } from "solid-js"

import { currentGuild } from "@/features/guild"
import { guildMembers } from "@/features/guild_members"
import { users } from "@/features/users"

import type { GuildMember, User, UserPresence } from "@/types/models"

type ResolvedMember = GuildMember & { user: User }

const STATUS_COLORS: Record<UserPresence, string> = {
  online: "#00c950",
  idle: "#f0b100",
  dnd: "#fb2c36",
  offline: "#6a7282"
}

function MemberItem(props: { member: ResolvedMember; user: User }) {
  const isOffline = props.user.presence === "offline"

  return (
    <div class="flex items-center gap-3 p-2 hover:bg-light/20 cursor-pointer rounded-lg">
      <div class="relative flex h-8 w-8 items-center justify-center rounded-full bg-gray-500/30 text-white">
        <div
          style={{
            "background-color": STATUS_COLORS[props.user.presence]
          }}
          class="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-dark"
        />
      </div>

      <span
        classList={{
          "text-gray-500": isOffline,
          "text-white": !isOffline
        }}
        class="font-medium text-white"
      >
        {props.user.username}
      </span>
    </div>
  )
}

function MemberCategory(props: { title: string; members: ResolvedMember[] }) {
  return (
    <Show when={props.members.length > 0}>
      <div class="flex flex-col gap-1">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {props.title} — {props.members.length}
        </h3>

        <For each={props.members}>{member => <MemberItem member={member} user={member.user} />}</For>
      </div>
    </Show>
  )
}

export default function UserSidebar() {
  const membersList = createMemo<ResolvedMember[]>(() => {
    const guildId = currentGuild()?.id
    if (!guildId) return []

    const membersForGuild = Object.values(guildMembers[guildId] || {})

    return membersForGuild
      .map(member => ({
        ...member,
        user: users[member.user_id]
      }))
      .filter((m): m is ResolvedMember => m.user !== undefined)
  })

  const roles = () => {
    const members = membersList()

    return [
      {
        id: "online",
        title: "Online",
        members: members.filter(m => m.user.presence !== "offline")
      },
      {
        id: "offline",
        title: "Offline",
        members: members.filter(m => m.user.presence === "offline")
      }
    ]
  }

  return (
    <Show when={currentGuild()}>
      <div class="flex h-full w-full flex-col overflow-y-auto select-none gap-6 p-4">
        <For each={roles()}>{role => <MemberCategory title={role.title} members={role.members} />}</For>
      </div>
    </Show>
  )
}
