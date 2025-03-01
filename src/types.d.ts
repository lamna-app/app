import { Moment } from "moment";

import type { Accessor, Setter } from "solid-js";

export interface Properties<Type> {
  getter: Accessor<Type>;
  setter: Setter<Type>;
}

export interface User {
  id: string;
  username: string;
  bot: boolean;
  staff: boolean;
}

export interface Message {
  id: string;
  content: string;
  timestamp: moment;
  author: User;
  channelId: string;
}

export interface CachedUser {
  id: string;
  username: string;
}
