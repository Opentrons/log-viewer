import { KeyObject } from "crypto"
import { readdir, readFile } from "fs/promises"
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
    expect(await parsePeriod(found, [])).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: ["asp_disp_96_2026-08-20T20_34_58.383Z.json"],
      softwareVersions: [],
      associatedProtocols: [],
      identityConsistency: {
        type: "no-target",
        status: "inconsistent",
      },
      robotId: {
        internalConsistency: { status: "consistent" },
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
      sequentialConsistency: { status: "unverified" },
      internalConsistency: { status: "unverified" },
      publicKey: expect.any(KeyObject),
      startDate: "2026-08-20T20:34:18.573005Z",
      endDate: "2026-08-20T20:36:54.001886Z",
      logCount: 11,
      trailingLogHash: expect.any(Buffer),
    })
  })
  it("parses the period correctly for a period with versions and no protocols", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-09-04T14_59_29.775386Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(await parsePeriod(found, [])).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: [],
      softwareVersions: ["10.0.0-alpha.7"],
      associatedProtocols: [],
      identityConsistency: {
        type: "no-target",
        status: "inconsistent",
      },
      robotId: {
        internalConsistency: { status: "consistent" },
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
      sequentialConsistency: { status: "unverified" },
      internalConsistency: { status: "unverified" },
      publicKey: expect.any(KeyObject),
      startDate: "2026-09-04T14:59:29.775386Z",
      endDate: "2026-09-04T15:23:41.789874Z",
      logCount: 6,
      trailingLogHash: expect.any(Buffer),
    })
  })
  it("parses the period correctly for a period with versions and protocols", async () => {
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const target = "logperiod_2026-09-04T17_51_28.055775Z.zip"
    const found = direntries.filter((entry) => entry.name === target)[0]
    expect(found).not.toBeUndefined()
    expect(await parsePeriod(found, [])).toStrictEqual({
      identityConsistency: {
        type: "no-target",
        status: "inconsistent",
      },
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: ["whatever_2026-09-04T17_52_32.663Z.json"],
      softwareVersions: ["10.0.0-alpha.7"],
      associatedProtocols: ["whatever"],
      robotId: {
        internalConsistency: { status: "consistent" },
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
      sequentialConsistency: { status: "unverified" },
      internalConsistency: { status: "unverified" },
      publicKey: expect.any(KeyObject),
      startDate: "2026-09-04T17:51:28.055775Z",
      endDate: "2026-09-04T17:53:21.584842Z",
      logCount: 9,
      trailingLogHash: expect.any(Buffer),
    })
  })
  it("parses a verified robot identity for something with a valid blessed identity", async () => {
    const target = "logperiod_2026-08-24T19_37_43.791395Z.zip"
    const direntries = await readdir(fixturesPath, {
      withFileTypes: true,
    })
    const found = direntries.filter((entry) => entry.name === target)[0]
    const identityPath = path.join(fixturesPath, "ComplianceReady.json")
    const identityContents = await readFile(identityPath, { encoding: "utf-8" })
    const identityMessage = JSON.parse(identityContents)
    const identityPayload = JSON.parse(identityMessage.message)
    expect(
      await parsePeriod(found, [{ ...identityPayload, filePath: identityPath }]),
    ).toStrictEqual({
      periodZip: path.join(found.parentPath, found.name),
      associatedFiles: [],
      softwareVersions: [],
      associatedProtocols: [],
      identityConsistency: {
        attestedIdentityPath: path.join(fixturesPath, "ComplianceReady.json"),
        status: "consistent",
      },
      robotId: {
        internalConsistency: { status: "consistent" },
        parsed: {
          public_hash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
          robot_name: "ComplianceReady",
          robot_serial: "FLXA2020241217005",
        },
        raw: {
          message:
            '{"robot_name": "ComplianceReady", "robot_serial": "FLXA2020241217005", "public_hash": "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0="}',
          messageHash: "sha256:jR7nQYS7pO6kzTYYrDzON-UPgDTSTofrj_kdiSJZyxI=",
          messageSignature:
            "ed25519:dPZkLKMmB0_VsyVR9U40TmzNrcjdjxu1UveR8Oj-flbZMaCxvfo2UJgDewmxsyRTjWYHHOo0rWD79zuSQw-JCw==",
          signatureVersion: 1,
        },
      },
      sequentialConsistency: { status: "unverified" },
      internalConsistency: { status: "unverified" },
      publicKey: expect.any(KeyObject),
      startDate: "2026-08-24T19:37:43.791395Z",
      endDate: "2026-08-24T19:45:56.655466Z",
      logCount: 10,
      trailingLogHash: expect.any(Buffer),
    })
  })
})
