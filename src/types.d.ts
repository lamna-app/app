import type { Accessor, Setter } from "solid-js";

export interface Properties<T> {
  getter: Accessor<T>;
  setter: Setter<T>;
}

export interface MessageT {
  id: number;
  author: string;
  content: string;
}
