import { parseLines } from "./parseLines"
import { buildScanDirectory } from "./scanDirectory"
import type { State, LogChecker } from "./types"

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
    scanDirectory: buildScanDirectory(state, basePath, dispatch),
    teardown: () => Promise.resolve(),
    parseLines: (logPath: string) => {
      const foundRobot = Object.entries(state).find(
        ([_, entry]) => entry.periods.find((file) => file.periodZip === logPath) != null,
      )
      if (foundRobot == null) {
        return Promise.reject(new Error(`Could not find robot containing log ${logPath}`))
      }
      const [robotName, robotEntry] = foundRobot
      const foundPeriod = robotEntry.periods.find((file) => file.periodZip === logPath)
      if (foundPeriod == null) {
        return Promise.reject(new Error(`Could not find log ${logPath} in robot ${robotName}`))
      }

      return parseLines(logPath, foundPeriod.publicKey, Buffer.from(""))
    },
  }
}
