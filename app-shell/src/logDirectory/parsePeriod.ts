import crypto from "crypto"
import type { Dirent } from "fs"
import path from "path"

import * as Unzipper from "unzipper"

import { createLogger } from "../log"
import { parseSignedRobotId, parseRobotId, parseLogOverview, parseLogPeriodFile } from "./parsers"
import type { LogPeriodFile, BlessedRobotId } from "./types"
import { verifyPeriodIdentity, verifyMessages } from "./verifiers"

const _log = createLogger("logDirectory.parsePeriod")

async function operateOnFile<T>(
  zipFile: Unzipper.CentralDirectory,
  fileName: string,
  fn: (file: Unzipper.File) => Promise<T>,
): Promise<T> {
  for (const file of zipFile.files) {
    if (file.path === fileName) {
      return await fn(file)
    }
  }
  throw new Error(`Could not find ${fileName}`)
}

/**
 * Parse a log period and verify its attestation and internal consistency.
 *
 * This function should provide enough data about a period to render its details.
 * Note that it does not verify sequential consistency so that it can operate
 * independently.
 *
 * @param {Dirent} entry: The log period zip file.
 * @param {BlessedRobotId[]} knownIdentities: Any known robot IDs that should
 * be trusted for attestation.
 *
 * @returns {Promise<LogPeriodFile | null>} The parsed period, or null if it
 * could not be parsed.
 */
export async function parsePeriod(
  entry: Dirent,
  knownIdentities: BlessedRobotId[],
): Promise<LogPeriodFile | null> {
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

  const publicKey = await operateOnFile(zip, "signing_key.pem", async (file) =>
    crypto.createPublicKey(await file.buffer()),
  )

  const robotId = await operateOnFile(zip, "robot_identity.json", async (file) => {
    const identityFile = await file.buffer()
    const identityFileParsed = JSON.parse(identityFile.toString("utf-8"))
    const idRaw = parseSignedRobotId(identityFileParsed)
    const payload = parseRobotId(JSON.parse(idRaw.message))

    return {
      parsed: { ...payload },
      raw: idRaw,
      internalConsistency: { status: "unverified" } as const,
    }
  })
  const logFileDetails = await operateOnFile(zip, "log_period.json", async (file) => {
    const fileBuffer = await file.buffer()
    const document = parseLogPeriodFile(JSON.parse(fileBuffer.toString("utf-8")))
    const { softwareVersions, associatedProtocols } = parseLogOverview(document.userLogEntries)
    const { consistency, finalHash } = await verifyMessages(document.userLogEntries, publicKey)
    return {
      startDate: document.startedAt,
      endDate: document.endedAt,
      logCount: document.userLogEntries.length,
      associatedProtocols,
      softwareVersions,
      internalConsistency: consistency,
      trailingLogHash: finalHash,
    }
  })
  const associatedFiles: string[] = []
  for (const file of zip.files) {
    if (
      !["log_period.json", "robot_identity.json", "signing_key.pem"].includes(file.path) &&
      file.type !== "Directory"
    ) {
      associatedFiles.push(file.path)
    }
  }
  const { robotId: validatedRobotId, identityConsistency } = verifyPeriodIdentity(
    robotId,
    publicKey,
    knownIdentities,
  )
  return {
    ...logFileDetails,
    identityConsistency,
    sequentialConsistency: { status: "unverified" },
    robotId: validatedRobotId,
    publicKey,
    associatedFiles,
    periodZip: zipPath,
  }
}
