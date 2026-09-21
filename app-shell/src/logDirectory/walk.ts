import type { Dirent } from "fs"
import { readdir } from "fs/promises"
import path from "path"

/**
 * Walk a directory tree as an async generator.
 *
 * This is available as a dependency but is so simple there's no reason to take
 * a dep. Does not follow symlinks.
 *
 * @param {string} basePath: The root of the tree to walk.
 * @yields {Dirent} A directory entry.
 * @returns {AsyncGenerator<Dirent>} A generator of directory entries.
 * @generator
 */
export async function* walk(basePath: string): AsyncGenerator<Dirent> {
  for (const entry of await readdir(basePath, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for await (const recursiveEntry of walk(path.join(entry.parentPath, entry.name))) {
        yield recursiveEntry
      }
    } else if (!entry.isSymbolicLink()) {
      yield entry
    }
  }
}
