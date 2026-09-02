export interface SignedMessage {
  message: string
  messageHash: string
  messageSignature: string
  signatureVersion: string
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
export type RobotIdJson = SignedMessage
