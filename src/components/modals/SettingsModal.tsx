import { useNavigate } from "@solidjs/router"
import { createMemo, createSignal, For } from "solid-js"
import { Dynamic } from "solid-js/web"

import logout from "@/utils/logout"
import Modal from "../utils/Modal"

import type { ModalConsumerProps } from "@/types/utils"

const AccountSettings = () => <div></div>
const AppearanceSettings = () => <div></div>

const Settings = {
  "User Settings": [{ id: "account", label: "My Account", component: AccountSettings }],
  "App Settings": [{ id: "appearance", label: "Appearance", component: AppearanceSettings }]
} as const

type MenuId = (typeof Settings)[keyof typeof Settings][number]["id"]

const MenuItem = (props: { label: string; isActive: boolean; onClick: () => void; type: "primary" | "danger" }) => {
  return (
    <button
      classList={{
        "bg-light-hl text-text": props.isActive && props.type !== "danger",
        "hover:bg-light/70 text-text/70 hover:text-text cursor-pointer": !props.isActive && props.type !== "danger",
        "text-danger hover:bg-danger/10 hover:text-danger/90 cursor-pointer": props.type === "danger"
      }}
      class="text-left px-3 py-2 rounded-md transition-colors"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  )
}

export default function SettingsModal(props: ModalConsumerProps) {
  const navigate = useNavigate()

  const [activeId, setActiveId] = createSignal<MenuId>("account")

  const activeComponent = createMemo(() => {
    for (const category of Object.values(Settings)) {
      const found = category.find(item => item.id === activeId())
      if (found) return found
    }

    return
  })

  const onLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <Modal expanded={true} open={props.open} onClose={props.onClose}>
      <div class="flex h-full w-full text-text">
        <div class="bg-dark shrink-0 flex flex-col p-3 py-8 w-70 overflow-y-auto gap-4">
          <For each={Object.entries(Settings)}>
            {([category, items]) => (
              <div>
                <div class="text-xs font-bold text-text/50 px-2 mb-2 uppercase">{category}</div>

                <div class="flex flex-col gap-0.5">
                  <For each={items}>
                    {item => (
                      <MenuItem
                        type="primary"
                        label={item.label}
                        isActive={activeId() === item.id}
                        onClick={() => void setActiveId(item.id)}
                      />
                    )}
                  </For>
                </div>
              </div>
            )}
          </For>

          <div class="border-t border-light-hl" />
          <MenuItem label="Log Out" isActive={false} onClick={onLogout} type="danger" />
        </div>

        <div class="flex-1 h-full p-6 sm:p-10 overflow-y-auto bg-background">
          <div class="mx-auto">
            <h2 class="text-xl font-bold text-text mb-6">{activeComponent()?.label}</h2>

            <Dynamic component={activeComponent()?.component} />
          </div>
        </div>
      </div>
    </Modal>
  )
}
