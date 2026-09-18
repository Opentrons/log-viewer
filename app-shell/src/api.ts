import type { Dispatch } from "@log-verifier/app/src/redux/store"
import type { RemoteAPI } from "@log-verifier/app/src/remote/api"
import { ipcMain } from "electron"
import type { BrowserWindow, IpcMainInvokeEvent } from "electron"

import { createLogger } from "./log"

const log = createLogger("api")

export type APIHandlers = {
  [ApiCalls in keyof Omit<RemoteAPI, "registerDispatch" | "setUiStatus">]: (
    ...args: [IpcMainInvokeEvent, ...Parameters<RemoteAPI[ApiCalls]>]
  ) => ReturnType<RemoteAPI[ApiCalls]>
}

export function initializeAPI(
  window: BrowserWindow,
  handlers: APIHandlers,
  onUiStatus: (arg: { status: "ready" }) => void,
): (action: Parameters<Dispatch>[0]) => void {
  Object.entries(handlers).forEach(([apiCall, apiCallHandler]) => {
    log.info(`Adding handler for ${apiCall}`)
    ipcMain.handle(apiCall, apiCallHandler)
  })
  ipcMain.on("setUiStatus", (_event, arg: { status: "ready" }) => {
    onUiStatus(arg)
  })
  return (action: Parameters<Dispatch>[0]) => {
    window.webContents.send("dispatch", action)
  }
}
