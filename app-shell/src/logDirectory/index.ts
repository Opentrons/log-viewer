import { blessRobotIdentity } from "./attestation"
import { renotify } from "./notify"
import { parseLines } from "./parseLines"
import { buildScanDirectory } from "./scanDirectory"
import { findPeriod } from "./stateHelpers"
import type { State, LogChecker, LogPeriodFile } from "./types"

export async function refresh(
  dispatch: LogChecker["dispatch"],
  basePath: string,
  checker: LogChecker,
): Promise<LogChecker> {
  await checker.teardown()
  return initialize(dispatch, basePath)
}

export function initialize(dispatch: LogChecker["dispatch"], basePath: string): LogChecker {
  const state: State = {}

  return {
    basePath,
    state,
    dispatch,
    scanDirectory: buildScanDirectory(state, basePath, dispatch).scanDirectory,
    renotify: () => {
      renotify(state, dispatch)
    },
    teardown: () => Promise.resolve(),
    blessRobotIdentity: async (zipPath) => {
      try {
        const blessedIdentity = await blessRobotIdentity(findPeriod(state, zipPath), basePath)
        return {
          name: blessedIdentity.robot_name,
          publicKeyHash: blessedIdentity.public_hash,
          serial: blessedIdentity.robot_serial,
          filePath: blessedIdentity.filePath,
        }
      } catch (err: any) {
        return Promise.reject(err)
      }
    },
    parseLines: (logPath: string) => {
      const getPreviousHash = (previousLogPath?: string | null): Buffer => {
        try {
          return previousLogPath == null
            ? Buffer.from("")
            : (findPeriod(state, previousLogPath).trailingLogHash ?? Buffer.from(""))
          // oxlint-disable-next-line no-unused-vars this is an ok thing to happen
        } catch (_err: any) {
          return Buffer.from("")
        }
      }
      const getHashOfPreviousPeriod = (logPeriod: LogPeriodFile): Buffer => {
        if (logPeriod.sequentialConsistency.status !== "consistent") {
          return Buffer.from("")
        } else {
          return getPreviousHash(logPeriod.sequentialConsistency.previousId)
        }
      }
      try {
        const foundPeriod = findPeriod(state, logPath)
        return Array.fromAsync(
          parseLines(logPath, foundPeriod.publicKey, getHashOfPreviousPeriod(foundPeriod)),
        )
      } catch (err: any) {
        return Promise.reject(err)
      }
    },
  }
}
