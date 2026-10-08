import { readFileSync } from "node:fs"

import { magicLinks } from "./releases-json.mjs"

const releasesPath = process.argv[2]
if (releasesPath == null) {
  console.error("usage: magic-links.mjs <releases.json>")
  process.exit(1)
}

const document = JSON.parse(readFileSync(releasesPath, "utf8"))
for (const link of magicLinks(document)) {
  process.stdout.write(`${link.filename}\t${link.sourceKey}\n`)
}
