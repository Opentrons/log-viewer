import type { State, LogChecker, LogPeriodFile, BlessedRobotId } from "./types"

/**
 * Send a notification to the app that a new period is known.
 *
 * @param {LogChecker["dispatch"]} dispatch: The dispatch function.
 * @param {LogPeriodFile} file: The file to notify about.
 */
export function addTrackedLogPeriod(dispatch: LogChecker["dispatch"], file: LogPeriodFile): void {
  dispatch({
    type: "logDirectory/addTrackedLogPeriod",
    payload: {
      filePath: file.periodZip,
      period: {
        scanStatus: "not-started",
        internalConsistency: file.internalConsistency,
        attestationConsistency: file.identityConsistency,
        sequentialConsistency: file.sequentialConsistency,
        endDate: file.endDate,
        startDate: file.startDate,
        associatedFiles: file.associatedFiles,
        protocolNames: file.associatedProtocols,
        softwareVersions: file.softwareVersions,
        robotId: {
          name: file.robotId.parsed.robot_name,
          serial: file.robotId.parsed.robot_serial,
          publicKeyHash: file.robotId.parsed.public_hash,
          internalConsistency: file.robotId.internalConsistency,
        },
        logCount: file.logCount,
      },
    },
  })
}

/**
 * Send a notification to the app that a new blessed robot ID was found.
 *
 * @param {LogChecker["dispatch"]} dispatch: The dispatch function.
 * @param {BlessedRobotId} blessedId: The ID that was found.
 */
export function addBlessedRobotId(
  dispatch: LogChecker["dispatch"],
  blessedId: BlessedRobotId,
): void {
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
}

/**
 * Send notifications to the app for everything in state, as if a directory
 * scan was happening.
 *
 * This is really important for performance in dev; the frontend reloading
 * because of hot-module reload otherwise would dispatch quite a few
 * redundant scans.
 *
 * @param {State} state: The shell state.
 * @param {LogChecker["dispatch"]} dispatch: The dispatch function.
 */
export function renotify(state: State, dispatch: LogChecker["dispatch"]): void {
  Object.values(state).forEach(({ periods, blessedRobotIds }) => {
    blessedRobotIds.forEach((robotId) => {
      addBlessedRobotId(dispatch, robotId)
    })
    periods.forEach((period) => {
      addTrackedLogPeriod(dispatch, period)
    })
  })
}

/**
 * Send a change in identity consistency to the app.
 *
 * Picks just the identity consistency from the period and sends it.
 *
 * @param {LogPeriodFile} logPeriod The log period to send
 * @param {LogChecker["dispatch"]} dispatch The dispatch function.
 */
export function updateLogPeriodIdentity(
  logPeriod: LogPeriodFile,
  dispatch: LogChecker["dispatch"],
): void {
  dispatch({
    type: "logDirectory/updateTrackedLogPeriod",
    payload: {
      filePath: logPeriod.periodZip,
      period: {
        attestationConsistency: logPeriod.identityConsistency,
      },
    },
  })
}
