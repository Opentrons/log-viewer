export type InternalConsistencyError =
  | { type: "hash-mismatch"; contentHash: string }
  | { type: "signature-mismatch" }
  | { type: "unknown-signature-version" }
export type AttestationConsistencyError =
  | {
      type: "mismatch"
    }
  | { type: "no-target" }

export type Consistency<TErrors, TValid = void> =
  | { status: "unverified" }
  | ({ status: "consistent" } & TValid)
  | ({ status: "inconsistent" } & TErrors)

export interface RobotId {
  name: string
  publicKeyHash: string
  serial: string
  internalConsistency: Consistency<{ errors: InternalConsistencyError[] }>
}
export interface LogPeriod {
  scanStatus: "done" | "not-started" | "ongoing"
  internalConsistency: Consistency<{ failingLines: number[] }>
  attestationConsistency: Consistency<
    { errors: AttestationConsistencyError[] },
    { attestedIdentityPath: string }
  >
  sequentialConsistency: Consistency<
    { errors: InternalConsistencyError[] },
    { previousPeriod: string }
  >
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
  consistency: Consistency<{ errors: InternalConsistencyError[] }>
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
