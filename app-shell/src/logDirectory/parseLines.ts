import type { KeyObject } from "crypto"

import * as Unzipper from "unzipper"

import { parseUserLog, parseLogLine } from "./parsers"
import type { LogLine } from "./types"
import { verifyMessage } from "./verifiers"

/**
 * Parse the lines out of a log file and verify them.
 *
 * This is the one-stop-shop solution for producing log lines and their
 * verification status from a period zip. The period should previously have
 * had its sequential consistency verified so that the appropriate final hash
 * of the previous period is known. The hash of the last message from this
 * generator can be used as the final hash for this period.
 *
 * @param {string} path: The path to the log period zip.
 * @param {KeyObject} key: The signing key that was preloaded.
 * @param {Buffer} finalHash: The hash of the last line of the period period.
 * @yields {LogLine} The line parsed from the file.
 * @returns {AsyncGenerator<LogLine>}
 * @generator
 */
export async function* parseLines(
  path: string,
  key: KeyObject,
  finalHash: Buffer,
): AsyncGenerator<LogLine> {
  const zip = await Unzipper.Open.file(path)
  const logPeriod = zip.files.find((d) => d.path === "log_period.json")
  if (logPeriod == null) {
    throw new Error("Failed to find log_period.json in log zip")
  }
  const periodBuffer = await logPeriod.buffer()
  const document = JSON.parse(periodBuffer.toString("utf-8"))
  let previousDetails = { hash: finalHash, id: -1 }
  let index = 0
  for (const message of parseUserLog(document)) {
    try {
      const messagePayload = parseLogLine(message)
      const { consistency, actualHash } = verifyMessage(message, key, previousDetails)
      previousDetails = { hash: actualHash, id: index }
      yield {
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
    index += 1
  }
}
