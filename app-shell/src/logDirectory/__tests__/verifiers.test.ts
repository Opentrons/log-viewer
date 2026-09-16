import { generateKeyPair, hash, sign } from "crypto"
import { promisify } from "util"

import { describe, it, expect } from "vitest"

import { verifyMessage, verifyPeriodIdentity, verifyRobotIdInternalConsistency } from "../verifiers"

const promisifiedGenerate = promisify(generateKeyPair)
const promisifiedSign = promisify(sign)

describe("verifyRobotIdInternalConsistency", async () => {
  const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
    modulusLength: 256,
  })
  it("should pass the robot id properly formatted to verifyMessage", async () => {
    const message = "asdasdasd"
    const messageHash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, messageHash, privateKey)
    expect(
      verifyRobotIdInternalConsistency(
        {
          message,
          messageHash: `sha256:${messageHash.toString("base64url")}`,
          messageSignature: `ed25519:${messageSig.toString("base64url")}`,
          signatureVersion: 1,
        },
        publicKey,
      ),
    ).toEqual({ status: "consistent" })
  })
  it("should verify a valid sequential message", async () => {
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
    ).toEqual({ status: "consistent" })
  })
  it("should forward crypto parse errors", async () => {
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
      status: "inconsistent",
      type: "invalid-hash",
      failure:
        "Crypto id for khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls could not be parsed: Incorrect formatting of crypto specification: must be with cryptoName:value but is khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls",
    })
  })
  it("should fail a message if it has an invalid hash", async () => {
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
      status: "inconsistent",
      type: "invalid-hash",
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
      status: "inconsistent",
      type: "hash-mismatch",
      contentHash: "YD5aBUE3B3NrXeSl60yUOCld9hBVJXQbQqLutUpx888",
    })
  })

  it("should fail a message if it has an invalid signature", async () => {
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
      status: "inconsistent",
      type: "invalid-signature",
      failure: expect.stringMatching(/Crypto id for rsa:.* must be ed25519 but is rsa/),
    })
  })

  it("should fail a message if it has a bad signature", async () => {
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
    ).toEqual({
      status: "inconsistent",
      type: "signature-mismatch",
      failure: "The message was not properly signed by the associated key.",
    })
  })
  it("should fail a message if it has a bad sequential signature", async () => {
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
    ).toEqual({
      status: "inconsistent",
      type: "signature-mismatch",
      failure: "The message was not properly signed by the associated key.",
    })
  })
})

describe("verifyPeriodIdentity", async () => {
  const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
    modulusLength: 256,
  })
  const pubkeyHash = hash("sha256", publicKey.export({ format: "pem", type: "spki" }), "buffer")
  it("should verify a valid robot file with a known identity", async () => {
    const robotId = {
      robot_name: "steve",
      robot_serial: "1234567",
      public_hash: `sha256:${pubkeyHash.toString("base64url")}`,
    }
    const blessedRobotId = {
      robot_name: "steve",
      robot_serial: "1234567",
      public_hash: `sha256:${pubkeyHash.toString("base64url")}`,
    }
    const robotIdHash = hash("sha256", JSON.stringify(robotId), "buffer")
    const robotIdSig = await promisifiedSign(null, robotIdHash, privateKey)
    const signedId = {
      message: JSON.stringify(robotId),
      messageHash: `sha256:${robotIdHash.toString("base64url")}`,
      messageSignature: `ed25519:${robotIdSig.toString("base64url")}`,
      signatureVersion: 1,
    }
    expect(
      verifyPeriodIdentity(
        { parsed: robotId, raw: signedId, internalConsistency: { status: "unverified" } },
        publicKey,
        [{ ...blessedRobotId, filePath: "/my/path.json" }],
      ),
    ).toEqual({
      robotId: { parsed: robotId, raw: signedId, internalConsistency: { status: "consistent" } },
      identityConsistency: { status: "consistent", attestedIdentityPath: "/my/path.json" },
    })
  })
  it("should identify a valid robot file with an unknown identity", async () => {
    const robotId = {
      robot_name: "steve",
      robot_serial: "1234567",
      public_hash: `sha256:${pubkeyHash.toString("base64url")}`,
    }
    const blessedRobotId = {
      robot_name: "steve0",
      robot_serial: "123456788",
      public_hash: `sha256:${pubkeyHash.toString("base64url")}`,
    }
    const robotIdHash = hash("sha256", JSON.stringify(robotId), "buffer")
    const robotIdSig = await promisifiedSign(null, robotIdHash, privateKey)
    const signedId = {
      message: JSON.stringify(robotId),
      messageHash: `sha256:${robotIdHash.toString("base64url")}`,
      messageSignature: `ed25519:${robotIdSig.toString("base64url")}`,
      signatureVersion: 1,
    }
    expect(
      verifyPeriodIdentity(
        { parsed: robotId, raw: signedId, internalConsistency: { status: "unverified" } },
        publicKey,
        [{ ...blessedRobotId, filePath: "/my/path.json" }],
      ),
    ).toEqual({
      robotId: { parsed: robotId, raw: signedId, internalConsistency: { status: "consistent" } },
      identityConsistency: { status: "inconsistent", type: "no-target" },
    })
  })
  it("should identify a period with an invalid id", async () => {
    const robotId = {
      robot_name: "steve",
      robot_serial: "1234567",
      public_hash: `sha256:i want this stable thanks`,
    }
    const robotIdHash = hash("sha256", "wait this isnt what im supposed to be hashing", "buffer")
    const robotIdSig = await promisifiedSign(null, robotIdHash, privateKey)
    const signedId = {
      message: JSON.stringify(robotId),
      messageHash: `sha256:${robotIdHash.toString("base64url")}`,
      messageSignature: `ed25519:${robotIdSig.toString("base64url")}`,
      signatureVersion: 1,
    }
    expect(
      verifyPeriodIdentity(
        { parsed: robotId, raw: signedId, internalConsistency: { status: "unverified" } },
        publicKey,
        [],
      ),
    ).toEqual({
      robotId: {
        parsed: robotId,
        raw: signedId,
        internalConsistency: {
          status: "inconsistent",
          type: "hash-mismatch",
          contentHash: "OBdfoDbwCvOn41-6ab4GDZI9nUkrKmNisWped23GaOc",
        },
      },
      identityConsistency: { status: "inconsistent", type: "internally-inconsistent" },
    })
  })
})
