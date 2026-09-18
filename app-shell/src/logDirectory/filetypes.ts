export interface SignedMessage {
  message: string
  message_hash: string
  message_sig: string
  sig_version: string | number
}

export interface LogPeriodJson {
  userLogEntries: SignedMessage[]
  startedAt: string
  endedAt: string
}
export interface RobotIdPayload {
  robot_name: string
  robot_serial: string
  public_hash: string
}

export interface RobotIdJson {
  message: string
  messageHash: string
  messageSignature: string
  signatureVersion: string | number
}

export interface LogMessage {
  action: string
  accountName: string
  legalName: string
  message: string
  reason: string
  loggedAt: string
}
