import type { Dispatch } from "@log-verifier/app/src/redux/store"
import type { RemoteAPI } from "@log-verifier/app/src/remote/api"
import type { Config } from "@log-verifier/app/src/remote/config/types"
import { contextBridge, ipcRenderer } from "electron"

// Everything here should have a registered handler in api.ts
contextBridge.exposeInMainWorld("shell", {
  registerDispatch: (dispatch: Dispatch) => {
    ipcRenderer.on("dispatch", (event, payload) => {
      dispatch(payload)
    })

    return () => {
      ipcRenderer.removeListener("dispatch", dispatch)
    }
  },

  getConfig: () => ipcRenderer.invoke("getConfig"),
  setConfig: (newSlice: Partial<Config>): Promise<Config> =>
    ipcRenderer.invoke("setConfig", newSlice),
  updateConfigBy: (payload: { configPath: string; method: "directoryPicker" }): Promise<Config> =>
    ipcRenderer.invoke("updateConfigBy", payload),
  setUiStatus: (status: "ready") => {
    ipcRenderer.send("setUiStatus", { status })
  },
} as RemoteAPI)
