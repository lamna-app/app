import type { JSXElement } from "solid-js"

export default function HomeLayout<T extends { children?: JSXElement }>(props: T) {
  return props.children
}
