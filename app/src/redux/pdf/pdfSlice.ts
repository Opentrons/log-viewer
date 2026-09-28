import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { pdfApi } from "@/remote/pdf-api"

import type { LogPeriod, LogLine } from "../logDirectory/types"

export interface UnloadedPDFablePeriod {
  baseDataLoaded: "unloaded"
}

export interface LoadedPDFablePeriod extends Omit<LogPeriod, "scanStatus"> {
  baseDataLoaded: "ok"
}

export interface FailedPDFablePeriod {
  baseDataLoaded: "failed"
  error: object
}

export type PDFablePeriod = LoadedPDFablePeriod | UnloadedPDFablePeriod | FailedPDFablePeriod

export interface LoadedPDFableLines {
  linesLoaded: "ok"
  loadedLines: LogLine[]
}

export interface UnloadedPDFableLines {
  linesLoaded: "unloaded"
}

export interface FailedPDFableLines {
  linesLoaded: "failed"
  error: object
}

export type PDFableLines = LoadedPDFableLines | UnloadedPDFableLines | FailedPDFableLines

export interface PDFState {
  periodMetadata: PDFablePeriod
  periodLines: PDFableLines
}

export const loadLines = createAsyncThunk("pdf/loadLines", pdfApi.loadLines)
export const loadMetadata = createAsyncThunk("pdf/load", pdfApi.loadMetadata)
export const status = createAsyncThunk("pdf/status", pdfApi.status)

const initialState: PDFState = {
  periodMetadata: { baseDataLoaded: "unloaded" },
  periodLines: { linesLoaded: "unloaded" },
}

export const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadLines.fulfilled, (state, action) => {
      state.periodLines = {
        linesLoaded: "ok",
        loadedLines: action.payload,
      }
    })
    builder.addCase(loadLines.rejected, (state, action) => {
      state.periodLines = {
        linesLoaded: "failed",
        error: action.error,
      }
    })
    builder.addCase(loadMetadata.fulfilled, (state, action) => {
      state.periodMetadata = {
        baseDataLoaded: "ok",
        ...action.payload,
      }
    })
    builder.addCase(loadMetadata.rejected, (state, action) => {
      state.periodMetadata = {
        baseDataLoaded: "failed",
        error: action.error,
      }
    })
  },
})
