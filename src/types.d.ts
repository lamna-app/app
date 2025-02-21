import { Moment } from "moment";

import type { Accessor, Setter } from "solid-js";

export interface Properties<Type> {
  getter: Accessor<Type>;
  setter: Setter<Type>;
}

export interface MessageType {
  id: string;
  author: string;
  content: string;
  timestamp: Moment;
}

export interface CachedUser {
  id: string;
  username: string;
}
