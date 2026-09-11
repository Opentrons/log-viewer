import { parseLines } from "./parseLines"
import { buildScanDirectory } from "./scanDirectory"
import type { State, LogChecker } from "./types"

export async function refresh(
  dispatch: LogChecker["dispatch"],
  basePath: string,
  checker: LogChecker,
): Promise<LogChecker> {
  await checker.teardown()
  return initialize(dispatch, basePath)
}

export function initialize(dispatch: LogChecker["dispatch"], basePath: string): LogChecker {
  const state: State = {}
  return {
    basePath,
    state,
    dispatch,
    scanDirectory: buildScanDirectory(state, basePath, dispatch),
    teardown: () => Promise.resolve(),
    parseLines: (logPath: string) => parseLines(logPath),
  }
}
