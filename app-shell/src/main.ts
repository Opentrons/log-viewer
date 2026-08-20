import path from "path"
import { setInterval } from "timers/promises"

import { app, BrowserWindow } from "electron"

import { getConfig } from "./config"
import { createLogger } from "./log"

const log = createLogger("main")
app.once("window-all-closed", () => {
  log.info("Quitting because all windows closed")
  app.quit()
})

void app
  .whenReady()
  .then(async () => {
    const uiConfig = getConfig("ui")
    const mainWindow = new BrowserWindow({
      show: false,
      webPreferences: {
        devTools: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        sandbox: false,
        contextIsolation: false,
      },
    })
    mainWindow.once("ready-to-show", () => mainWindow.show())
    const uiPath =
      uiConfig.url.protocol === "file:"
        ? path.join(app.getAppPath(), uiConfig.url.path)
        : uiConfig.url.path
    const uiUrl = `${uiConfig.url.protocol}//${uiPath}`

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
