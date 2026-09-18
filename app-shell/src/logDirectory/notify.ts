import type { State, LogChecker, LogPeriodFile, BlessedRobotId } from "./types"
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
