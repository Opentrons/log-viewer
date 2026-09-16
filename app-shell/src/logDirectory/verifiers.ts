import type { KeyObject } from "crypto"
import { hash, verify } from "crypto"

import type { SignedMessage, RobotIdJson } from "./filetypes"
import { parseCryptoIdentifier } from "./parsers"
import type { InternalConsistency, AttestationConsistency, BlessedRobotId, RobotId } from "./types"

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

export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
  previousHash?: Buffer,
): { consistency: InternalConsistency; actualHash: Buffer } {
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
  if (message.sig_version !== 1 && message.sig_version !== '1') {
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
    previousHash != null ? Buffer.concat([previousHash, hashDetails.content]) : actualHash,
    key,
    sigDetails.content,
  )
  return verifyResult
    ? { consistency: { status: "consistent" }, actualHash }
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

export async function verifyMessages(
  messages: SignedMessage[],
  key: KeyObject,
  initialHash?: Buffer,
): Promise<{ consistency: InternalConsistency; finalHash: Buffer }> {
  let consistency: InternalConsistency = { status: "unverified" }
  let previousHash = initialHash
  for (const message of messages) {
    const { consistency: status, actualHash } = verifyMessage(message, key, previousHash)
    if (status.status === "inconsistent") {
      if (status.type === "signature-mismatch" && previousHash == null) {
        // this indicates this is a first pass through a period that has no
        // previous period identified, and only internal consistency should be
        // checked. since the first log line is signed based on its hash and the
        // hash of the last line of the previous log, which we don't know, we
        // skip it.
      } else {
        consistency = status
      }
    }
    // this should never happen
    if (status.status === "unverified") {
      throw new Error("Failed to check message")
    }
    previousHash = actualHash
  }
  // if we never updated the status because a log failed verification,
  // we're consistent
  return {
    consistency: consistency.status === "unverified" ? { status: "consistent" } : consistency,
    finalHash: previousHash!,
  }
}
