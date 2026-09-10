import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { api } from "@/remote/api"

import type { LogPeriod, LogDirectoryState } from "./types"

const initialState: LogDirectoryState = {
  directoryPath: null,
  scanStatus: "not-started",
  selectedLogPeriod: null,
  contentsByRobot: {},
  logLines: { status: "empty" },
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
  extraReducers: (builder) => {
    builder.addCase(loadLogs.fulfilled, (state, action) => {
      state.logLines = {
        status: "loaded",
        lines: action.payload,
        filteredLines: action.payload,
      }
    })
    builder.addCase(loadLogs.pending, (state) => {
      state.logLines = {
        status: "loading",
      }
    })
    builder.addCase(loadLogs.rejected, (state, action) => {
      console.log("Failed to load logs", action.error)
      state.logLines = {
        status: "error",
        error: `${action.error?.name ?? "unknown"}: ${action.error?.message ?? "no message"}`,
      }
    })
  },
})

export const loadLogs = createAsyncThunk("logDirectory/loadLogs", api.loadLogsForPeriod)

export const { setPath, directoryScanDone, directoryScanStart, setSelectedLogPeriod } =
  logDirectorySlice.actions
