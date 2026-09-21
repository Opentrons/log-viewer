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

/**
 * The state of the shell.
 */
export interface State {
  [robotName: string]: {
    periods: LogPeriodFile[]
    blessedRobotIds: BlessedRobotId[]
  }
}

/**
 * A checker object used to handle a working directory.
 */
export interface LogChecker {
  // The base path of the log directory
  basePath: string
  // The shell state
  state: State
  // A dispatch function that will send the argument to redux
  dispatch: (action: Parameters<Dispatch>[0]) => void
  // Scan the working directory and dispatch updates to the app
  scanDirectory: () => Promise<void>
  // Teardown the object so it can be replaced
  teardown: () => Promise<void>
  // Get the actual log lines of a log file into memory
  parseLines: (logPath: string) => Promise<LogLine[]>
  // Identify a robot as attestable
  blessRobotIdentity: (logPath: string) => Promise<ReduxBlessedRobotId>
  // As scan directory but just informing the app of the current state
  renotify: () => void
}

/**
 * A parsed robot ID.
 */
export interface RobotIdParsed {
  robot_name: string
  robot_serial: string
  public_hash: string
}

/**
 * A robot ID with its envelope, parsed value, and consistency.
 */
export interface RobotId {
  parsed: RobotIdParsed
  raw: RobotIdJson
  internalConsistency: InternalConsistency
}

/**
 * A log period file that has been parsed and verified.
 */
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

/**
 * A robot ID identified for attestation.
 */
export interface BlessedRobotId extends RobotIdParsed {
  filePath: string
}

/**
 * A single line from the log.
 */
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
