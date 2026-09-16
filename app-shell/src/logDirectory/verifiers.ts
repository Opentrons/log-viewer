import type { KeyObject } from "crypto"
import { hash, verify } from "crypto"

import type { SignedMessage } from "./filetypes"
import { parseCryptoIdentifier } from "./parsers"
import type { InternalConsistency, AttestationConsistency, BlessedRobotId, RobotId } from "./types"

export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
  previousHash?: Buffer,
): InternalConsistency {
  const hashDetails = checkCryptoId(message.messageHash, "sha256")
  if (!hashDetails.ok) {
    return { status: "inconsistent", type: "invalid-hash", failure: hashDetails.failure }
  }
  const hashBytes = Buffer.from(hashDetails.content, "base64url")
  const actualHash = hash(hashDetails.cryptoId, message.message, "buffer")
  if (!actualHash.equals(hashBytes)) {
    return {
      status: "inconsistent",
      type: "hash-mismatch",
      contentHash: actualHash.toString("base64url"),
    }
  }
  const sigDetails = checkCryptoId(message.messageSignature, "ed25519")
  if (!sigDetails.ok) {
    return { status: "inconsistent", type: "invalid-signature", failure: sigDetails.failure }
  }
  if (message.signatureVersion !== 1) {
    return {
      status: "inconsistent",
      type: "unknown-signature-version",
      failure: `Log Verifier cannot handle logs signed with signature version ${message.signatureVersion}`,
    }
  }
  const sigBuffer = Buffer.from(sigDetails.content, "base64url")
  const verifyResult = verify(
    null,
    previousHash != null ? Buffer.concat([previousHash, hashBytes]) : actualHash,
    key,
    sigBuffer,
  )
  return verifyResult
    ? { status: "consistent" }
    : {
        status: "inconsistent",
        type: "signature-mismatch",
        failure: "The message was not properly signed by the associated key.",
      }
}

function checkCryptoId<CryptoId extends string>(
  line: string,
  id: CryptoId,
):
  | { ok: true; cryptoId: CryptoId; content: string }
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
    return { ok: true, cryptoId: id, content }
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
  const idResult = verifyMessage(robotId.raw, key)
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
