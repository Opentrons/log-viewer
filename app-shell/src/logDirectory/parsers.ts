import path from "path"

import type {
  SignedMessage,
  RobotIdPayload,
  LogMessage,
  LogPeriodJson,
  RobotIdJson,
} from "./filetypes"

/**
 * parseSignedMessage: Check that a message envelope has correct structure.
 *
 * Checks the envelope structure only, nothing cryptograhic.
 *
 * @param {any} document: A JSON.parse() result that should be a signed message.
 * @return {SignedMessage} The message envelope, known to be the correct structure and ready for verification.
 * @throws {Error} If the structure fails. e.message contains a description.
 */
export function parseSignedMessage(document: any): SignedMessage {
  if (typeof document?.message !== "string") {
    throw new Error(
      `Cannot parse signed message: message is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.message_hash !== "string") {
    throw new Error(
      `Cannot parse signed message: hash is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.message_sig !== "string") {
    throw new Error(
      `Cannot parse signed message: signature is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.sig_version !== "string" && typeof document?.sig_version != "number") {
    throw new Error(
      `Cannot parse signed message: signature version is not present in log line ${JSON.stringify(document)}`,
    )
  }
  return {
    message: document.message,
    message_hash: document.message_hash,
    message_sig: document.message_sig,
    sig_version: document.sig_version,
  }
}

/**
 * parseSignedRobotId: Check that a robot ID envelope has correct structure.
 *
 * Checks the envelope structure only, nothing cryptographic.
 *
 * @param {any} document: A JSON.parse() result that should be a signed robot ID.
 * @return {RobotIdJson} The ID envelope, known to be the correct structure and ready for verification.
 * @throws {Error} If the structure fails. e.message contains a description.
 */
export function parseSignedRobotId(document: any): RobotIdJson {
  if (typeof document?.message !== "string") {
    throw new Error(
      `Cannot parse signed message: message is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.messageHash !== "string") {
    throw new Error(
      `Cannot parse signed message: hash is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.messageSignature !== "string") {
    throw new Error(
      `Cannot parse signed message: signature is not present in log line ${JSON.stringify(document)}`,
    )
  }
  if (
    typeof document?.signatureVersion !== "string" &&
    typeof document?.signatureVersion != "number"
  ) {
    throw new Error(
      `Cannot parse signed message: signature version is not present in log line ${JSON.stringify(document)}`,
    )
  }
  return {
    message: document.message,
    messageHash: document.messageHash,
    messageSignature: document.messageSignature,
    signatureVersion: document.signatureVersion,
  }
}

/**
 * parseRobotId: Check that a robot ID document is correct.
 *
 * This takes a message, probably parsed from a robot ID envelope, to the
 * checked structure of a robot ID.
 *
 * @param {any} document: The result of a JSON.parse that should contain a robot ID.
 * @returns {RobotIdPayload} A robot ID known to be in the correct structure.
 * @throws {Error} If the structure is incorrect.
 */
export function parseRobotId(document: any): RobotIdPayload {
  if (typeof document?.robot_name !== "string") {
    throw new Error(
      `Cannot parse robot ID: robot name is not present or misformatted in robot ID ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.robot_serial !== "string") {
    throw new Error(
      `Cannot parse robot ID: robot serial is not present or misformatted in robot ID ${JSON.stringify(document)}`,
    )
  }
  if (typeof document?.public_hash !== "string") {
    throw new Error(
      `Cannot parse robot ID: public key hash is not present or misformatted in robot ID ${JSON.stringify(document)}`,
    )
  }
  return {
    robot_name: document.robot_name,
    robot_serial: document.robot_serial,
    public_hash: document.public_hash,
  }
}

/**
 * parseLogOverview: Parse key data from a set of log lines.
 *
 * There are a couple magic logs that establish data that the log viewer displays;
 * this function grabs them. Note that each result is an array; there could be
 * multiple, whether because the robot booted multiple times and did an update, or
 * because something went wrong in the log.
 *
 * @param {SignedMessage[]} logLines: The logs from a log period.
 * @returns {{softwareVersions: string[], associatedProtocols: string[]}}
 */
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

/**
 * parseLogPeriodFile: Check the structure of a log period file.
 *
 * Note that this only checks file structure; it does not do cryptographic
 * verification.
 *
 * @param {any} document: A result of JSON.parse that should be a log period.
 * @returns {LogPeriodJson}: The parsed file, now known to be the correct structure.
 * @throws {Error} If the parse fails. e.message has some details.
 */
export function parseLogPeriodFile(document: any): LogPeriodJson {
  if (typeof document?.startedAt !== "string") {
    throw new Error("Cannot parse log start date: startedAt is not present or misformatted")
  }
  if (typeof document?.endedAt !== "string" && document?.endedAt !== null) {
    throw new Error("Cannot parse log end date: endedAt is not present or misformatted")
  }
  if (!Array.isArray(document?.userLogEntries)) {
    throw new Error("Cannot parse log entries: userLogEntries is not present or misformatted")
  }
  return {
    startedAt: document.startedAt,
    endedAt: document.endedAt,
    userLogEntries: document.userLogEntries.map((line: any, index: number) => {
      try {
        return parseSignedMessage(line)
      } catch (err: any) {
        throw new Error(`Error in parsing line ${index}: ${err.message}`)
      }
    }),
  }
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

/**
 * parseUserLog is a generator producing structure-verified log lines.
 *
 * @param {any} document: The log period file to check.
 * @yields {SignedMessage}: Each line as it's parsed. This will have the correct structure but not be cryptographically verified.
 * @returns {Generator<SignedMessage>}: The generator to yield through.
 * @generator
 */
export function* parseUserLog(document: any): Generator<SignedMessage> {
  if (typeof document !== "object") {
    throw new Error("Incorrect shape of JSON document")
  }
  const lines = document?.userLogEntries
  if (!Array.isArray(lines)) {
    throw new Error("Incorrect shape of user log entries")
  }
  let index = 0
  for (const line of lines) {
    yield parseSignedMessage(line)
    index++
  }
}

const parseOrStringify = <T>(val: any, pred: (val: any) => val is T): T | string =>
  pred(val) ? val : JSON.stringify(val)

/**
 * parseLogLine parses an envelope into a structured log.
 *
 * It does not do cryptographic verification.
 *
 * @param {SignedMessage} inputMessage: The message to check.
 * @returns {LogMessage}: The parsed message object.
 */
export function parseLogLine(inputMessage: SignedMessage): LogMessage {
  const parsedMessage = JSON.parse(inputMessage.message)
  if (typeof parsedMessage !== "object") {
    throw new Error(
      `Incorrect type of log message: ${typeof parsedMessage} (${JSON.stringify(parsedMessage)} from ${JSON.stringify(inputMessage)})`,
    )
  }
  const { action, accountName, legalName, message, reason, loggedAt } = parsedMessage
  return {
    action: parseOrStringify(action, (maybeAction) => typeof maybeAction === "string"),
    accountName: parseOrStringify(
      accountName,
      (maybeAccountName) => typeof maybeAccountName === "string",
    ),
    legalName: parseOrStringify(legalName, (maybeLegalName) => typeof maybeLegalName === "string"),
    message: parseOrStringify(message, (maybeMessage) => typeof maybeMessage === "string"),
    reason: parseOrStringify(reason, (maybeReason) => typeof maybeReason === "string"),
    loggedAt: parseOrStringify(loggedAt, (maybeLoggedAt) => typeof maybeLoggedAt === "string"),
  }
}

/**
 * parseCryptoIdentifier parses the strings the robot uses to identify base64 blobs.
 *
 * For hashes and signatures, the robot emits strings like `${identifier}:${payload}`.
 * This is a utility that splits them.
 *
 * @param {string} line: The identifier.
 * @returns {[string, string]} [identifier, payload]
 */
export function parseCryptoIdentifier(line: string): [string, string] {
  const parts = line.split(":")
  if (parts.length < 2) {
    throw new Error(
      `Incorrect formatting of crypto specification: must be with cryptoName:value but is ${line}`,
    )
  }
  return [parts[0], parts.slice(1).join(":")]
}
