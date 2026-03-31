import { type JSXElement, onMount } from "solid-js"
import { useSocket } from "@/hooks/useSocket"

export default function RootLayout<T extends { children?: JSXElement }>(props: T) {
  const socket = useSocket()

  onMount(() => {
    socket.connect(localStorage.getItem("token")?.split(" ")[1] as string)
  })

  return props.children
}
