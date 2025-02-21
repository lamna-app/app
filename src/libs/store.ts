import { createStore, SetStoreFunction } from "solid-js/store";

import type { CachedUser, MessageType, Properties } from "~/types";

export type StoreData = {
  websocket?: WebSocket;
  messages?: Properties<MessageType[]>;
  auth?: Properties<{ auth: string; refresh: string }>; // TODO: Will probably be moved
  isAuthed?: Properties<boolean>;
  user?: Properties<CachedUser>;
};

export const [store, setStore]: [store: StoreData, setStore: SetStoreFunction<StoreData>] =
  createStore({});

export const tempSetCookie = (token: string) => {
  // As you can see, proof-of-concept:
  document.cookie = `lamna-auth=${token}; expires=Sat 01 March 2025 00:00:00 UTC; domain=100.88.207.41; path=/;`;
};

export const tempGetCookie = (name: string): string => {
  const cookies: Record<string, string> = document.cookie
    .split("; ")
    .reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = value;
      return acc;
    }, {});
  return cookies[name];
};
