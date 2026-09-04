import path from "path"

import { describe, it, vi, expect, beforeEach } from "vitest"

import { buildScanDirectory } from "../scanDirectory"
import type { State, LogChecker } from "../types"

vi.mock("../../log", () => ({ createLogger: vi.fn<(...args: any) => unknown>() }))
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
            filePath: path.join(fixturesPath, "logperiod_2026-08-20T20_34_18.573005Z.zip"),
            period: {
              associatedFiles: ["asp_disp_96_2026-08-20T20_34_58.383Z.json"],
              attestationConsistency: "unverified",
              endDate: "2026-08-20T20:36:54.001886Z",
              internalConsistency: "unverified",
              logCount: 11,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-20T20:34:18.573005Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-21T14_55_40.417815Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T17:17:11.092490Z",
              internalConsistency: "unverified",
              logCount: 15,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-21T14:55:40.417815Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T15_57_30.111933Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-24T16:04:32.385812Z",
              internalConsistency: "unverified",
              logCount: 3,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T15:57:30.111933Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T15_18_38.176148Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-24T15:57:29.966634Z",
              internalConsistency: "unverified",
              logCount: 7,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T15:18:38.176148Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-20T20_39_22.907267Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-21T14:55:40.286623Z",
              internalConsistency: "unverified",
              logCount: 4,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-20T20:39:22.907267Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T19_37_43.791395Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-24T19:45:56.655466Z",
              internalConsistency: "unverified",
              logCount: 10,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T19:37:43.791395Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T17_42_16.714601Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-24T19:37:43.326662Z",
              internalConsistency: "unverified",
              logCount: 12,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T17:42:16.714601Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T20_00_49.424927Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T20:59:12.321683Z",
              internalConsistency: "unverified",
              logCount: 9,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T20:00:49.424927Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T17_17_11.194276Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T19:00:38.187415Z",
              internalConsistency: "unverified",
              logCount: 3,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T17:17:11.194276Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T15_35_20.709482Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T15:43:26.168888Z",
              internalConsistency: "unverified",
              logCount: 7,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T15:35:20.709482Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-26T20_31_30.960544Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: null,
              internalConsistency: "unverified",
              logCount: 2,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-26T20:31:30.960544Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T19_45_56.706329Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T14:29:00.514942Z",
              internalConsistency: "unverified",
              logCount: 49,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T19:45:56.706329Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T19_00_38.301799Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-25T20:00:48.958691Z",
              internalConsistency: "unverified",
              logCount: 22,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T19:00:38.301799Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-25T21_13_46.219267Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: null,
              internalConsistency: "unverified",
              logCount: 29,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T21:13:46.219267Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-26T20_12_26.097145Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-26T20:20:26.985422Z",
              internalConsistency: "unverified",
              logCount: 7,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-26T20:12:26.097145Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-08-24T16_04_32.489243Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-08-24T16:11:07.590070Z",
              internalConsistency: "unverified",
              logCount: 4,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T16:04:32.489243Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-20T20:39:22.882376Z",
              internalConsistency: "unverified",
              logCount: 6,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-20T20:36:54.051806Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T15:18:38.104546Z",
              internalConsistency: "unverified",
              logCount: 13,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T14:59:40.451528Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T17:36:34.777712Z",
              internalConsistency: "unverified",
              logCount: 9,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T17:29:16.469301Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T17:29:16.433677Z",
              internalConsistency: "unverified",
              logCount: 9,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T16:34:33.542044Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T16:34:33.503007Z",
              internalConsistency: "unverified",
              logCount: 11,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T16:17:12.721535Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T16:17:12.692342Z",
              internalConsistency: "unverified",
              logCount: 10,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T16:11:07.664478Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-25T14:37:55.910697Z",
              internalConsistency: "unverified",
              logCount: 8,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T14:29:00.590608Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T17:42:16.633604Z",
              internalConsistency: "unverified",
              logCount: 15,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-24T17:36:34.812649Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-25T21:13:46.178735Z",
              internalConsistency: "unverified",
              logCount: 14,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "BornAgainArtinold",
                publicKeyHash: "sha256:Ze1WMVbkhBYhILfGAne5G7ir63kJUbtDPcf4CaHnGUw=",
                serial: "FLXA2020250321003",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T20:59:12.800184Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-26T20:12:26.049483Z",
              internalConsistency: "unverified",
              logCount: 13,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T15:43:26.407157Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-25T15:35:20.675291Z",
              internalConsistency: "unverified",
              logCount: 10,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-25T14:37:55.964002Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-09-04T17_51_28.055775Z.zip"),
            period: {
              associatedFiles: ["whatever_2026-09-04T17_52_32.663Z.json"],
              attestationConsistency: "unverified",
              endDate: "2026-09-04T17:53:21.584842Z",
              internalConsistency: "unverified",
              logCount: 9,
              protocolNames: ["whatever"],
              robotId: {
                internalConsistency: "unverified",
                name: "FourBot",
                publicKeyHash: "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o=",
                serial: "FLXA1020240808004",
              },
              scanStatus: "not-started",
              softwareVersions: ["10.0.0-alpha.7"],
              startDate: "2026-09-04T17:51:28.055775Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
      [
        {
          payload: {
            filePath: path.join(fixturesPath, "logperiod_2026-09-04T14_59_29.775386Z.zip"),
            period: {
              associatedFiles: [],
              attestationConsistency: "unverified",
              endDate: "2026-09-04T15:23:41.789874Z",
              internalConsistency: "unverified",
              logCount: 6,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "FourBot",
                publicKeyHash: "sha256:Xdp3lMOj_dLyafc7QQTB4ir8-N9g8aozPEPV-xQ7x_o=",
                serial: "FLXA1020240808004",
              },
              scanStatus: "not-started",
              softwareVersions: ["10.0.0-alpha.7"],
              startDate: "2026-09-04T14:59:29.775386Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-24T14:59:40.395954Z",
              internalConsistency: "unverified",
              logCount: 30,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-21T20:31:28.456269Z",
            },
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
              attestationConsistency: "unverified",
              endDate: "2026-08-26T20:31:30.918793Z",
              internalConsistency: "unverified",
              logCount: 11,
              protocolNames: [],
              robotId: {
                internalConsistency: "unverified",
                name: "ComplianceReady",
                publicKeyHash: "sha256:Gy7hap25Tlq0wLt4h8C5bBgbcdFAFbkAf5w6nd8xtw0=",
                serial: "FLXA2020241217005",
              },
              scanStatus: "not-started",
              softwareVersions: [],
              startDate: "2026-08-26T20:20:27.055642Z",
            },
          },
          type: "logDirectory/addTrackedLogPeriod",
        },
      ],
    ]

    await scanDirectory()
    expect(dispatch.mock.calls.length).toEqual(periodCalls.length + 2)
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
