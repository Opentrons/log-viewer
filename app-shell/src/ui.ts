import path from "path"
import { setInterval } from "timers/promises"

import { BrowserWindow, app } from "electron"
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} from "electron-extension-installer"

import { getConfig } from "./config"
import { createLogger } from "./log"

const log = createLogger("ui")

export function buildBrowserWindow(
  preload: "preload" | "preloadPdf",
  autoshow: boolean,
): BrowserWindow {
  const uiConfig = getConfig("ui")
  const window = new BrowserWindow({
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
      preload: path.join(__dirname, `${preload}.js`),
    },
  })
  if (autoshow) {
    window.once("ready-to-show", () => {
      window.show()
    })
  }
  return window
}

async function loadContentOnce(window: BrowserWindow, uri: URL): Promise<void> {
  log.info(`Loading main window from ${uri}`)
  await window.webContents.loadURL(uri.href)
  log.info(`Loaded UI from ${uri}`)
}

export async function loadContent(window: BrowserWindow, uri: URL): Promise<void> {
  for await (const _ of setInterval(1000)) {
    try {
      await loadContentOnce(window, uri)
      break
    } catch (e: unknown) {
      log.error(`Failed to load ${uri}: ${JSON.stringify(e)}`)
    }
  }
}

export async function loadMainContent(window: BrowserWindow): Promise<void> {
  const uiConfig = getConfig("ui")
  const uiPath =
    uiConfig.url.protocol === "file:"
      ? path.join(app.getAppPath(), uiConfig.url.path)
      : uiConfig.url.path
  const uiUrl = new URL(`${uiConfig.url.protocol}//${uiPath}`)
  return await loadContent(window, uiUrl)
}

export async function loadPdfContent(window: BrowserWindow, zipPath: string): Promise<void> {
  const uiConfig = getConfig("ui")
  const pdfPath =
    uiConfig.url.protocol === "file:"
      ? path.join(app.getAppPath(), uiConfig.url.pdfPath)
      : uiConfig.url.pdfPath
  const pdfUrl = new URL(`${uiConfig.url.protocol}//${pdfPath}`)
  pdfUrl.search = `?p=${encodeURIComponent(zipPath)}`
  return await loadContentOnce(window, pdfUrl)
}

export async function loadExtensions(): Promise<void> {
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
}
