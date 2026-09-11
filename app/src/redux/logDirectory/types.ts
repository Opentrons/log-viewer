export type ConsistencyStatus = "unverified" | "consistent" | "inconsistent"

export interface RobotId {
  name: string
  publicKeyHash: string
  serial: string
  internalConsistency: ConsistencyStatus
}
export interface LogPeriod {
  scanStatus: "done" | "not-started" | "ongoing"
  internalConsistency: ConsistencyStatus
  attestationConsistency: ConsistencyStatus
  endDate: string
  startDate: string
  associatedFiles: string[]
  protocolNames: string[]
  softwareVersions: string[]
  logCount: number
  robotId: RobotId
}

export interface LogLine {
  envelope: {
    message: string
    messageHash: string
    messageSignature: string
    signatureVersion: string
  }
  payload: {
    loggedAt: string
    action: string
    userName: string
    legalName: string
    message: string
    userNote: string
  }
  id: number
}

export interface LogDirectoryState {
  directoryPath: string | null
  scanStatus: "done" | "not-started" | "ongoing"
  selectedLogPeriod: { fileName: string; robotName: string } | null
  contentsByRobot: {
    [robotName: string]: {
      blessedIdentityFiles: { filePath: string; robotId: RobotId }[]
      periods: {
        [filePath: string]: LogPeriod
      }
    }
  }
  logLines:
    | {
        status: "loaded"
        lines: LogLine[]
        filteredLines: LogLine[]
        selected: number | null
      }
    | {
        status: "loading"
      }
    | {
        status: "error"
        error: string
      }
    | {
        status: "empty"
      }
}
