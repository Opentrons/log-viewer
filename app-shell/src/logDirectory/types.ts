import type { KeyObject } from "crypto"

import type { Dispatch } from "@log-verifier/app/src/redux/store"

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
}

export interface RobotIdParsed {
  robot_name: string
  robot_serial: string
  public_hash: string
  status: "consistent" | "inconsistent" | "unverified"
}

export interface RobotId {
  parsed: RobotIdParsed
  raw: SignedMessage
}

export interface LogPeriodFile {
  periodZip: string
  associatedFiles: string[]
  robotId: RobotId
  publicKey: KeyObject
  startDate: string
  endDate: string
}

interface BlessedRobotId extends RobotId {
  filePath: string
}
