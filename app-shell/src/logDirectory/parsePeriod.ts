import crypto from "crypto"
import type { Dirent } from "fs"
import path from "path"

import omit from "lodash/omit"
import * as Unzipper from "unzipper"

import { createLogger } from "../log"
import { parseSignedMessage, parseRobotId } from "./parsers"
import type { LogPeriodFile } from "./types"

const _log = createLogger("logDirectory.parsePeriod")

export async function parsePeriod(entry: Dirent): Promise<LogPeriodFile | null> {
  const _msg = (message: string): string =>
    `parsing ${path.join(entry.parentPath, entry.name)}: ${message}`
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
  if (!entry.isFile()) {
    log.warning(`Entity at ${path.join(entry.parentPath, entry.name)} is not a file, ignoring`)
    return null
  }
  if (!entry.name.endsWith("zip")) {
    log.warning(
      `Entity at ${path.join(entry.parentPath, entry.name)} does not end in zip, ignoring`,
    )
    return null
  }
  const zipPath = path.join(entry.parentPath, entry.name)
  const zip = await Unzipper.Open.file(zipPath)
  const periodZip: Partial<LogPeriodFile> = { periodZip: zipPath }
  let lookingFor = ["log_period.json", "robot_identity.json", "signing_key.pem"] as const
  for (const file of zip.files) {
    if (file.type === "Directory") {
      log.warning(`Ignoring directory ${file.path} in zip`)
      continue
    }
    if (file.path == "log_period.json") {
      const fileBuffer = await file.buffer()
      try {
        const document = JSON.parse(fileBuffer.toString("utf-8"))
        periodZip.startDate = document.startedAt
        periodZip.endDate = document.endedAt
        lookingFor = omit(lookingFor, "log_period.json")
      } catch (err: any) {
        log.error(`error parsing log period: ${err}`)
        throw err
      }
    } else if (file.path == "robot_identity.json") {
      try {
        const identityFile = await file.buffer()
        const identityFileParsed = JSON.parse(identityFile.toString("utf-8"))
        const idRaw = parseSignedMessage(identityFileParsed)
        const payload = parseRobotId(JSON.parse(idRaw.message))

        periodZip.robotId = { parsed: { ...payload, status: "unverified" }, raw: idRaw }
        lookingFor = omit(lookingFor, "robot_identity.json")
      } catch (err: any) {
        log.error(`Failed to parse robot id: ${err}`)
      }
    } else if (file.path == "signing_key.pem") {
      periodZip.publicKey = crypto.createPublicKey(await file.buffer())
      lookingFor = omit(lookingFor, "signing_key.pem")
    } else {
      if (periodZip?.associatedFiles == null) {
        periodZip.associatedFiles = [file.path]
      } else {
        periodZip.associatedFiles.push(file.path)
      }
    }
  }
  if (lookingFor.length > 0) {
    throw new Error(`Missing from ${zipPath}: ${lookingFor.join(", ")}`)
  }
  return periodZip as LogPeriodFile
}
