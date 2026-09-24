/**
 * verifiers.ts: cryptographic verification for messages.
 *
 * For structural verification, see parsers.ts.
 */
import type { KeyObject } from "crypto"
import { hash, verify } from "crypto"

import omit from "lodash/omit"

import type { SignedMessage, RobotIdJson } from "./filetypes"
import { parseCryptoIdentifier } from "./parsers"
import type {
  SequentialConsistency,
  InternalConsistency,
  AttestationConsistency,
  BlessedRobotId,
  RobotId,
} from "./types"

/**
 * Verify the internal consistency of a robot id.
 *
 * This function checks that the envelope is OK: the hash matches the
 * content and the signature matches the hash. This is different from
 * verifyMessage because the python implementation of general log message
 * export and robot ID export use different structures for their envelopes
 * (snake_case vs camelCase).
 *
 * @param {RobotIdJson} message: A raw serialized JSON document with a robot id
 * @param {KeyObject} key: the public key that should correspodn to the hash
 * in the robot id.
 * @return {InternalConsistency} The results of the check.
 */
export function verifyRobotIdInternalConsistency(
  message: RobotIdJson,
  key: KeyObject,
): InternalConsistency {
  return verifyMessage(
    {
      message: message.message,
      message_hash: message.messageHash,
      message_sig: message.messageSignature,
      sig_version: message.signatureVersion,
    },
    key,
  ).consistency
}

/**
 * Verify a message for internal or sequential consistency.
 *
 * This function checks an envelope for either internal (hash matches message
 * content, signature matches hash) or sequential (hash matches message content,
 * signature matches hash + previous hash) consistency depending on its overload
 * set. For convenience it returns the hash of the message in addition to the
 * consistency, so that calls for sequential consistency can be chained (i.e.
 * {consistency1, actualHash1} = verifyMessage(message1, key, {hash: actualHash0, id: 0}));
 * {consistency2, actualHash2} = verifyMessage(message2, key, {hash: actualHash1, id: 1});
 *
 * @param {SignedMessage} message: The message (envelope) to verify
 * @param {KeyObject} key: The loaded key that should have signed the message
 * @param {{hash: Buffer; id: number} | null} previousDetails: The details of the
 * previous message. If provided, check sequential consistency with the previous
 * message; if not, check internal consistency only.
 * @return {consistency: SequentialConsistency<number> | InternalConsistency; actualHash: buffer} The results of the check.
 */
export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
  previousDetails: { hash: Buffer; id: number },
): { consistency: SequentialConsistency<number>; actualHash: Buffer }
export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
): { consistency: InternalConsistency; actualHash: Buffer }
export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
  previousDetails?: { hash: Buffer; id: number },
):
  | { consistency: InternalConsistency; actualHash: Buffer }
  | { consistency: SequentialConsistency<number>; actualHash: Buffer } {
  const hashDetails = checkCryptoId(message.message_hash, "sha256")
  const actualHash = hash(
    hashDetails.ok ? hashDetails.cryptoId : "sha256",
    message.message,
    "buffer",
  )
  if (!hashDetails.ok) {
    return {
      consistency: {
        status: "inconsistent",
        type: "invalid-hash",
        failure: hashDetails.failure,
      },
      actualHash,
    }
  }

  if (!actualHash.equals(hashDetails.content)) {
    return {
      consistency: {
        status: "inconsistent",
        type: "hash-mismatch",
        contentHash: actualHash.toString("base64url"),
      },
      actualHash,
    }
  }
  const sigDetails = checkCryptoId(message.message_sig, "ed25519")
  if (!sigDetails.ok) {
    return {
      consistency: {
        status: "inconsistent",
        type: "invalid-signature",
        failure: sigDetails.failure,
      },
      actualHash,
    }
  }
  if (message.sig_version !== 1 && message.sig_version !== "1") {
    return {
      consistency: {
        status: "inconsistent",
        type: "unknown-signature-version",
        failure: `Log Verifier cannot handle logs signed with signature version ${message.sig_version}`,
      },
      actualHash,
    }
  }
  const verifyResult = verify(
    null,
    previousDetails != null
      ? Buffer.concat([hashDetails.content, previousDetails.hash])
      : actualHash,
    key,
    sigDetails.content,
  )
  return verifyResult
    ? {
        consistency: {
          status: "consistent",
          ...(previousDetails != null ? { previousId: previousDetails.id } : {}),
        },
        actualHash,
      }
    : previousDetails == null
      ? {
          consistency: {
            status: "inconsistent",
            type: "signature-mismatch",
            failure: "The message was not properly signed by the associated key.",
          },
          actualHash,
        }
      : {
          consistency: {
            status: "inconsistent",
            type: "no-target",
          },
          actualHash,
        }
}

function checkCryptoId<CryptoId extends string>(
  line: string,
  id: CryptoId,
):
  | { ok: true; cryptoId: CryptoId; content: Buffer }
  | { ok: false; reason: "bad-crypto-id"; failure: string } {
  try {
    const [cryptoId, content] = parseCryptoIdentifier(line)
    if (cryptoId !== id) {
      return {
        ok: false,
        reason: "bad-crypto-id",
        failure: `Crypto id for ${line} must be ${id} but is ${cryptoId}`,
      }
    }
    return { ok: true, cryptoId: id, content: Buffer.from(content, "base64url") }
  } catch (err: any) {
    return {
      ok: false,
      reason: "bad-crypto-id",
      failure: `Crypto id for ${line} could not be parsed: ${err.message}`,
    }
  }
}

