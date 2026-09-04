import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

import { configSlice } from "./config/configSlice"
import { logDirectorySlice } from "./logDirectory/logDirectorySlice"

export const store = configureStore({
  reducer: {
    config: configSlice.reducer,
    logDirectory: logDirectorySlice.reducer,
  },
})
export type Store = typeof store
export type State = ReturnType<Store["getState"]>
export type Dispatch = typeof store.dispatch
export type Thunk<T = void> = ThunkAction<T, State, unknown, Action>
export const useAppDispatch = useDispatch.withTypes<Dispatch>()
export const useAppSelector = useSelector.withTypes<State>()
