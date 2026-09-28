import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

import { pdfSlice } from "./pdf/pdfSlice"
export const pdfStore = configureStore({
  reducer: {
    pdf: pdfSlice.reducer,
  },
})
export type PDFStore = typeof pdfStore
export type PDFState = ReturnType<PDFStore["getState"]>
export type Dispatch = typeof pdfStore.dispatch
export type Thunk<T = void> = ThunkAction<T, PDFState, unknown, Action>
export const usePdfDispatch = useDispatch.withTypes<Dispatch>()
export const usePdfSelector = useSelector.withTypes<PDFState>()
