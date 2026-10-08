import { readdirSync, readFileSync, writeFileSync } from "node:fs"

import { updateReleasesDocument } from "./releases-json.mjs"

const [releasesPath, version, artifactDir, baseUrl] = process.argv.slice(2)
if (releasesPath == null || version == null || artifactDir == null || baseUrl == null) {
  console.error(
    "usage: update-releases-json.mjs <releases.json> <version> <artifact-dir> <base-url>",
  )
  process.exit(1)
}

let existing = null
try {
  existing = JSON.parse(readFileSync(releasesPath, "utf8"))
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error
  }
}

const filenames = readdirSync(artifactDir, { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
const next = updateReleasesDocument(existing, { version, filenames, baseUrl })
writeFileSync(releasesPath, `${JSON.stringify(next, null, 2)}\n`)
