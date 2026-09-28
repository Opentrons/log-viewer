import { once, EventEmitter } from "events"
import { writeFile } from "fs/promises"

import type { PDFAPI } from "@log-verifier/app/src/remote/pdf-api"
import { BrowserWindow, dialog, ipcMain } from "electron"

import { createLogger } from "../log"
import { findPeriod } from "../logDirectory/stateHelpers"
import type { LogChecker } from "../logDirectory/types"
import { buildBrowserWindow, loadPdfContent } from "../ui"

const log = createLogger("pdf")

export async function generatePdf(
  zipPath: string,
  mainWindow: BrowserWindow,
  logChecker: LogChecker,
): Promise<{ savedTo: string }> {
  const win = buildBrowserWindow("preloadPdf", false)
  const doneEE = new EventEmitter()
  try {
    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: `Export ${zipPath} as PDF`,
      filters: [{ name: "PDF Files", extensions: [".pdf"] }],
      properties: ["createDirectory", "showOverwriteConfirmation"],
    })
    log.info(`Will save pdf to: ${saveResult.filePath}`)
    if (saveResult.filePath === "") {
      log.error("No path selected by user")
      throw new Error("No path selected")
    }
    ipcMain.handle(
      "pdfLoadMetadata",
      async (
        _event: any,
        payload: Parameters<PDFAPI["loadMetadata"]>[0],
      ): ReturnType<PDFAPI["loadMetadata"]> => {
        log.info("app requested metadata")
        const shellLog = findPeriod(logChecker.state, payload.zipPath)
        return {
          internalConsistency: shellLog.internalConsistency,
          attestationConsistency: shellLog.identityConsistency,
          sequentialConsistency: shellLog.sequentialConsistency,
          endDate: shellLog.endDate,
          startDate: shellLog.startDate,
          associatedFiles: shellLog.associatedFiles,
          protocolNames: shellLog.associatedProtocols,
          softwareVersions: shellLog.softwareVersions,
          logCount: shellLog.logCount,
          robotId: {
            name: shellLog.robotId.parsed.robot_name,
            publicKeyHash: shellLog.robotId.parsed.public_hash,
            serial: shellLog.robotId.parsed.robot_serial,
            internalConsistency: shellLog.robotId.internalConsistency,
          },
        }
      },
    )
    ipcMain.handle(
      "pdfLoadLines",
      (
        _event: any,
        payload: Parameters<PDFAPI["loadLines"]>[0],
      ): ReturnType<PDFAPI["loadLines"]> => {
        log.info("app requested lines")
        return logChecker.parseLines(payload.zipPath)
      },
    )
    ipcMain.on("pdfStatus", (event, payload: Parameters<PDFAPI["status"]>[0]): void => {
      if (payload.status !== "not-ready") {
        doneEE.emit("result", payload)
      }
    })
    const waiter = once(doneEE, "result")
    await loadPdfContent(win, zipPath)
    const [renderResult] = await waiter
    if (renderResult.status === "error") {
      log.info(`pdf render error: ${JSON.stringify(renderResult.error)}`)
      throw new Error(renderResult.toReversed(status))
    }
    const pdfBytes = await win.webContents.printToPDF({})
    await writeFile(saveResult.filePath, pdfBytes)
    log.info(`wrote pdf to ${saveResult.filePath}`)
    return { savedTo: saveResult.filePath }
  } finally {
    win.destroy()
    ipcMain.removeHandler("pdfLoadMetadata")
    ipcMain.removeHandler("pdfLoadLines")
    ipcMain.removeAllListeners("pdfStatus")
  }
}
