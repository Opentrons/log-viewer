import { parseLines } from "./parseLines"
import { buildScanDirectory } from "./scanDirectory"
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
    teardown: () => Promise.resolve(),
    parseLines: (logPath: string) => {
      const findPeriod = (logToFind: string): LogPeriodFile => {
        const foundRobot = Object.entries(state).find(
          ([_, entry]) => entry.periods.find((file) => file.periodZip === logToFind) != null,
        )
        if (foundRobot == null) {
          throw new Error(`Could not find robot containing log ${logToFind}`)
        }
        const [robotName, robotEntry] = foundRobot
        const foundPeriod = robotEntry.periods.find((file) => file.periodZip === logToFind)
        if (foundPeriod == null) {
          throw new Error(`Could not find log ${logToFind} in robot ${robotName}`)
        }
        return foundPeriod
      }
      const getPreviousHash = (previousLogPath?: string | null): Buffer => {
        try {
          return previousLogPath == null
            ? Buffer.from("")
            : (findPeriod(previousLogPath).trailingLogHash ?? Buffer.from(""))
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
        const foundPeriod = findPeriod(logPath)
        return Array.fromAsync(
          parseLines(logPath, foundPeriod.publicKey, getHashOfPreviousPeriod(foundPeriod)),
        )
      } catch (err: any) {
        return Promise.reject(err)
      }
    },
  }
}
