import { describe, expect, it } from "vitest"

import { parseSignedMessage, parseRobotId } from "../parsers"

describe("parseSignedMessage", () => {
  ;(
    [
      [],
      {},
      "hi",
      true,
      1.2,
      { message: "hi", message_hash: "lo", message_sig: "th" },
      { message: "hi", message_hash: "lo", sig_version: "er" },
      { message: "hi", message_sig: "th", sig_version: "er" },
      { message_hash: "lo", message_sig: "th", sig_version: "er" },
      { message: "hi", message_hash: "lo", message_sig: "th", sig_version: 3 },
      { message: "hi", message_hash: "lo", message_sig: true, sig_version: "er" },
      { message: "hi", message_hash: {}, message_sig: "th", sig_version: "er" },
      { message: [], message_hash: "lo", message_sig: "th", sig_version: "er" },
    ] as const
  ).map((test) =>
    it(`should reject ${JSON.stringify(test)}`, () => {
      expect(() => parseSignedMessage(test)).toThrow(/Cannot parse signed message:.*/)
    }),
  )
  it("should accept a well-formatted message", () => {
    expect(
      parseSignedMessage({
        message: "hi",
        messageHash: "lo",
        messageSignature: "th",
        signatureVersion: "er",
      }),
    ).toStrictEqual({
      message: "hi",
      messageHash: "lo",
      messageSignature: "th",
      signatureVersion: "er",
    })
  })
})

describe("parseRobotId rejections", () => {
  ;(
    [
      [],
      {},
      "hi",
      true,
      1.2,
      { robot_name: "lo", robot_serial: "th" },
      { robot_name: "lo", public_hash: "er" },
      { robot_serial: "th", public_hash: "er" },
      { robot_name: "lo", robot_serial: "th", public_hash: 3 },
      { robot_name: "lo", robot_serial: true, public_hash: "er" },
      { robot_name: {}, robot_serial: "th", public_hash: "er" },
    ] as const
  ).map((test) =>
    it(`should reject {JSON.stringify(test)}`, () => {
      expect(() => parseRobotId(test)).toThrow(/Cannot parse robot ID:.*/)
    }),
  )
  it("should accept a well-formatted robot ID", () => {
    expect(parseRobotId({ robot_name: "lo", robot_serial: "th", public_hash: "er" })).toStrictEqual(
      {
        robot_name: "lo",
        robot_serial: "th",
        public_hash: "er",
      },
    )
  })
})
