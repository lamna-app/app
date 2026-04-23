import { useNavigate } from "@solidjs/router"
import { createEffect, createSignal, Show } from "solid-js"

import { useClient } from "@/hooks/useClient"

import { currentChannel } from "@/features/channel"
import { selectGuild } from "@/features/guild"
import InputField from "../common/Input"
import GuildIcon from "../utils/GuildIcon"
import Modal from "../utils/Modal"

import type { Guild } from "@/types/models"
import type { ModalConsumerProps } from "@/types/utils"
import type { ModalProps } from "../utils/Modal"

type Page = "invite" | "create" | "success"

export default function AddGuildModal(props: ModalConsumerProps) {
  let codeInputRef: HTMLInputElement | undefined

  const client = useClient()
  const navigate = useNavigate()

  const [page, setPage] = createSignal<Page>("invite")
  const [guildName, setGuildName] = createSignal<string>("")
  const [guild, setGuild] = createSignal<Option<Guild>>(null)

  const nameLetters = () =>
    guildName()
      .split(" ")
      .map(word => word[0]?.toUpperCase())

  createEffect(() => {
    if (props.open) {
      setPage("invite")
      setGuildName("")
    }
  })

  const onJoinSubmit = async () => {
    if (!codeInputRef) return
    const cleanInput = codeInputRef.value.trim().replace(/\/+$/, "")

    const parts = cleanInput.split("/")
    const cleanCode = parts[parts.length - 1]

    await client.joinInvite(cleanCode)
  }

  const onCreateSubmit = async () => {
    if (!guildName()) return

    const { data: guild } = await client.createGuild(guildName())
    setGuild(guild)
    setPage("success")
  }

  const config: () => Omit<ModalProps, "onClose" | "open" | "children"> = () => {
    switch (page()) {
      case "invite":
        return {
          title: "Got an invite?",
          subtitle: "Join an existing guild by entering the invite below",
          actions: [
            {
              label: "Create your own",
              variant: "primary",
              onClick: () => void setPage("create"),
              closeOnSuccess: false
            },
            { label: "Join", variant: "primary", onClick: onJoinSubmit }
          ]
        }

      case "create":
        return {
          title: "Create a guild",
          actions: [{ label: "Create", variant: "primary", onClick: onCreateSubmit, closeOnSuccess: false }]
        }

      case "success":
        return {
          title: "Your guild is ready!",
          actions: [
            {
              label: "Take me there",
              variant: "primary",
              onClick: async () => {
                const g = guild()
                if (!g) return
                await selectGuild(g)
                const channelID = currentChannel()?.id
                navigate(`/channels/${g.id}${channelID ? `/${channelID}` : ""}`)
              }
            }
          ]
        }
    }
  }

  return (
    <Modal
      title={config().title}
      subtitle={config().subtitle}
      open={props.open}
      onClose={props.onClose}
      actions={config().actions}
    >
      <Show when={page() === "invite"}>
        <div class="pt-4">
          <InputField ref={codeInputRef} label="Invite Code" placeholder="lamna.gg/abc123def" />
        </div>
      </Show>

      <Show when={page() === "create"}>
        <div class="grid place-items-center">
          <div class="bg-light-hl size-32 rounded-full grid place-items-center group cursor-pointer">
            <p class="font-bold text-3xl">{nameLetters().slice(0, 4)}</p>
            {/* <Camera class="opacity-0 group-hover:opacity-60 size-12 pb-3 transition-opacity" /> */}
          </div>
          <input
            onInput={e => setGuildName(e.target.value)}
            type="text"
            class="-mt-8 bg-dark-hl py-1 text-center font-medium outline-none"
            placeholder="Lamna Hideout"
          />
        </div>
      </Show>
      <Show when={page() === "success" && guild()}>
        {guild => (
          <div class="flex items-center justify-center mt-4">
            <div class="flex flex-col gap-2 items-center">
              <div class="*:rounded-full *:hover:rounded-full *:size-24 *:text-3xl">
                <GuildIcon name={guild().name} />
              </div>
              <p class="text-center font-bold text-2xl">{guild().name}</p>
            </div>
          </div>
        )}
      </Show>
    </Modal>
  )
}
