import { createLogger } from "../log"
import { scanBlessedRobotIdentities } from "./attestation"
import { checkSequentialConsistency } from "./checkSequentialConsistency"
import { parsePeriod } from "./parsePeriod"
import type { State, LogChecker } from "./types"
import { walk } from "./walk"

const log = createLogger("logDirectory.scanDirectory")

export function buildScanDirectory(
  state: State,
  path: string,
  dispatch: LogChecker["dispatch"],
): {
  scanIdentities: () => Promise<void>
  scanPeriods: () => Promise<void>
  check: () => Promise<void>
  scanDirectory: () => Promise<void>
} {
  const scanIdentities = async () => {
    for await (const blessedId of scanBlessedRobotIdentities(path)) {
      dispatch({
        type: "logDirectory/addBlessedRobotId",
        payload: {
          robotId: {
            name: blessedId.robot_name,
            serial: blessedId.robot_serial,
            publicKeyHash: blessedId.public_hash,
            filePath: blessedId.filePath,
          },
        },
      })
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
