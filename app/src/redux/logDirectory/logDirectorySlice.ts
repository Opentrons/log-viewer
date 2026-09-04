import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export type ConsistencyStatus = "unverified" | "consistent" | "inconsistent"

export interface RobotId {
  name: string
  publicKeyHash: string
  serial: string
  internalConsistency: ConsistencyStatus
}
export interface LogPeriod {
  scanStatus: "done" | "not-started" | "ongoing"
  internalConsistency: ConsistencyStatus
  attestationConsistency: ConsistencyStatus
  endDate: string
  startDate: string
  associatedFiles: string[]
  protocolNames: string[]
  softwareVersions: string[]
  logCount: number
  robotId: RobotId
}

export interface LogDirectoryState {
  directoryPath: string | null
  scanStatus: "done" | "not-started" | "ongoing"
  selectedLogPeriod: { fileName: string; robotName: string } | null
  contentsByRobot: {
    [robotName: string]: {
      blessedIdentityFiles: { filePath: string; robotId: RobotId }[]
      periods: {
        [filePath: string]: LogPeriod
      }
    }
  }
}

const initialState: LogDirectoryState = {
  directoryPath: null,
  scanStatus: "not-started",
  selectedLogPeriod: null,
  contentsByRobot: {},
}

export const logDirectorySlice = createSlice({
  name: "logDirectory",
  initialState,
  reducers: {
    setPath: (state: LogDirectoryState, action: PayloadAction<{ directoryPath: string }>) => {
      state.directoryPath = action.payload.directoryPath
      state.scanStatus = "not-started"
      state.contentsByRobot = {}
    },
    directoryScanDone: (state: LogDirectoryState) => {
      state.scanStatus = "done"
    },
    directoryScanStart: (state: LogDirectoryState) => {
      state.scanStatus = "ongoing"
    },
    addTrackedLogPeriod: (
      state: LogDirectoryState,
      action: PayloadAction<{
        filePath: string
        period: LogPeriod
      }>,
    ) => {
      const robotName = action.payload.period.robotId.name
      if (!Object.hasOwn(state.contentsByRobot, robotName)) {
        state.contentsByRobot[robotName] = {
          blessedIdentityFiles: [],
          periods: {
            [action.payload.filePath]: action.payload.period,
          },
        }
      } else {
        state.contentsByRobot[robotName].periods[action.payload.filePath] = action.payload.period
      }
    },
    removeTrackedLogPeriod: (
      state: LogDirectoryState,
      action: PayloadAction<{ filePath: string }>,
    ) => {
      for (const robotState of Object.values(state.contentsByRobot)) {
        if (Object.hasOwn(robotState.periods, action.payload.filePath)) {
          delete robotState.periods[action.payload.filePath]
        }
      }
    },
    setSelectedLogPeriod: (
      state: LogDirectoryState,
      action: PayloadAction<{ selectedPath: string | null }>,
    ) => {
      state.selectedLogPeriod = null
      if (action.payload.selectedPath != null) {
        for (const [robotName, robotState] of Object.entries(state.contentsByRobot)) {
          if (Object.hasOwn(robotState.periods, action.payload.selectedPath)) {
            state.selectedLogPeriod = {
              fileName: action.payload.selectedPath,
              robotName: robotName,
            }
          }
        }
      }
    },
  },
})

export const { setPath, directoryScanDone, directoryScanStart, setSelectedLogPeriod } =
  logDirectorySlice.actions
