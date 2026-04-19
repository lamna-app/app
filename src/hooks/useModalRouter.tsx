import { createContext, createSignal, useContext } from "solid-js"

import type { JSXElement } from "solid-js"

export function createModalRouter<T extends string>() {
  const [active, setActive] = createSignal<Option<T>>()

  return {
    open: (modal: T) => setActive(() => modal),
    close: () => setActive(null),
    isOpen: (modal: T) => active() === modal,
    active
  }
}

type ModalRouter<T extends string> = ReturnType<typeof createModalRouter<T>>
const ModalRouterContext = createContext<ModalRouter<string>>()

export function ModalRouterProvider<T extends string>(props: { router: ModalRouter<T>; children: JSXElement }) {
  return (
    <ModalRouterContext.Provider value={props.router as unknown as ModalRouter<string>}>
      {props.children}
    </ModalRouterContext.Provider>
  )
}

export function useModalRouter<T extends string>() {
  const context = useContext(ModalRouterContext)
  if (!context) throw new Error("useModalRouter must be used inside of ModalRouterProvider")
  return context as unknown as ModalRouter<T>
}
