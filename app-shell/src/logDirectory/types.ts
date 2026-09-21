import type { KeyObject } from "crypto"

import type {
  InternalConsistency,
  AttestationConsistency,
  SequentialConsistency,
  BlessedRobotId as ReduxBlessedRobotId,
} from "@log-verifier/app/src/redux/logDirectory/types"
import type { Dispatch } from "@log-verifier/app/src/redux/store"

export type {
  InternalConsistency,
  AttestationConsistency,
  SequentialConsistency,
  AttestationConsistencyError,
  InternalConsistencyError,
} from "@log-verifier/app/src/redux/logDirectory/types"

import type { SignedMessage, RobotIdJson } from "./filetypes"

export interface State {
  [robotName: string]: {
    periods: LogPeriodFile[]
    blessedRobotIds: BlessedRobotId[]
  }
}

export interface LogChecker {
  basePath: string
  state: State
  dispatch: (action: Parameters<Dispatch>[0]) => void
  scanDirectory: () => Promise<void>
  teardown: () => Promise<void>
  parseLines: (logPath: string) => Promise<LogLine[]>
  blessRobotIdentity: (logPath: string) => Promise<ReduxBlessedRobotId>
  renotify: () => void
}

export interface RobotIdParsed {
  robot_name: string
  robot_serial: string
  public_hash: string
}

export interface RobotId {
  parsed: RobotIdParsed
  raw: RobotIdJson
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
  sequentialConsistency: SequentialConsistency<string>
  identityConsistency: AttestationConsistency
  trailingLogHash?: Buffer
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
  sequentialConsistency: SequentialConsistency<number>
}
