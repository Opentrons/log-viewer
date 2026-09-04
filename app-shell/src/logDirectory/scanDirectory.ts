import { createLogger } from "../log"
import { parsePeriod } from "./parsePeriod"
import type { State, LogChecker } from "./types"
import { walk } from "./walk"

const log = createLogger("logDirectory.scanDirectory")

export function buildScanDirectory(
  state: State,
  path: string,
  dispatch: LogChecker["dispatch"],
): () => Promise<void> {
  const scan = async () => {
    const parses: Promise<void>[] = []
    dispatch({ type: "logDirectory/directoryScanStart" })
    for await (const entry of walk(path)) {
      parses.push(
        parsePeriod(entry)
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
                  internalConsistency: "unverified",
                  attestationConsistency: "unverified",
                  endDate: maybeFile.endDate,
                  startDate: maybeFile.startDate,
                  associatedFiles: maybeFile.associatedFiles,
                  protocolNames: maybeFile.associatedProtocols,
                  softwareVersions: maybeFile.softwareVersions,
                  robotId: {
                    name: maybeFile.robotId.parsed.robot_name,
                    serial: maybeFile.robotId.parsed.robot_serial,
                    publicKeyHash: maybeFile.robotId.parsed.public_hash,
                    internalConsistency: "unverified",
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
  return () => scan().finally(() => dispatch({ type: "logDirectory/directoryScanDone" }))
}
