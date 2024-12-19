import type { Accessor, Setter } from "solid-js";

export interface Properties<Type> {
  getter: Accessor<Type>;
  setter: Setter<Type>;
}

export interface MessageType {
  id: number;
  author: string;
  content: string;
}
