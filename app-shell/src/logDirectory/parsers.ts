import path from "path"

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

export function parseLogOverview(logLines: SignedMessage[]): {
  softwareVersions: string[]
  associatedProtocols: string[]
} {
  const softwareVersions: string[] = []
  const associatedProtocols: string[] = []
  for (const record of logParseGenerator(logLines)) {
    if (record.type === "software-version") {
      softwareVersions.push(record.value)
    } else if (record.type === "runlog") {
      associatedProtocols.push(record.value)
    }
  }
  return { softwareVersions, associatedProtocols }
}

function* logParseGenerator(
  logLines: SignedMessage[],
): Generator<{ type: "software-version"; value: string } | { type: "runlog"; value: string }> {
  for (const logLine of logLines) {
    const parsedLog = JSON.parse(logLine.message)
    if (parsedLog.action === "robot-version") {
      const pythonVersion = parsedLog.message
      // python versions are not quite semver, so turn them into quite semver
      const matches = pythonVersion.match(
        /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)((?<prereleaseTag>.)(?<prereleaseSerial>\d+))?$/,
      )
      if (matches != null) {
        const release = `${matches.groups.major}.${matches.groups.minor}.${matches.groups.patch}`
        const prerelLookup = { a: "alpha", b: "beta" }
        const preRel =
          typeof matches?.groups?.prereleaseTag === "string"
            ? // @ts-expect-error we just checked this
              `-${prerelLookup?.[matches.groups.prereleaseTag] ?? "unknown"}.${matches.groups.prereleaseSerial}`
            : ""
        yield { type: "software-version", value: `${release}${preRel}` }
      } else {
        yield { type: "software-version", value: pythonVersion }
      }
    } else if (parsedLog.action == "store-runlog") {
      const runlogName = JSON.parse(parsedLog.message).filePath
      // runlog filepaths look like whatever_2026-09-04T17_52_32.663Z.json
      // (it's just the name of the file since it's always in the current directory)
      // and that first bit before the datestamp is the protocol name.
      const matches = runlogName.match(
        /^(?<protocolName>.*)_\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}.\d+Z\.json$/,
      )
      if (matches != null) {
        yield { type: "runlog", value: matches.groups.protocolName }
      } else {
        yield { type: "runlog", value: path.basename(runlogName, ".json") }
      }
    }
  }
}
