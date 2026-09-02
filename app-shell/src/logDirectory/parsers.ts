import type { SignedMessage, RobotIdPayload } from "./filetypes"
export function parseSignedMessage(document: any): SignedMessage {
  if (typeof document?.message !== "string") {
    throw new Error("Cannot parse signed message: message is not present")
  }
  if (typeof document?.messageHash !== "string") {
    throw new Error("Cannot parse signed message: hash is not present")
  }
  if (typeof document?.messageSignature !== "string") {
    throw new Error("Cannot parse signed message: signature is not present")
  }
  if (
    typeof document?.signatureVersion !== "string" &&
    typeof document?.signatureVersion != "number"
  ) {
    throw new Error("Cannot parse signed message: signature version is not present")
  }
  return {
    message: document.message,
    messageHash: document.messageHash,
    messageSignature: document.messageSignature,
    signatureVersion: document.signatureVersion,
  }
}

export function parseRobotId(document: any): RobotIdPayload {
  if (typeof document?.robot_name !== "string") {
    throw new Error("Cannot parse robot ID: robot name is not present or misformatted")
  }
  if (typeof document?.robot_serial !== "string") {
    throw new Error("Cannot parse robot ID: robot serial is not present or misformatted")
  }
  if (typeof document?.public_hash !== "string") {
    throw new Error("Cannot parse robot ID: public key hash is not present or misformatted")
  }
  return {
    robot_name: document.robot_name,
    robot_serial: document.robot_serial,
    public_hash: document.public_hash,
  }
}
