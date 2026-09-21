import { createLogger } from "../log"
import { scanBlessedRobotIdentities } from "./attestation"
import { checkSequentialConsistency } from "./checkSequentialConsistency"
import { addBlessedRobotId, addTrackedLogPeriod } from "./notify"
import { parsePeriod } from "./parsePeriod"
import type { State, LogChecker } from "./types"
import { walk } from "./walk"

const log = createLogger("logDirectory.scanDirectory")

export interface DirectoryScanner {
  scanIdentities: () => Promise<void>
  scanPeriods: () => Promise<void>
  check: () => Promise<void>
  scanDirectory: () => Promise<void>
}

/**
 * Build a scan directory object.
 *
 * @params {State} state: The shell staet.
 * @params {string} path: The base path.
 * @params {LogChecker["dispatch"]} The dispatch function
 * @constructor {DirectoryScanner}
 * @returns {DirectoryScanner}
 */
export function buildScanDirectory(
  state: State,
  path: string,
  dispatch: LogChecker["dispatch"],
): DirectoryScanner {
  const scanIdentities = async () => {
    for await (const blessedId of scanBlessedRobotIdentities(path)) {
      addBlessedRobotId(dispatch, blessedId)
      if (state?.[blessedId.robot_name] == null) {
        state[blessedId.robot_name] = { periods: [], blessedRobotIds: [blessedId] }
      } else {
        state[blessedId.robot_name].blessedRobotIds.push(blessedId)
      }
    }
  }
  const scanPeriods = async () => {
    const parses: Promise<void>[] = []
    const allBlessedIds = Object.values(state).flatMap((value) => value.blessedRobotIds)

    for await (const entry of walk(path)) {
      parses.push(
        parsePeriod(entry, allBlessedIds)
          .then((maybeFile) => {
            if (maybeFile == null) {
              return
            }
            if (state?.[maybeFile.robotId.parsed.robot_name] == null) {
              state[maybeFile.robotId.parsed.robot_name] = {
                periods: [maybeFile],
                blessedRobotIds: [],
              }
            } else {
              state[maybeFile.robotId.parsed.robot_name].periods.push(maybeFile)
            }
            addTrackedLogPeriod(dispatch, maybeFile)
          })
          .catch((err) => {
            log.info(`Could not parse ${entry.name}: ${JSON.stringify(err)}`)
          }),
      )
    }
    await Promise.allSettled(parses)
  }
  const check = async (): Promise<void> => {
    await Promise.allSettled(
      Object.entries(state).map(async ([robotName, robotEntries]) => {
        for await (const checkedPeriod of checkSequentialConsistency(robotEntries.periods)) {
          const periodIdx = state[robotName].periods.findIndex(
            (period) => period.periodZip === checkedPeriod.periodZip,
          )
          state[robotName].periods[periodIdx] = checkedPeriod
          dispatch({
            type: "logDirectory/updateTrackedLogPeriod",
            payload: {
              filePath: checkedPeriod.periodZip,
              period: {
                sequentialConsistency: checkedPeriod.sequentialConsistency,
              },
            },
          })
        }
      }),
    )
  }

  return {
    scanPeriods,
    check,
    scanIdentities,
    scanDirectory: () => {
      dispatch({ type: "logDirectory/directoryScanStart" })
      return scanIdentities()
        .then(scanPeriods)
        .then(check)
        .finally(() => dispatch({ type: "logDirectory/directoryScanDone" }))
    },
  }
}
