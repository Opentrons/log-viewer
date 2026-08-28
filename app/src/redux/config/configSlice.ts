import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

import { api } from "@/remote/api"
import type { Config } from "@/remote/config/types"

export interface ConfigState {
  config: Partial<Config>
  status: "unknown" | "cached" | "pending"
}

const initialState: ConfigState = {
  config: {},
  status: "unknown",
}

export const update = createAsyncThunk("config/update", api.setConfig)

export const updateBy = createAsyncThunk("config/updateBy", api.updateConfigBy)

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    load: (state: ConfigState, action: PayloadAction<Config>) => {
      state.config = action.payload
      state.status = "cached"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(update.fulfilled, (state, action) => {
        state.config = action.payload
        state.status = "cached"
      })
      .addCase(update.pending, (state) => {
        state.status = "pending"
      })
      .addCase(update.rejected, (state) => {
        state.status = "unknown"
      })
      .addCase(updateBy.fulfilled, (state, action) => {
        state.config = action.payload
        state.status = "cached"
      })
  },
})

export const { load } = configSlice.actions
