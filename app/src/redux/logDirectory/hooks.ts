import { createSelector } from "@reduxjs/toolkit"

import { useAppSelector } from "../store"
import type { LogPeriod } from "./logDirectorySlice"

export interface KnownLogPeriods {
  [robotName: string]: { [filePath: string]: LogPeriod }
}

export function useKnownRobots(): string[] {
  return useAppSelector(
    createSelector([(state) => state.logDirectory.contentsByRobot], (contentsByRobot) =>
      Object.keys(contentsByRobot),
    ),
  )
}

export function useLogPeriodsForRobot(robot: string): { [filepath: string]: LogPeriod } {
  return useAppSelector((state) => state.logDirectory.contentsByRobot[robot]?.periods)
}

export interface SelectedLogPeriod extends LogPeriod {
  filePath: string
}

export function useSelectedLogPeriod(): SelectedLogPeriod | null {
  return useAppSelector(
    createSelector(
      [
        (state) => state.logDirectory.selectedLogPeriod,
        (state) => state.logDirectory.contentsByRobot,
      ],
      (selectedLogPeriod, contentsByRobot) => {
        if (selectedLogPeriod == null) {
          return null
        }
        const logPeriod =
          contentsByRobot?.[selectedLogPeriod.robotName]?.periods?.[selectedLogPeriod.fileName] ??
          null
        return logPeriod == null
          ? logPeriod
          : { ...logPeriod, filePath: selectedLogPeriod.fileName }
      },
    ),
  )
}
