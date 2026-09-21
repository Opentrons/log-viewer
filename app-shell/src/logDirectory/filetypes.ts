/**
 * An envelope containing a log message.
 */
export interface SignedMessage {
  message: string
  message_hash: string
  message_sig: string
  sig_version: string | number
}

/**
 * The log period JSON file contained in a log zip.
 */
export interface LogPeriodJson {
  userLogEntries: SignedMessage[]
  startedAt: string
  endedAt: string
}

/**
 * The payload of a robot ID (serialized inside the message field of the envelope.)
 */
export interface RobotIdPayload {
  robot_name: string
  robot_serial: string
  public_hash: string
}

/**
 * An envelope containing a robot ID.
 */
export interface RobotIdJson {
  message: string
  messageHash: string
  messageSignature: string
  signatureVersion: string | number
}

/**
 * The payload of al og message (serialized inside the message field of the envelope.)
 */
export interface LogMessage {
  action: string
  accountName: string
  legalName: string
  message: string
  reason: string
  loggedAt: string
}
