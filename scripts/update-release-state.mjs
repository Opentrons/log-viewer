import { readFileSync, writeFileSync } from "node:fs"

import { activeRelease, markLatestActive, revokeLatest } from "./releases-json.mjs"

const [command, releasesPath] = process.argv.slice(2)
const updates = {
  activate: markLatestActive,
  revoke: revokeLatest,
}
const update = updates[command]
if (update == null || releasesPath == null) {
  console.error("usage: update-release-state.mjs <activate|revoke> <releases.json>")
  process.exit(1)
}

const next = update(JSON.parse(readFileSync(releasesPath, "utf8")))
writeFileSync(releasesPath, `${JSON.stringify(next, null, 2)}\n`)
const active = activeRelease(next)
if (active == null) {
  console.log("No active release")
} else {
  console.log(`Active release ${active.version}`)
}
