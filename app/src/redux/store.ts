import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"

import { configSlice } from "./config/configSlice"

export const store = configureStore({
  reducer: {
    config: configSlice.reducer,
  },
})
export type Store = typeof store
export type State = ReturnType<Store["getState"]>
export type Dispatch = Store["dispatch"]
export type Thunk<T = void> = ThunkAction<T, State, unknown, Action>
export const useAppDispatch = useDispatch.withTypes<Dispatch>()
export const useAppSelector = useSelector.withTypes<State>()
