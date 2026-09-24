import { generateKeyPair, hash, sign, createPublicKey } from "crypto"
import { readFile } from "fs/promises"
import path from "path"
import { promisify } from "util"

import { describe, it, expect } from "vitest"

import type { SignedMessage } from "../filetypes"
import {
  verifyMessages,
  verifyMessage,
  verifyPeriodIdentity,
  verifyRobotIdInternalConsistency,
} from "../verifiers"

const promisifiedGenerate = promisify(generateKeyPair)
const promisifiedSign = promisify(sign)

const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

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
})

describe("verifyMessage", async () => {
  const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
    modulusLength: 256,
  })
  it("should verify a valid message non-sequentially", async () => {
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, message_hash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          message_hash: `sha256:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
      ),
    ).toEqual({
      consistency: { status: "consistent" },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })
  it("should verify a valid sequential message", async () => {
    const previousMessage = "here is a previous message"
    const previousHash = hash("sha256", previousMessage, "buffer")
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const hashes = Buffer.concat([message_hash, previousHash])
    const messageSig = await promisifiedSign(null, hashes, privateKey)
    expect(
      verifyMessage(
        {
          message,
          message_hash: `sha256:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
        { hash: previousHash, id: -1 },
      ),
    ).toEqual({
      consistency: { status: "consistent", previousId: -1 },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })
  it("should verify a real sequential message", async () => {
    const logFile = await readFile(
      path.join(fixturesPath, "pre-unzipped", "period1", "log_period.json"),
      { encoding: "utf-8" },
    )
    const logs = JSON.parse(logFile).userLogEntries
    const keyFile = await readFile(
      path.join(fixturesPath, "pre-unzipped", "period1", "signing_key.pem"),
    )
    const key = createPublicKey(keyFile)
    const firstMessage = logs[0]
    const secondMessage = logs[1]
    // we're not providing a previous hash so this message is guaranteed to fail
    // validation
    const { actualHash } = verifyMessage(firstMessage, key)
    expect(verifyMessage(secondMessage, key, { hash: actualHash, id: 10 })).toEqual({
      consistency: { status: "consistent", previousId: 10 },
      actualHash: expect.any(Buffer),
    })
  })
  it("should forward crypto parse errors", async () => {
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, message_hash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          message_hash: message_hash.toString("base64url"),
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
      ),
    ).toEqual({
      consistency: {
        status: "inconsistent",
        type: "invalid-hash",
        failure:
          "Crypto id for khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls could not be parsed: Incorrect formatting of crypto specification: must be with cryptoName:value but is khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls",
      },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })
  it("should fail a message if it has an invalid hash", async () => {
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, message_hash, privateKey)
    expect(
      verifyMessage(
        {
          message,
          message_hash: `sha1:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
      ),
    ).toEqual({
      consistency: {
        status: "inconsistent",
        type: "invalid-hash",
        failure:
          "Crypto id for sha1:khfH2jlC6MS6cwpgtJqgGwvMUaSG9dbk5A5bMcpu5ls must be sha256 but is sha1",
      },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })
  it("should fail a message if it has a hash mismatch", async () => {
    const { publicKey, privateKey } = await promisifiedGenerate("ed25519", {
      modulusLength: 256,
    })
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, message_hash, privateKey)
    const actualMessage = "how don't you do, fellow kids"
    const actualMessageHash = hash("sha256", actualMessage, "buffer")
    expect(
      verifyMessage(
        {
          message: actualMessage,
          message_hash: `sha256:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
      ),
    ).toEqual({
      consistency: {
        status: "inconsistent",
        type: "hash-mismatch",
        contentHash: "YD5aBUE3B3NrXeSl60yUOCld9hBVJXQbQqLutUpx888",
      },
      actualHash: expect.toSatisfy((val) => actualMessageHash.equals(val)),
    })
  })

  it("should fail a message if it has an invalid signature", async () => {
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(null, message_hash, privateKey)
    const verifyResult = verifyMessage(
      {
        message,
        message_hash: `sha256:${message_hash.toString("base64url")}`,
        message_sig: `rsa:${messageSig.toString("base64url")}`,
        sig_version: 1,
      },
      publicKey,
    )
    expect(verifyResult).toEqual({
      consistency: {
        status: "inconsistent",
        type: "invalid-signature",
        failure: expect.stringMatching(/Crypto id for rsa:.* must be ed25519 but is rsa/),
      },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })

  it("should fail a message if it has a bad signature", async () => {
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(
      null,
      hash("sha256", "how dont you do fellow kids", "buffer"),
      privateKey,
    )
    expect(
      verifyMessage(
        {
          message,
          message_hash: `sha256:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
      ),
    ).toEqual({
      consistency: {
        status: "inconsistent",
        type: "signature-mismatch",
        failure: "The message was not properly signed by the associated key.",
      },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
    })
  })
  it("should fail a message if it has a bad sequential signature", async () => {
    const previousMessage = "this one was first"
    const previousHash = hash("sha256", previousMessage, "buffer")
    const message = "how do you do, fellow kids"
    const message_hash = hash("sha256", message, "buffer")
    const messageSig = await promisifiedSign(
      null,
      Buffer.concat([previousHash, message_hash]),
      privateKey,
    )
    expect(
      verifyMessage(
        {
          message,
          message_hash: `sha256:${message_hash.toString("base64url")}`,
          message_sig: `ed25519:${messageSig.toString("base64url")}`,
          sig_version: 1,
        },
        publicKey,
        { hash: previousHash, id: 10 },
      ),
    ).toEqual({
      consistency: {
        status: "inconsistent",
        type: "no-target",
      },
      actualHash: expect.toSatisfy((val) => message_hash.equals(val)),
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

describe("verifyMessages", async () => {
  const period1File = await readFile(
    path.join(fixturesPath, "pre-unzipped", "period1", "log_period.json"),
    { encoding: "utf-8" },
  )
  const period2File = await readFile(
    path.join(fixturesPath, "pre-unzipped", "period2", "log_period.json"),
    { encoding: "utf-8" },
  )
  const keyFile = await readFile(
    path.join(fixturesPath, "pre-unzipped", "period2", "signing_key.pem"),
  )
  const key = createPublicKey(keyFile)
  const messages1 = JSON.parse(period1File).userLogEntries as SignedMessage[]
  const messages2 = JSON.parse(period2File).userLogEntries as SignedMessage[]
  it("should provide internal consistency when not given a trailing hash", async () => {
    expect(await verifyMessages(messages1, key)).toEqual({
      consistency: { status: "consistent" },
      finalHash: expect.any(Buffer),
    })
  })
  it("should provide sequential consistency when given a trailing hash", async () => {
    const { finalHash } = await verifyMessages(messages1, key)
    expect(await verifyMessages(messages2, key, finalHash)).toEqual({
      consistency: { status: "consistent", previousId: -1 },
      finalHash: expect.any(Buffer),
    })
  })
  it("should fail sequential consistency when given a non-matching trailing hash", async () => {
    const finalHash = Buffer.from("gabbagool", "base64url")
    expect(await verifyMessages(messages2, key, finalHash)).toEqual({
      consistency: {
        status: "inconsistent",
        type: "signature-mismatch",
        failure: "Invalid signature using provided previous hash",
      },
      finalHash: expect.any(Buffer),
    })
  })
})
