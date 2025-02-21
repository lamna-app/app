import { createStore, SetStoreFunction } from "solid-js/store";

import type { MessageType } from "~/types";

export type StoreData = {
  websocket?: WebSocket;
  messages: MessageType[];
  auth?: { auth: string; refresh: string };
  isAuthed: boolean;
  user?: { username: string; id: string };
};

export const [store, setStore]: [store: StoreData, setStore: SetStoreFunction<StoreData>] =
  createStore<StoreData>({
    messages: [],
    isAuthed: false,
  });

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
