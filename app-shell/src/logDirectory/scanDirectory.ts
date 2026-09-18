import { createLogger } from "../log"
import { checkSequentialConsistency } from "./checkSequentialConsistency"
import { parsePeriod } from "./parsePeriod"
import type { State, LogChecker } from "./types"
import { walk } from "./walk"

const log = createLogger("logDirectory.scanDirectory")

export function buildScanDirectory(
  state: State,
  path: string,
  dispatch: LogChecker["dispatch"],
): { scan: () => Promise<void>; check: () => Promise<void>; scanDirectory: () => Promise<void> } {
  const scan = async () => {
    const parses: Promise<void>[] = []

    for await (const entry of walk(path)) {
      parses.push(
        parsePeriod(entry, [])
          .then((maybeFile) => {
            if (maybeFile == null) {
              return
            }
            if (state?.[maybeFile.robotId.parsed.robot_name] == null) {
              state[maybeFile.robotId.parsed.robot_name] = {
                periods: [maybeFile],
                blessedRobotId: null,
              }
            } else {
              state[maybeFile.robotId.parsed.robot_name].periods.push(maybeFile)
            }
            dispatch({
              type: "logDirectory/addTrackedLogPeriod",
              payload: {
                filePath: maybeFile.periodZip,
                period: {
                  scanStatus: "not-started",
                  internalConsistency: maybeFile.internalConsistency,
                  attestationConsistency: maybeFile.identityConsistency,
                  sequentialConsistency: maybeFile.sequentialConsistency,
                  endDate: maybeFile.endDate,
                  startDate: maybeFile.startDate,
                  associatedFiles: maybeFile.associatedFiles,
                  protocolNames: maybeFile.associatedProtocols,
                  softwareVersions: maybeFile.softwareVersions,
                  robotId: {
                    name: maybeFile.robotId.parsed.robot_name,
                    serial: maybeFile.robotId.parsed.robot_serial,
                    publicKeyHash: maybeFile.robotId.parsed.public_hash,
                    internalConsistency: maybeFile.robotId.internalConsistency,
                  },
                  logCount: maybeFile.logCount,
                },
              },
            })
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
      Object.values(state).map(async (robotEntries) => {
        for await (const checkedPeriod of checkSequentialConsistency(robotEntries.periods)) {
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
    scan,
    check,
    scanDirectory: () => {
      dispatch({ type: "logDirectory/directoryScanStart" })
      return scan()
        .then(() => check())
        .finally(() => dispatch({ type: "logDirectory/directoryScanDone" }))
    },
  }
}
