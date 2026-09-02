import { buildScanDirectory } from "./scanDirectory"
import type { State, LogChecker } from "./types"

export async function refresh(
  dispatch: LogChecker["dispatch"],
  path: string,
  checker: LogChecker,
): Promise<LogChecker> {
  await checker.teardown()
  return initialize(dispatch, path)
}

export function initialize(dispatch: LogChecker["dispatch"], path: string): LogChecker {
  const state: State = {}
  return {
    basePath: path,
    state,
    dispatch,
    scanDirectory: buildScanDirectory(state, path, dispatch),
    teardown: () => Promise.resolve(),
  }
}
