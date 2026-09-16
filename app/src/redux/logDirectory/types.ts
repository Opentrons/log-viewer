export type InternalConsistencyError =
  | { type: "hash-mismatch"; contentHash: string }
  | { type: "signature-mismatch"; failure: string }
  | { type: "unknown-signature-version"; failure: string }
  | { type: "invalid-hash"; failure: string }
  | { type: "bad-crypto-id"; failure: string }
  | { type: "invalid-signature"; failure: string }
export type AttestationConsistencyError =
  | {
      type: "mismatch"
    }
  | { type: "no-target" }
  | { type: "internally-inconsistent" }

export type Consistency<TErrors, TValid = {}> =
  | { status: "unverified" }
  | ({ status: "consistent" } & TValid)
  | ({ status: "inconsistent" } & TErrors)

export type InternalConsistency = Consistency<InternalConsistencyError>
export type AttestationConsistency = Consistency<
  AttestationConsistencyError,
  { attestedIdentityPath: string }
>
export type SequentialConsistency = Consistency<
  InternalConsistencyError,
  { previousPeriod: string }
>

export interface RobotId {
  name: string
  publicKeyHash: string
  serial: string
  internalConsistency: InternalConsistency
}
export interface LogPeriod {
  scanStatus: "done" | "not-started" | "ongoing"
  internalConsistency: InternalConsistency
  attestationConsistency: AttestationConsistency
  sequentialConsistency: SequentialConsistency
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
  internalConsistency: InternalConsistency
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
