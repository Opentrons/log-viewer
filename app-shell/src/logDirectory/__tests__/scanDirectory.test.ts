import path from "path"

import { describe, it, vi, expect, beforeEach } from "vitest"

import { buildScanDirectory } from "../scanDirectory"
import type { State, LogChecker } from "../types"

vi.mock("../../log", () => ({ createLogger: vi.fn<(...args: any) => unknown>() }))
// @ts-expect-error: this is in fact real but only in test
const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("scanDirectory", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  it("works in the happy path", async () => {
    const state: State = {}
    const dispatch = vi.fn<LogChecker["dispatch"]>()
    const scanDirectory = buildScanDirectory(state, fixturesPath, dispatch)

    const periodCalls = [
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-21T14_55_40.417815Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T17:17:11.092490Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-21T14:55:40.417815Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-20T20_39_22.907267Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-21T14:55:40.286623Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-20T20:39:22.907267Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T15_18_38.176148Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-24T15:57:29.966634Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T15:18:38.176148Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T15_57_30.111933Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-24T16:04:32.385812Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T15:57:30.111933Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T16_04_32.489243Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-24T16:11:07.590070Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T16:04:32.489243Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-20T20_34_18.573005Z.zip"),
            period: {
              associatedFiles: ["asp_disp_96_2026-08-20T20_34_58.383Z.json"],
              endDate: "2026-08-20T20:36:54.001886Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-20T20:34:18.573005Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-20T20_36_54.051806Z.zip"),
            period: {
              associatedFiles: ["asp_disp_96_2026-08-20T20_38_25.093Z.json"],
              endDate: "2026-08-20T20:39:22.882376Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-20T20:36:54.051806Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T16_11_07.664478Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB_better_usb_search_2026-08-24T16_15_22.159Z.json",
              ],
              endDate: "2026-08-24T16:17:12.692342Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T16:11:07.664478Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T17_29_16.469301Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__walk_usb_drive__2026-08-24T17_35_29.930Z.json",
              ],
              endDate: "2026-08-24T17:36:34.777712Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T17:29:16.469301Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T16_17_12.721535Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB_better_usb_search_2026-08-24T16_26_57.776Z.json",
              ],
              endDate: "2026-08-24T16:34:33.503007Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T16:17:12.721535Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T14_59_40.451528Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB_with_better_errors_2026-08-24T15_16_17.505Z.json",
              ],
              endDate: "2026-08-24T15:18:38.104546Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T14:59:40.451528Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T16_34_33.542044Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__simple__2026-08-24T17_27_08.316Z.json",
              ],
              endDate: "2026-08-24T17:29:16.433677Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T16:34:33.542044Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-21T20_31_28.456269Z.zip"),
            period: {
              associatedFiles: ["Library_Import_Proof_of_Concept_2026-08-24T14_52_35.312Z.json"],
              endDate: "2026-08-24T14:59:40.395954Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-21T20:31:28.456269Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T17_36_34.812649Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__simple__2026-08-24T17_41_16.803Z.json",
              ],
              endDate: "2026-08-24T17:42:16.633604Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T17:36:34.812649Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T17_42_16.714601Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-24T19:37:43.326662Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T17:42:16.714601Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T19_37_43.791395Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-24T19:45:56.655466Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T19:37:43.791395Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T15_35_20.709482Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T15:43:26.168888Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T15:35:20.709482Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T17_17_11.194276Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T19:00:38.187415Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T17:17:11.194276Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T20_00_49.424927Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T20:59:12.321683Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T20:00:49.424927Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T19_00_38.301799Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T20:00:48.958691Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T19:00:38.301799Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T19_45_56.706329Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-25T14:29:00.514942Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-24T19:45:56.706329Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-26T20_31_30.960544Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: null,
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-26T20:31:30.960544Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-26T20_12_26.097145Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: "2026-08-26T20:20:26.985422Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-26T20:12:26.097145Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T21_13_46.219267Z.zip"),
            period: {
              associatedFiles: undefined,
              endDate: null,
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T21:13:46.219267Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T14_29_00.590608Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__simple__2026-08-25T14_31_06.780Z.json",
              ],
              endDate: "2026-08-25T14:37:55.910697Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T14:29:00.590608Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T14_37_55.964002Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__wheel__2026-08-25T15_33_57.353Z.json",
              ],
              endDate: "2026-08-25T15:35:20.675291Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T14:37:55.964002Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T15_43_26.407157Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__simple__2026-08-25T18_42_23.608Z.json",
              ],
              endDate: "2026-08-26T20:12:26.049483Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T15:43:26.407157Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T20_59_12.800184Z.zip"),
            period: {
              associatedFiles: ["Heat_Shock_and_Transfer_2026-08-25T21_02_29.564Z.json"],
              endDate: "2026-08-25T21:13:46.178735Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-25T20:59:12.800184Z",
              verificationStatus: "unscanned",
            },
            robotName: "BornAgainArtinold",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-26T20_20_27.055642Z.zip"),
            period: {
              associatedFiles: [
                "Install_mock_parser_from_USB__wheel__2026-08-26T20_30_15.123Z.json",
              ],
              endDate: "2026-08-26T20:31:30.918793Z",
              protocolName: null,
              scanStatus: "not-started",
              startDate: "2026-08-26T20:20:27.055642Z",
              verificationStatus: "unscanned",
            },
            robotName: "ComplianceReady",
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
    ]
    await scanDirectory()
    // this is 1 indexed, for some reason
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: "logDirectory/directoryScanStart" })
    expect(dispatch).toHaveBeenNthCalledWith(periodCalls.length + 2, {
      type: "logDirectory/directoryScanDone",
    })
    periodCalls.forEach((call) => {
      expect(dispatch).toHaveBeenCalledWith(...call)
    })
  })
})
