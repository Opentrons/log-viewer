import { useAppDispatch, useAppSelector } from "../store"
import { updateBy } from "./configSlice"

export interface WorkingDirectoryUtils {
  current: string | null
  change: () => void
}

export function useWorkingDirectory(): WorkingDirectoryUtils {
  const dispatch = useAppDispatch()
  const value = useAppSelector((state) => state.config.config?.logFiles?.workingDirectory ?? null)
  return {
    change: () => {
      console.log("about to dispatch change")
      return dispatch(
        updateBy({ configPath: "logFiles.workingDirectory", method: "directoryPicker" }),
      )
    },
    current: value,
  }
}
