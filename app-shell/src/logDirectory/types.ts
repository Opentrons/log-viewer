import type { KeyObject } from "crypto"

import type { Dispatch } from "@log-verifier/app/src/redux/store"

import type { SignedMessage } from "./filetypes"

export type MessageConsistencyFailure =
  | { reason: "hash-mismatch"; actualHash: string }
  | { reason: "signature-mismatch" }
  | { reason: "bad-signature-version" }
  | { reason: "invalid-hash"; failure: string }
  | { reason: "bad-crypto-id"; failure: string }
  | { reason: "invalid-signature"; failure: string }

export interface State {
  [robotName: string]: {
    periods: LogPeriodFile[]
    blessedRobotId: BlessedRobotId | null
  }
}

export interface LogChecker {
  basePath: string
  state: State
  dispatch: (action: Parameters<Dispatch>[0]) => void
  scanDirectory: () => Promise<void>
  teardown: () => Promise<void>
  parseLines: (logPath: string) => Promise<LogLine[]>
}

export interface RobotIdParsed {
  robot_name: string
  robot_serial: string
  public_hash: string
}

export interface RobotId {
  parsed: RobotIdParsed
  raw: SignedMessage
  consistencyFailures: MessageConsistencyFailure[]
}

export interface LogPeriodFile {
  periodZip: string
  associatedProtocols: string[]
  softwareVersions: string[]
  associatedFiles: string[]
  robotId: RobotId
  publicKey: KeyObject
  startDate: string
  endDate: string
  logCount: number
  internalConsistency:
    | { status: "consistent" }
    | {
        status: "inconsistent"
        cause: "bad-robot-id"
      }
    | {
        status: "inconsistent"
        cause: "bad-log-line"
      }
  sequentialConsistency:
    | {
        status: "consistent"
        previousPeriodPath: string
      }
    | { status: "inconsistent"; datePreviousPeriodPath: string | null }
  identityConsistency:
    | {
        status: "consistent"
        validatedIdentityPath: string
      }
    | { status: "inconsistent"; validatedIdentityPath: string | null }
}

interface BlessedRobotId extends RobotId {
  filePath: string
}

export interface LogLine {
  envelope: SignedMessage
  payload: {
    action: string
    userName: string
    legalName: string
    message: string
    userNote: string
  }
  id: number
  consistencyFailures: MessageConsistencyFailure[]
}
