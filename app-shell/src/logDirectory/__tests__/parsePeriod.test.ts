import { KeyObject } from "crypto"
import { readdir } from "fs/promises"
import path from "path"

import { describe, it, expect, vi } from "vitest"

import { parsePeriod } from "../parsePeriod"

vi.mock("../../log.js", () => ({
  createLogger: vi.fn<(...args: any) => unknown>(),
}))

const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("parsePeriod happy path", () => {
  it("parses the period correctly for a period with no versions", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-08-20T20_34_18.573005Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(await parsePeriod(found)).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: ["asp_disp_96_2026-08-20T20_34_58.383Z.json"],
      softwareVersions: [],
      associatedProtocols: [],
      robotId: {
        parsed: {
          public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
          robot_name: "BornAgainArtinold",
          robot_serial: "FLXA2020250321003",
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
      logCount: 11,
    })
  })
  it("parses the period correctly for a period with versions and no protocols", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-09-04T14_59_29.775386Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(await parsePeriod(found)).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: [],
      softwareVersions: ["10.0.0-alpha.7"],
      associatedProtocols: [],
      robotId: {
        parsed: {
          public_hash: "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o=",
          robot_name: "FourBot",
          robot_serial: "FLXA1020240808004",
        },
        raw: {
          message:
            '{"robot_name": "FourBot", "robot_serial": "FLXA1020240808004", "public_hash": "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o="}',
          messageHash: "sha256:5tj14IJlXjpZ3k7L0CXLXHpKvMhYRe5XABXr-j5UASM=",
          messageSignature:
            "ed25519:w1aQDd7-uHv-WmfCAd-gbML2_wATd5eTSkmN2N-eJo73p9yFKobkdBysH-KoTA-vY2cNYRfJXq5SYMrL992xCw==",
          signatureVersion: 1,
        },
      },
      publicKey: expect.any(KeyObject),
      startDate: "2026-09-04T14:59:29.775386Z",
      endDate: "2026-09-04T15:23:41.789874Z",
      logCount: 6,
    })
  })
  it("parses the period correctly for a period with versions and protocols", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-09-04T17_51_28.055775Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(found).not.toBeUndefined()
    expect(await parsePeriod(found)).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: ["whatever_2026-09-04T17_52_32.663Z.json"],
      softwareVersions: ["10.0.0-alpha.7"],
      associatedProtocols: ["whatever"],
      robotId: {
        parsed: {
          public_hash: "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o=",
          robot_name: "FourBot",
          robot_serial: "FLXA1020240808004",
        },
        raw: {
          message:
            '{"robot_name": "FourBot", "robot_serial": "FLXA1020240808004", "public_hash": "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o="}',
          messageHash: "sha256:5tj14IJlXjpZ3k7L0CXLXHpKvMhYRe5XABXr-j5UASM=",
          messageSignature:
            "ed25519:w1aQDd7-uHv-WmfCAd-gbML2_wATd5eTSkmN2N-eJo73p9yFKobkdBysH-KoTA-vY2cNYRfJXq5SYMrL992xCw==",
          signatureVersion: 1,
        },
      },
      publicKey: expect.any(KeyObject),
      startDate: "2026-09-04T17:51:28.055775Z",
      endDate: "2026-09-04T17:53:21.584842Z",
      logCount: 9,
    })
  })
})
