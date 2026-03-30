import { type JSXElement } from "solid-js"

export default function RootLayout<T extends { children?: JSXElement }>(props: T) {
  return props.children
}
