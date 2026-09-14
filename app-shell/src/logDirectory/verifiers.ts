import type { KeyObject } from "crypto"
import { hash, verify } from "crypto"

import type { SignedMessage } from "./filetypes"
import { parseCryptoIdentifier } from "./parsers"
import type { MessageConsistencyFailure } from "./types"

export function verifyMessage(
  message: SignedMessage,
  key: KeyObject,
  previousHash?: Buffer,
): ({ ok: false } & MessageConsistencyFailure) | { ok: true } {
  const hashDetails = checkCryptoId(message.messageHash, "sha256")
  if (!hashDetails.ok) {
    return { ok: false, reason: "invalid-hash", failure: hashDetails.failure }
  }
  const hashBytes = Buffer.from(hashDetails.content, "base64url")
  const actualHash = hash(hashDetails.cryptoId, message.message, "buffer")
  if (!actualHash.equals(hashBytes)) {
    return { ok: false, reason: "hash-mismatch", actualHash: actualHash.toString("base64url") }
  }
  const sigDetails = checkCryptoId(message.messageSignature, "ed25519")
  if (!sigDetails.ok) {
    return { ok: false, reason: "invalid-signature", failure: sigDetails.failure }
  }
  if (message.signatureVersion !== 1) {
    return { ok: false, reason: "bad-signature-version" }
  }
  const sigBuffer = Buffer.from(sigDetails.content, "base64url")
  const verifyResult = verify(
    null,
    previousHash != null ? Buffer.concat([previousHash, hashBytes]) : actualHash,
    key,
    sigBuffer,
  )
  return verifyResult ? { ok: true } : { ok: false, reason: "signature-mismatch" }
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
