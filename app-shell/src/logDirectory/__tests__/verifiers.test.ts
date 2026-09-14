import { generateKeyPair, hash, sign } from "crypto"
import { promisify } from "util"

import { describe, it, expect } from "vitest"

import { verifyMessage } from "../verifiers"

const promisifiedGenerate = promisify(generateKeyPair)
const promisifiedSign = promisify(sign)

describe("verifyMessage", () => {
  it("should verify a valid message non-sequentially", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({ ok: true })
  })
  it("should verify a valid sequential message", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const previousMessage = "here is a previous message"
    const previousHash = hash("sha256", previousMessage, "buffer")
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const hashes = Buffer.concat([previousHash, messageHash])
    const messageSig = await promisifiedSign(null, hashes, privateKey)
    expect(
      verifyMessage(
        {
          message,
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
        previousHash,
      ),
    ).toEqual({ ok: true })
  })
  it("should forward crypto parse errors", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          messageHash: messageHash.toString("base64url"),
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({
      ok: false,
      reason: "invalid-hash",
      failure:
        "Crypto id for khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls could not be parsed: Incorrect formatting of crypto specification: must be with cryptoName:value but is khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls",
    })
  })
  it("should fail a message if it has an invalid hash", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          messageHash: `sha1:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({
      ok: false,
      reason: "invalid-hash",
      failure:
        "Crypto id for sha1:khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls must be sha256 but is sha1",
    })
  })
  it("should fail a message if it has a hash mismatch", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    expect(
      verifyMessage(
        {
          message: "how don't you do, fellow kids",
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({
      ok: false,
      reason: "hash-mismatch",
      actualHash: "YD5aBUE3B3NrXeSl60yUOCld9hBVJXQbQqLutUpx888",
    })
  })

  it("should fail a message if it has an invalid signature", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    const verifyResult = verifyMessage(
      {
        message,
        messageHash: `sha256:${messageHash.toString("base64url")}`,
        messageSignature: `rsa:${messageSig.toString("base64url")}`,
        signatureVersion: 1,
      },
      publicKey,
    )
    expect(verifyResult).toEqual({
      ok: false,
      reason: "invalid-signature",
      failure: expect.stringMatching(/Crypto id for rsa:.* must be ed25519 but is rsa/),
    })
  })

  it("should fail a message if it has a bad signature", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(
      null,
      hash("sha256", "how dont you do fellow kids", "buffer"),
      privateKey,
    )
    expect(
      verifyMessage(
        {
          message,
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({ ok: false, reason: "signature-mismatch" })
  })
  it("should fail a message if it has a bad sequential signature", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const previousMessage = "this one was first"
    const previousHash = hash("sha256", previousMessage, "buffer")
    const message = "how do you do, fellow kids"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(
      null,
      Buffer.concat([messageHash, previousHash]),
      privateKey,
    )
    expect(
      verifyMessage(
        {
          message,
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
        previousHash,
      ),
    ).toEqual({ ok: false, reason: "signature-mismatch" })
  })
})
