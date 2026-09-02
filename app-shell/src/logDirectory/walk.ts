import type { Dirent } from "fs"
import { readdir } from "fs/promises"
import path from "path"

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
