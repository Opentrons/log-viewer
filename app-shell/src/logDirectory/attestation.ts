import { writeFile, readdir, readFile } from "fs/promises"
import path from "path"

import sanitize from "sanitize-filename"

import { parseSignedRobotId, parseRobotId } from "./parsers"
import type { LogPeriodFile, BlessedRobotId } from "./types"

/**
 * Bless a robot identity file by moving it to the working directory.
 *
 * @param {LogPeriodFile} periodFile: The period file whose identity should be
 * blessed.
 * @param {string} basePath: The base path of the working directory.
 * @throws {Error} If the ID is not consistent.
 * @throws {Error} from FS functions.
 * @returns {Promise<BlessedRobotId>} The newly blessed ID.
 */
export async function blessRobotIdentity(
  periodFile: LogPeriodFile,
  basePath: string,
): Promise<BlessedRobotId> {
  if (periodFile.robotId.internalConsistency.status !== "consistent") {
    throw new Error("Cannot promote an inconsistent robot identity")
  }
  const fileName = sanitize(
    `${periodFile.robotId.parsed.robot_name}-${periodFile.robotId.parsed.robot_serial}-${periodFile.robotId.parsed.public_hash}.json`,
  )
  const filePath = path.join(basePath, fileName)
  await writeFile(filePath, JSON.stringify(periodFile.robotId.raw))
  return { ...periodFile.robotId.parsed, filePath }
}

/**
 * Scan for known blessed robot IDs.
 *
 * Only the top level of the directory is scanned; this isn't recursive. Any
 * file that looks like a robot ID is loaded.
 *
 * @param {string} basePath: The base path to scan.
 * @yields {BlessedRobotId}: Found robot IDs
 * @returns {AsyncGenerator<BlessedRobotId>}
 * @generator
 */
export async function* scanBlessedRobotIdentities(
  basePath: string,
): AsyncGenerator<BlessedRobotId> {
  for (const entry of await readdir(basePath, { withFileTypes: true })) {
    if (entry.isFile()) {
      if (entry.name.endsWith(".json")) {
        const filePath = path.join(entry.parentPath, entry.name)
        const fileOnDisk = await readFile(filePath, { encoding: "utf-8" })
        try {
          const parsed = JSON.parse(fileOnDisk)
          const idRaw = parseSignedRobotId(parsed)
          const payload = parseRobotId(JSON.parse(idRaw.message))
          yield { ...payload, filePath }
          // oxlint-disable-next-line no-unused-vars
        } catch (_err: any) {}
      }
    }
  }
}
