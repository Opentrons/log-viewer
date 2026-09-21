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
    : {
        consistency: {
          status: "inconsistent",
          type: "signature-mismatch",
          failure: "The message was not properly signed by the associated key.",
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

export async function verifyMessages(
  messages: SignedMessage[],
  key: KeyObject,
  initialHash?: Buffer,
): Promise<{ consistency: InternalConsistency; finalHash?: Buffer }> {
  let consistency: InternalConsistency = { status: "unverified" }

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
    consistency: consistency.status === "unverified" ? { status: "consistent" } : consistency,
    finalHash: previousHash!,
  }
}
