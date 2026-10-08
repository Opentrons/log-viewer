import { describe, expect, it } from "vitest"

import { updateReleasesDocument } from "./releases-json.mjs"

const baseUrl = "https://builds.opentrons.com/logviewer"
const filenames = [
  "Log Verifier-v1.2.3-win-abc.msi",
  "Log Verifier-v1.2.3-mac-abc.dmg",
  "Log Verifier-v1.2.3-mac-abc.zip",
  "Log Verifier-v1.2.3-linux-abc.AppImage",
  "latest.yml",
  "Log Verifier-v1.2.3-mac-abc.dmg.blockmap",
]

describe("updateReleasesDocument", () => {
  it("creates productionV1 entries with installer URLs and revoked false", () => {
    expect(updateReleasesDocument(null, { version: "1.2.3", filenames, baseUrl })).toEqual({
      productionV1: {
        "1.2.3": {
          win: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-win-abc.msi",
          mac: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-mac-abc.dmg",
          linux: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-linux-abc.AppImage",
          revoked: false,
        },
      },
    })
  })

  it("keeps other versions and an existing revoked flag", () => {
    const existing = {
      productionV1: {
        "1.0.0": {
          win: "https://builds.opentrons.com/logviewer/old.msi",
          revoked: false,
        },
        "1.2.3": {
          win: "https://builds.opentrons.com/logviewer/stale.msi",
          revoked: true,
        },
      },
    }

    const next = updateReleasesDocument(existing, { version: "1.2.3", filenames, baseUrl })

    expect(next.productionV1["1.0.0"]).toEqual(existing.productionV1["1.0.0"])
    expect(next.productionV1["1.2.3"].revoked).toBe(true)
    expect(next.productionV1["1.2.3"].win).toContain("Log%20Verifier-v1.2.3-win-abc.msi")
  })

  it("fails when a tag build has no installers", () => {
    expect(() =>
      updateReleasesDocument(null, { version: "1.2.3", filenames: ["latest.yml"], baseUrl }),
    ).toThrow(/No installers found/)
  })
})
