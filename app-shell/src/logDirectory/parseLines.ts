import type { KeyObject } from "crypto"

import * as Unzipper from "unzipper"

import { parseUserLog, parseLogLine } from "./parsers"
import type { LogLine } from "./types"
import { verifyMessage } from "./verifiers"

export async function parseLines(
  path: string,
  key: KeyObject,
  finalHash: Buffer,
): Promise<LogLine[]> {
  const zip = await Unzipper.Open.file(path)
  const logPeriod = zip.files.find((d) => d.path === "log_period.json")
  if (logPeriod == null) {
    throw new Error("Failed to find log_period.json in log zip")
  }
  const periodBuffer = await logPeriod.buffer()
  const document = JSON.parse(periodBuffer.toString("utf-8"))
  let previousDetails = { hash: finalHash, id: -1 }
  return [
    // oxlint-disable-next-line no-useless-spread this reifies an iterator to an array
    ...parseUserLog(document).map((message, index) => {
      try {
        const messagePayload = parseLogLine(message)
        const { consistency, actualHash } = verifyMessage(message, key, previousDetails)
        previousDetails = { hash: actualHash, id: index }
        return {
          envelope: message,
          payload: {
            action: messagePayload.action,
            userName: messagePayload.accountName,
            legalName: messagePayload.legalName,
            message: messagePayload.message,
            userNote: messagePayload.reason,
            loggedAt: messagePayload.loggedAt,
          },
          id: index,
          sequentialConsistency: consistency,
        }
      } catch (err: any) {
        throw new Error(`Error parsing log line ${index}: ${err.message}`)
      }
    }),
  ]
}
