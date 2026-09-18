import type { State, LogPeriodFile } from "./types"
export function findPeriod(state: State, logToFind: string): LogPeriodFile {
  const foundRobot = Object.entries(state).find(
    ([_, entry]) => entry.periods.find((file) => file.periodZip === logToFind) != null,
  )
  if (foundRobot == null) {
    throw new Error(`Could not find robot containing log ${logToFind}`)
  }
  const [robotName, robotEntry] = foundRobot
  const foundPeriod = robotEntry.periods.find((file) => file.periodZip === logToFind)
  if (foundPeriod == null) {
    throw new Error(`Could not find log ${logToFind} in robot ${robotName}`)
  }
  return foundPeriod
}
