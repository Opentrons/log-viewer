import { mkdtemp, rm, cp, readFile } from "fs/promises"
import path from "path"

import { describe, it, expect, beforeEach, afterEach } from "vitest"

import { blessRobotIdentity, scanBlessedRobotIdentities } from "../attestation"
import type { LogPeriodFile, RobotIdParsed } from "../types"

const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("attestation", async () => {
  let workingDir: string
  beforeEach(async () => {
    workingDir = await mkdtemp("bless-robot-identity")
    await cp(fixturesPath, workingDir, { recursive: true })
  })
  afterEach(async () => {
    if (workingDir != null) {
      await rm(workingDir, { recursive: true })
    }
  })
  const sanitizeIdentityPath = (identity: RobotIdParsed) =>
    `${identity.robot_name}-${identity.robot_serial}-${identity.public_hash}.json`.replace(":", "")
  it("blesses a commanded robot id", async () => {
    const robotId = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    const blessed = await blessRobotIdentity(
      { robotId, periodZip: "/some/magic/path" } as LogPeriodFile,
      workingDir,
    )
    const filePath = path.join(workingDir, sanitizeIdentityPath(robotId.parsed))
    expect(blessed).toEqual({ ...robotId.parsed, filePath, sourceLogFilepath: "/some/magic/path" })
    const fileContents = await readFile(filePath, { encoding: "utf-8" })
    expect(JSON.parse(fileContents)).toEqual({ ...robotId.raw, sourceFilepath: "/some/magic/path" })
  })
  it("overwrites a robot id with the same details", async () => {
    const robotId = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    await blessRobotIdentity({ robotId, periodZip: "/blah.zip" } as LogPeriodFile, workingDir)
    await blessRobotIdentity({ robotId, periodZip: "/bloo.zip" } as LogPeriodFile, workingDir)
    const found = await Array.fromAsync(scanBlessedRobotIdentities(workingDir))
    expect(found).toHaveLength(2)
  })
  it("finds all blessed robot ids", async () => {
    const robotId = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    await blessRobotIdentity({ robotId, periodZip: "/some/path.zip" } as LogPeriodFile, workingDir)
    const found = await Array.fromAsync(scanBlessedRobotIdentities(workingDir))
    expect(found).toHaveLength(2)
    expect(found).toContainEqual({
      ...robotId.parsed,
      sourceLogFilepath: "/some/path.zip",
      filePath: path.join(workingDir, sanitizeIdentityPath(robotId.parsed)),
    })
    expect(found).toContainEqual({
      robot_name: "ComplianceReady",
      robot_serial: "FLXA2020241217005",
      public_hash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
      filePath: path.join(
        workingDir,
        "ComplianceReady-FLXA2020241217005-sha256Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=.json",
      ),
      sourceLogFilepath: null,
    })
  })
  it("finds blessed robot ids with duplicate robot names if serials are different", async () => {
    const robotId1 = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    const robotId2 = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA202025032100333",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA202025032100333", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    await blessRobotIdentity(
      { robotId: robotId1, periodZip: "/log/1.zip" } as LogPeriodFile,
      workingDir,
    )
    await blessRobotIdentity(
      { robotId: robotId2, periodZip: "/log/2.zip" } as LogPeriodFile,
      workingDir,
    )
    const found = await Array.fromAsync(scanBlessedRobotIdentities(workingDir))
    expect(found).toHaveLength(3)
    expect(found).toContainEqual({
      ...robotId1.parsed,
      filePath: path.join(workingDir, sanitizeIdentityPath(robotId1.parsed)),
      sourceLogFilepath: "/log/1.zip",
    })
    expect(found).toContainEqual({
      ...robotId2.parsed,
      filePath: path.join(workingDir, sanitizeIdentityPath(robotId2.parsed)),
      sourceLogFilepath: "/log/2.zip",
    })
  })
  it("finds blessed robot ids with duplicate robot names if key hashes are different", async () => {
    const robotId1 = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    const robotId2 = {
      parsed: {
        robot_name: "BornAgainArtinold",
        robot_serial: "FLXA2020250321003",
        public_hash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUwwww=",
      },
      raw: {
        message:
          '{"robot_name": "BornAgainArtinold", "robot_serial": "FLXA2020250321003", "public_hash": "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUwwww="}',
        messageHash: "sha256:leZYNlsEhw8gjXloFD2EAnuqbafET38vRvrSkxdzE14=",
        messageSignature:
          "ed25519:CnywQpz7UoHtWrAmT_mgCXtN4QZdVFhpowjVLczX2S7VkipdDoJ6ompLp1AGWtCqHuB052c4RBwnNpmdDKgQBw==",
        signatureVersion: 1,
      },
      internalConsistency: { status: "consistent" },
    }
    await blessRobotIdentity(
      { robotId: robotId1, periodZip: "/log/1.zip" } as LogPeriodFile,
      workingDir,
    )
    await blessRobotIdentity(
      { robotId: robotId2, periodZip: "/log/2.zip" } as LogPeriodFile,
      workingDir,
    )
    const found = await Array.fromAsync(scanBlessedRobotIdentities(workingDir))
    expect(found).toHaveLength(3)
    expect(found).toContainEqual({
      ...robotId1.parsed,
      filePath: path.join(workingDir, sanitizeIdentityPath(robotId1.parsed)),
      sourceLogFilepath: "/log/1.zip",
    })
    expect(found).toContainEqual({
      ...robotId2.parsed,
      filePath: path.join(workingDir, sanitizeIdentityPath(robotId2.parsed)),
      sourceLogFilepath: "/log/2.zip",
    })
  })
})
