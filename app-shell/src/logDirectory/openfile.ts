import { mkdtemp, writeFile } from "fs/promises"
import path from "path"

import { app, shell } from "electron"
import * as Unzipper from "unzipper"

import { createLogger } from "../log"

const _log = createLogger("logDirectory.openFile")

export async function openFile({
  logPath,
  fileName,
}: {
  logPath: string
  fileName: string
}): Promise<void> {
  const _msg = (message: string): string => `opening ${fileName} in ${logPath}: ${message}`
  const log = {
    info: (message: string) => {
      _log.info(_msg(message))
    },
    warning: (message: string) => {
      _log.warning(_msg(message))
    },
    error: (message: string) => {
      _log.error(_msg(message))
    },
  } as const

  if (!logPath.endsWith(".zip")) {
    log.error("Log period provided is not a zip file")
    return
  }

  const directory = await Unzipper.Open.file(logPath)
  let file = null
  for (const _file of directory.files) {
    if (path.basename(_file.path) === fileName) {
      file = _file
    }
  }
  if (file == null) {
    log.error("File not found")
    return
  }

  const tempPath = app.getPath("temp")
  const folderPath = path.join(tempPath, "log-verifier-")

  const tempDir = await mkdtemp(folderPath).catch((error) => {
    log.error(`Error creating temporary directory: ${error}`)
    return null
  })
  if (tempDir == null) {
    log.error("Error creating temporary directory")
    return
  }

  const buffer = await file.buffer().catch((error) => {
    log.error(`Error reading file: ${error}`)
    return null
  })
  if (buffer == null) {
    log.error("Error reading file")
    return
  }

  const tempFilePath = path.join(tempDir, fileName)
  writeFile(tempFilePath, buffer)
    .then(async () => {
      log.info(`Directory created and file written to ${tempFilePath}, opening file`)
      await shell.openPath(tempFilePath)
    })
    .catch((error) => {
      log.error(`Error writing file to ${tempFilePath}: ${error}`)
    })
}
