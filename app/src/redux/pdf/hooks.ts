import { createSelector } from "@reduxjs/toolkit"

import { usePdfSelector } from "../pdf-store"
import type { PDFState } from "../pdf-store"
import type {
  PDFableLines,
  PDFablePeriod,
  LoadedPDFableLines,
  LoadedPDFablePeriod,
  FailedPDFableLines,
} from "./pdfSlice"
export interface LoadedCoalescedState {
  status: "ok"
  lines: LoadedPDFableLines
  period: LoadedPDFablePeriod
}
export type CoalescedState =
  | LoadedCoalescedState
  | { status: "not-loaded" }
  | { status: "error"; error: object }

const getPeriodMetadata = (state: PDFState): PDFablePeriod => state.pdf.periodMetadata
const getPeriodLines = (state: PDFState): PDFableLines => state.pdf.periodLines

export const usePeriodMetadata = () => usePdfSelector(getPeriodMetadata)
export const usePeriodLines = () => usePdfSelector(getPeriodLines)

export const useCoalescedData = (): CoalescedState =>
  usePdfSelector(
    createSelector([getPeriodMetadata, getPeriodLines], (period, lines) =>
      period.baseDataLoaded === "ok" && lines.linesLoaded === "ok"
        ? { status: "ok", lines, period }
        : period.baseDataLoaded === "failed" || lines.linesLoaded === "failed"
          ? {
              status: "error",
              error:
                period.baseDataLoaded === "failed"
                  ? period.error
                  : (lines as FailedPDFableLines).error,
            }
          : { status: "not-loaded" },
    ),
  )
