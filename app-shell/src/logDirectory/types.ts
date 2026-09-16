import type { KeyObject } from "crypto"

import type {
  InternalConsistency,
  AttestationConsistency,
  SequentialConsistency,
} from "@log-verifier/app/src/redux/logDirectory/types"
import type { Dispatch } from "@log-verifier/app/src/redux/store"

export type {
  InternalConsistency,
  AttestationConsistency,
  SequentialConsistency,
  AttestationConsistencyError,
  InternalConsistencyError,
} from "@log-verifier/app/src/redux/logDirectory/types"

import type { SignedMessage } from "./filetypes"

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
  internalConsistency: InternalConsistency
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
  internalConsistency: InternalConsistency
  sequentialConsistency: SequentialConsistency
  identityConsistency: AttestationConsistency
}

export interface BlessedRobotId extends RobotIdParsed {
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
    loggedAt: string
  }
  id: number
  internalConsistency: InternalConsistency
}
