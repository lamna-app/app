import { createStore, SetStoreFunction } from "solid-js/store";

import type { MessageType, Properties } from "~/types";

export type StoreData = {
  websocket?: WebSocket;
  messages?: Properties<MessageType[]>;
};

export const [store, setStore]: [store: StoreData, setStore: SetStoreFunction<StoreData>] =
  createStore({});
