import * as Unzipper from "unzipper"

import { parseUserLog, parseLogLine } from "./parsers"
import type { LogLine } from "./types"

export async function parseLines(path: string): Promise<LogLine[]> {
  const zip = await Unzipper.Open.file(path)
  const logPeriod = zip.files.find((d) => d.path === "log_period.json")
  if (logPeriod == null) {
    throw new Error("Failed to find log_period.json in log zip")
  }
  const periodBuffer = await logPeriod.buffer()
  const document = JSON.parse(periodBuffer.toString("utf-8"))
  return [
    // oxlint-disable-next-line no-useless-spread this reifies an iterator to an array
    ...parseUserLog(document).map((message, index) => {
      try {
        const messagePayload = parseLogLine(message)
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
        }
      } catch (err: any) {
        throw new Error(`Error parsing log line ${index}: ${err.message}`)
      }
    }),
  ]
}
