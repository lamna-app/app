import type { JSXElement } from "solid-js"

export default function Sidebar({ children }: { children?: JSXElement }) {
  return <div class="bg-dark h-screen w-72 shrink-0">{children}</div>
}
