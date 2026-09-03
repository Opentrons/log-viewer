import { stat, mkdir } from "fs/promises"
import path from "path"
import { setInterval } from "timers/promises"

import { app, BrowserWindow, dialog, session } from "electron"
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-extension-installer"

import { initializeAPI } from "./api"
import { getConfig, updateConfigBySlice, setConfig, handleConfigChange } from "./config"
import type { Config } from "./config/types"
import { createLogger } from "./log"
import { initialize as initializeLogChecker, refresh as refreshLogChecker } from "./logDirectory"
import type { LogChecker } from "./logDirectory/types"

const log = createLogger("main")
app.once("window-all-closed", () => {
  log.info("Quitting because all windows closed")
  app.quit()
})

console.log(`Environment is prod: ${import.meta.env.PROD}`)

void app
  .whenReady()
  .then(async () => {
    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      // oxlint-disable-next-line no-callback-in-promise (this is the api, not me)
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Content-Security-Policy": [
            `default-src 'self'; style-src 'self' 'unsafe-inline'${import.meta.env.PROD !== true ? "; script-src 'unsafe-inline' 'self'" : ""}`,
          ],
        },
      })
    })
    const uiConfig = getConfig("ui")
    const mainWindow = new BrowserWindow({
      show: false,
      width: uiConfig.width,
      minWidth: uiConfig.minWidth,
      height: uiConfig.height,
      minHeight: uiConfig.minHeight,
      webPreferences: {
        devTools: true,
        webSecurity: true,
        allowRunningInsecureContent: false,
        sandbox: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./preload.js"),
      },
    })
    mainWindow.once("ready-to-show", () => mainWindow.show())
    let logChecker: LogChecker | null = null
    const dispatch = initializeAPI(
      mainWindow,
      {
        getConfig: (_event: unknown) =>
          new Promise<Config>((resolve) => {
            resolve(getConfig())
          }),
        setConfig: (_event: unknown, configSlice: Partial<Config>) =>
          new Promise<Config>((resolve) => {
            resolve(updateConfigBySlice(configSlice))
          }),
        updateConfigBy: (
          _event: unknown,
          payload: { configPath: string; method: "directoryPicker" },
        ) =>
          new Promise<Config>((resolve, reject) => {
            log.info(`updateConfigBy ${payload.configPath} ${payload.method}`)
            return dialog
              .showOpenDialog(mainWindow, {
                properties: [
                  "openDirectory",
                  "createDirectory",
                  "promptToCreate",
                  "dontAddToRecent",
                ],
              })
              .then((result) => {
                log.info(`dialog done, result ${JSON.stringify(result)}`)
                if (result.canceled) {
                  resolve(getConfig())
                }
                const selected = result.filePaths[0]
                if (selected == null) {
                  setConfig(payload.configPath, null)
                  resolve(getConfig())
                  return
                }
                stat(selected)
                  .then((existing) => {
                    if (existing.isDirectory()) {
                      setConfig(payload.configPath, selected)
                      resolve(getConfig())
                      return
                    } else {
                      reject(new Error("Must be a directory"))
                      return
                    }
                  })
                  .catch(() =>
                    mkdir(selected, { recursive: true })
                      .then(() => {
                        setConfig(payload.configPath, selected)
                        resolve(getConfig())
                        return
                      })
                      .catch((err) => reject(err)),
                  )
              })
          }),
      },
      (_args: unknown) => {
        const loadedConfig = getConfig()
        dispatch({ type: "config/load", payload: loadedConfig })
        dispatch({
          type: "logDirectory/setPath",
          payload: { directoryPath: loadedConfig.logFiles.workingDirectory },
        })
        if (logChecker == null && loadedConfig.logFiles.workingDirectory != null) {
          logChecker = initializeLogChecker(dispatch, loadedConfig.logFiles.workingDirectory)
        }
        return logChecker != null && logChecker?.scanDirectory()
      },
    )

    handleConfigChange("logFiles.workingDirectory", (newValue: any, _oldValue: any) => {
      dispatch({ type: "logDirectory/setPath", payload: { directoryPath: newValue } })
      if (newValue == null && logChecker != null) {
        return logChecker.teardown().finally(() => {
          logChecker = null
        })
      } else if (newValue != null && logChecker != null) {
        return refreshLogChecker(dispatch, newValue, logChecker).then((newChecker) => {
          logChecker = newChecker
          return logChecker.scanDirectory()
        })
      } else if (newValue != null && logChecker == null) {
        logChecker = initializeLogChecker(dispatch, newValue)
        return logChecker.scanDirectory()
      }
    })

    const uiPath =
      uiConfig.url.protocol === "file:"
        ? path.join(app.getAppPath(), uiConfig.url.path)
        : uiConfig.url.path
    const uiUrl = `${uiConfig.url.protocol}//${uiPath}`

    try {
      await Promise.all([
        installExtension(REACT_DEVELOPER_TOOLS, {
          loadExtensionOptions: { allowFileAccess: true },
        }),
        installExtension(REDUX_DEVTOOLS),
      ])
    } catch (err: unknown) {
      log.warning(`Error loading extensions: ${JSON.stringify(err)}`)
    }

    for await (const _ of setInterval(1000)) {
      try {
        log.info(`Loading main window from ${uiUrl} from config ${JSON.stringify(uiConfig.url)}`)
        await mainWindow.webContents.loadURL(uiUrl)
        log.info(`Loaded UI from ${uiUrl}`)
        break
      } catch (e: unknown) {
        log.error(`Failed to load ${uiUrl}: ${JSON.stringify(e)}`)
      }
    }
  })
  .catch((err: unknown) => {
    log.error(`Failed to execute app load: ${JSON.stringify(err)}`)
  })
