import { Context, createContext } from "solid-js";
import { Store } from "solid-js/store";

import type { StoreData } from "~/libs/store";

type GlobalContextData = {
  store: Store<StoreData>;
};

export const GlobalContext: Context<GlobalContextData | undefined> = createContext(undefined);
