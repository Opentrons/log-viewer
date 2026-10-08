import { describe, expect, it } from "vitest"

import { magicLinks, updateReleasesDocument } from "./releases-json.mjs"

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

  it("does not publish the mac zip", () => {
    expect(() =>
      updateReleasesDocument(null, {
        version: "1.2.3",
        filenames: ["Log Verifier-v1.2.3-mac-abc.zip"],
        baseUrl,
      }),
    ).toThrow(/No installers found/)
  })

  it("does not publish the generated windows exe", () => {
    expect(() =>
      updateReleasesDocument(null, {
        version: "1.2.3",
        filenames: ["Log Verifier-v1.2.3-win-abc.exe"],
        baseUrl,
      }),
    ).toThrow(/No installers found/)
  })

  it("points magic links at the latest non-prerelease, non-revoked build", () => {
    const document = {
      productionV1: {
        "1.9.0": {
          win: "https://builds.opentrons.com/logviewer/old.msi",
          mac: "https://builds.opentrons.com/logviewer/old.dmg",
          linux: "https://builds.opentrons.com/logviewer/old.AppImage",
          revoked: false,
        },
        "1.10.0": {
          win: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-win.msi",
          mac: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-mac.dmg",
          linux: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-linux.AppImage",
          revoked: false,
        },
        "2.0.0": {
          win: "https://builds.opentrons.com/logviewer/revoked.msi",
          revoked: true,
        },
        "2.1.0-alpha.1": {
          win: "https://builds.opentrons.com/logviewer/alpha.msi",
          revoked: false,
        },
      },
    }

    expect(magicLinks(document)).toEqual([
      {
        platform: "win",
        filename: "Log Viewer.msi",
        version: "1.10.0",
        sourceKey: "logviewer/Log Verifier-v1.10.0-win.msi",
      },
      {
        platform: "mac",
        filename: "Log Viewer.dmg",
        version: "1.10.0",
        sourceKey: "logviewer/Log Verifier-v1.10.0-mac.dmg",
      },
      {
        platform: "linux",
        filename: "Log Viewer.AppImage",
        version: "1.10.0",
        sourceKey: "logviewer/Log Verifier-v1.10.0-linux.AppImage",
      },
    ])
  })

  it("fails when a tag build has no installers", () => {
    expect(() =>
      updateReleasesDocument(null, { version: "1.2.3", filenames: ["latest.yml"], baseUrl }),
    ).toThrow(/No installers found/)
  })
})