/**
 * verifyPeriodIdentity: check the attestation consistency of a log period
 * as a whole.
 *
 * Attestation consistency is whether or not a log period's robot ID matches
 * one that has been previously blessed. Matching means that the name and
 * key hash are the same.
 *
 * Since logs are stored on user storage, it should be left to the user
 * explicitly to bless a robot ID for attestation.
 *
 * @param {RobotId} robotId: The robot ID from the period.
 * @param {KeyObject} key: The public key from the period
 * @param {BlessedRobotId[]} knownRobots: The robot IDs previous blessed by the user.
 * @return {{robotId: RobotId, identityConsistency: AttestationConsistency}} The results of the check.
 */
export function verifyPeriodIdentity(
  robotId: RobotId,
  key: KeyObject,
  knownRobots: BlessedRobotId[],
): {
  robotId: RobotId
  identityConsistency: AttestationConsistency
} {
  const idResult = verifyRobotIdInternalConsistency(robotId.raw, key)
  if (idResult.status === "consistent") {
    const matchingIdentity = knownRobots.find(
      (blessedId) =>
        blessedId.robot_name === robotId.parsed.robot_name &&
        blessedId.public_hash === robotId.parsed.public_hash,
    )
    if (matchingIdentity == null) {
      return {
        robotId: {
          ...robotId,
          internalConsistency: idResult,
        },
        identityConsistency: { status: "inconsistent", type: "no-target" },
      }
    } else {
      return {
        robotId: { ...robotId, internalConsistency: idResult },
        identityConsistency: {
          status: "consistent",
          attestedIdentityPath: matchingIdentity.filePath,
        },
      }
    }
  } else {
    return {
      robotId: { ...robotId, internalConsistency: idResult },
      identityConsistency: { status: "inconsistent", type: "internally-inconsistent" },
    }
  }
}

function verifyFirstMessage(
  message: SignedMessage,
  key: KeyObject,
  initialHash?: Buffer,
): { consistency: InternalConsistency; actualHash: Buffer } {
  const { consistency, actualHash } =
    initialHash == null
      ? verifyMessage(message, key)
      : verifyMessage(message, key, { hash: initialHash, id: -1 })
  if (initialHash != null) {
    return { consistency: omit(consistency, "previousId") as InternalConsistency, actualHash }
  } else {
    if (
      consistency.status === "inconsistent" &&
      consistency.type === "signature-mismatch" &&
      initialHash == null
    ) {
      return { consistency: { status: "unverified" } as const, actualHash }
    }
    return { consistency: omit(consistency, "previousId") as InternalConsistency, actualHash }
  }
}

/**
 * verifyMessages: Check the internal consistency of a string of messages.
 *
 * This is used for the first pass at verifying a log period. Before all log
 * periods have been checked, you can't check sequential consistency becauses log
 * periods have to be parsed to know how to order them. This function checks
 * the internal consistency of an entire log period in one go, rather than
 * message by message.
 *
 * The result here is the internal consistency of _the log period as a whole_,
 * not the internal consistency of a given message. For a log period to be
 * internally consistent,
 * - The key must match the robot ID (checked elsewhere)
 * - The log messages must be signed by the key, except the first
 * - If the first log message is consistent except that its signature cannot
 *   be verified, this does not break period internal consistency because
 *   it's likely due to not checking the previous period
 *
 * Because of this, the UI can't rely on the period internal consistency alone
 * to show that a message is good; instead, the period sequential consistency
 * should be used.
 *
 * @param {SignedMessage[]} messages: The log messages from a log period.
 * @param {KeyObject} key: The key from a log period.
 * @param {Buffer?} initialHash: The initial hash to append to the first message.
 * @return {Promise<{consistency: InternalConsistency; finalHash?: Buffer}>} The results of the check.
 */
export async function verifyMessages(
  messages: SignedMessage[],
  key: KeyObject,
  initialHash?: Buffer,
): Promise<{ consistency: InternalConsistency; finalHash?: Buffer }> {
  let consistency: InternalConsistency | SequentialConsistency<number> = { status: "unverified" }

  if (messages.length === 0) {
    return { consistency, finalHash: undefined }
  }
  const { consistency: firstConsistency, actualHash: firstHash } = verifyFirstMessage(
    messages[0],
    key,
    initialHash,
  )
  if (messages.length === 1) {
    return { consistency: firstConsistency, finalHash: firstHash }
  }
  let previousHash = firstHash
  let previousIndex = 0
  consistency = firstConsistency
  for (const message of messages.slice(1)) {
    const { consistency: status, actualHash } = verifyMessage(message, key, {
      hash: previousHash,
      id: previousIndex,
    })
    // this should never happen
    if (status.status === "unverified") {
      throw new Error("Failed to check message")
    }
    if (status.status === "inconsistent") {
      consistency = status.type === "no-target" ? { status: "consistent" } : status
    }

    previousHash = actualHash
    previousIndex += 1
  }
  // if we never updated the status because a log failed verification,
  // we're consistent
  return {
    consistency:
      consistency.status === "unverified"
        ? { status: "consistent" }
        : consistency.status === "inconsistent" && (consistency as any).type === "no-target"
          ? { status: "consistent" }
          : consistency,
    finalHash: previousHash!,
  }
}
