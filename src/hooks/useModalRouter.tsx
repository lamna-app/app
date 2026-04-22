import { createContext, createSignal, useContext } from "solid-js"

import type { JSXElement } from "solid-js"

export function createModalRouter<T extends string>() {
  const [state, setState] = createSignal<Option<{ name: T; args?: unknown }>>(null)

  return {
    open: <Args,>(modal: T, args?: Args) => setState({ name: modal, args }),
    close: () => setState(null),
    isOpen: (modal: T) => state()?.name === modal,
    active: () => state()?.name,
    getArgs: <Args,>(modal: T): Args | undefined => (state()?.name === modal ? (state()?.args as Args) : undefined)
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
