import path from "path"

import pick from "lodash/pick"
import { describe, it, vi, expect, beforeEach } from "vitest"

import { checkSequentialConsistency } from "../checkSequentialConsistency"
import { buildScanDirectory } from "../scanDirectory"
import type { State, LogChecker } from "../types"

vi.mock("../../log", () => ({
  createLogger: vi.fn<(...args: any) => unknown>(() => ({
    info: vi.fn<(...args: any) => unknown>(),
  })),
}))
const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("scanDirectory", () => {
  let state: State
  const dispatch = vi.fn<LogChecker["dispatch"]>()
  beforeEach(async () => {
    vi.resetAllMocks()
    state = {}
    await buildScanDirectory(state, fixturesPath, dispatch).scanPeriods()
  })
  it("should rely on a stable sort", async () => {
    const sorted1 = state["ComplianceReady"].periods
      .toSorted((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      .map((period) => period.periodZip)
    const state2: State = {}
    await buildScanDirectory(state2, fixturesPath, dispatch).scanPeriods()
    const sorted2 = state2["ComplianceReady"].periods
      .toSorted((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
      .map((period) => period.periodZip)
    expect(sorted1).toEqual(sorted2)
  })
  it("should compute sequential consistency for ComplianceReady", async () => {
    const consistency = (
      await Array.fromAsync(checkSequentialConsistency(state["ComplianceReady"].periods))
    ).map((period) => pick(period, "periodZip", "sequentialConsistency"))
    expect(consistency).toEqual([
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-21T20_31_28.456269Z.zip"),
        sequentialConsistency: {
          status: "inconsistent",
          type: "no-target",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T14_59_40.451528Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-21T20_31_28.456269Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T15_18_38.176148Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T14_59_40.451528Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T15_57_30.111933Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T15_18_38.176148Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T16_04_32.489243Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T15_57_30.111933Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T16_11_07.664478Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T16_04_32.489243Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T16_17_12.721535Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T16_11_07.664478Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T16_34_33.542044Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T16_17_12.721535Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T17_29_16.469301Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T16_34_33.542044Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T17_36_34.812649Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T17_29_16.469301Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T17_42_16.714601Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T17_36_34.812649Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T19_37_43.791395Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T17_42_16.714601Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-24T19_45_56.706329Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T19_37_43.791395Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-25T14_29_00.590608Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-24T19_45_56.706329Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-25T14_37_55.964002Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-25T14_29_00.590608Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-25T15_35_20.709482Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-25T14_37_55.964002Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-25T15_43_26.407157Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-25T15_35_20.709482Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-26T20_12_26.097145Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-25T15_43_26.407157Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-26T20_20_27.055642Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-26T20_12_26.097145Z.zip"),
          status: "consistent",
        },
      },
      {
        periodZip: path.join(fixturesPath, "logperiod_2026-08-26T20_31_30.960544Z.zip"),
        sequentialConsistency: {
          previousId: path.join(fixturesPath, "logperiod_2026-08-26T20_20_27.055642Z.zip"),
          status: "consistent",
        },
      },
    ])
  })
  it("should compute sequential consistency stably from one scan", async () => {
    const consistency = (
      await Array.fromAsync(checkSequentialConsistency(state["ComplianceReady"].periods))
    ).map((period) => pick(period, "periodZip", "sequentialConsistency"))
    const consistency2 = (
      await Array.fromAsync(checkSequentialConsistency(state["ComplianceReady"].periods))
    ).map((period) => pick(period, "periodZip", "sequentialConsistency"))
    expect(consistency).toEqual(consistency2)
  })
  it("should compute sequential consistency stably from multiple scans", async () => {
    const consistency = (
      await Array.fromAsync(checkSequentialConsistency(state["ComplianceReady"].periods))
    ).map((period) => pick(period, "periodZip", "sequentialConsistency"))
    const state2: State = {}
    await buildScanDirectory(state2, fixturesPath, dispatch).scanPeriods()
    const consistency2 = (
      await Array.fromAsync(checkSequentialConsistency(state2["ComplianceReady"].periods))
    ).map((period) => pick(period, "periodZip", "sequentialConsistency"))
    expect(consistency).toEqual(consistency2)
  })
})
