import { KeyObject } from "crypto"
import { readdir } from "fs/promises"
import path from "path"

import { describe, it, expect, vi } from "vitest"

import { parsePeriod } from "../parsePeriod"

vi.mock("../../log.js", () => ({
  createLogger: vi.fn<(...args: any) => unknown>(),
}))

// @ts-expect-error: this is in fact real but only in test
const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("parsePeriod happy path", () => {
  it("parses the period correctly", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-08-20T20_34_18.573005Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(await parsePeriod(found)).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: ["asp_disp_96_2026-08-20T20_34_58.383Z.json"],
      robotId: {
        parsed: {
          public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
          robot_name: "BornAgainArtinold",
          robot_serial: "FLXA2020250321003",
          status: "unverified",
        },
        raw: {
          message:
            '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
          messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
          messageSignature:
            "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
          signatureVersion: 1,
        },
      },
      publicKey: expect.any(KeyObject),
      startDate: "2026-08-20T20:34:18.573005Z",
      endDate: "2026-08-20T20:36:54.001886Z",
    })
  })
})
