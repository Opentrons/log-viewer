import type { Dispatch } from "@/redux/store"

import type { Config } from "./config/types"
export interface RemoteAPI {
  registerDispatch: (dispatch: Dispatch) => () => void
  getConfig: () => Promise<Config>
  setConfig: (newSlice: Partial<Config>) => Promise<Config>
  updateConfigBy: (payload: { configPath: string; method: "directoryPicker" }) => Promise<Config>
  setUiStatus: (status: "ready") => void
}

// @ts-expect-error(sf): this is injected by preload
export const api = shell as RemoteAPI
