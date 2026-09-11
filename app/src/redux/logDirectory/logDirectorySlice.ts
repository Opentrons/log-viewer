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
      state.logLines = { status: "empty" }
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
    setSelectedLogLine: (
      state: LogDirectoryState,
      action: PayloadAction<{ selectedLog: number | null }>,
    ) => {
      if (state.logLines.status != "loaded") {
        return
      }
      state.logLines.selected = action.payload.selectedLog
    },
    setLogFilter: (
      state: LogDirectoryState,
      action: PayloadAction<{ filterText: string | null }>,
    ) => {
      const filterText = action.payload.filterText
      if (state.logLines.status != "loaded") {
        return
      }
      if (filterText == null) {
        state.logLines.filteredLines = state.logLines.lines
        return
      }
      state.logLines.filteredLines = state.logLines.lines.filter((line) =>
        line.envelope.message.includes(filterText),
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadLogs.fulfilled, (state, action) => {
      state.logLines = {
        status: "loaded",
        lines: action.payload,
        filteredLines: action.payload,
        selected: null,
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

export const {
  setLogFilter,
  setPath,
  directoryScanDone,
  directoryScanStart,
  setSelectedLogPeriod,
  setSelectedLogLine,
} = logDirectorySlice.actions
