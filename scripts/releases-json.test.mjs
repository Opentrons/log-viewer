import { describe, expect, it } from "vitest"

import {
  magicLinks,
  markLatestActive,
  revokeLatest,
  updateReleasesDocument,
} from "./releases-json.mjs"

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
  it("creates productionV1 entries without active or revoked", () => {
    expect(updateReleasesDocument(null, { version: "1.2.3", filenames, baseUrl })).toEqual({
      productionV1: {
        "1.2.3": {
          win: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-win-abc.msi",
          mac: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-mac-abc.dmg",
          linux: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.2.3-linux-abc.AppImage",
        },
      },
    })
  })

  it("keeps other versions and an existing revoked flag", () => {
    const existing = {
      productionV1: {
        "1.0.0": {
          win: "https://builds.opentrons.com/logviewer/old.msi",
          active: true,
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
    expect(next.productionV1["1.2.3"].active).toBeUndefined()
    expect(next.productionV1["1.2.3"].win).toContain("Log%20Verifier-v1.2.3-win-abc.msi")
    expect(next.productionV1["1.0.0"].active).toBe(true)
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

  it("marks the highest production version active and copies that build", () => {
    const document = {
      productionV1: {
        "1.9.0": {
          win: "https://builds.opentrons.com/logviewer/old.msi",
          mac: "https://builds.opentrons.com/logviewer/old.dmg",
          linux: "https://builds.opentrons.com/logviewer/old.AppImage",
          active: true,
        },
        "1.10.0": {
          win: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-win.msi",
          mac: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-mac.dmg",
          linux: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-linux.AppImage",
        },
        "2.0.0": {
          win: "https://builds.opentrons.com/logviewer/revoked.msi",
          revoked: true,
          active: true,
        },
        "2.1.0-alpha.1": {
          win: "https://builds.opentrons.com/logviewer/alpha.msi",
        },
      },
    }

    const active = markLatestActive(document)

    expect(active.productionV1["1.10.0"].active).toBe(true)
    expect(active.productionV1["1.9.0"].active).toBe(false)
    expect(active.productionV1["2.0.0"].active).toBe(false)
    expect(active.productionV1["2.1.0-alpha.1"].active).toBeUndefined()
    expect(magicLinks(active).map((link) => link.version)).toEqual(["1.10.0", "1.10.0", "1.10.0"])
  })

  it("revokes the highest production version and moves active to the previous one", () => {
    const document = {
      productionV1: {
        "1.9.0": {
          win: "https://builds.opentrons.com/logviewer/old.msi",
          mac: "https://builds.opentrons.com/logviewer/old.dmg",
          linux: "https://builds.opentrons.com/logviewer/old.AppImage",
        },
        "1.10.0": {
          win: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-win.msi",
          mac: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-mac.dmg",
          linux: "https://builds.opentrons.com/logviewer/Log%20Verifier-v1.10.0-linux.AppImage",
          active: true,
        },
      },
    }

    const revoked = revokeLatest(document)

    expect(revoked.productionV1["1.10.0"]).toMatchObject({ active: false, revoked: true })
    expect(revoked.productionV1["1.9.0"].active).toBe(true)
    expect(magicLinks(revoked).map((link) => [link.filename, link.sourceKey])).toEqual([
      ["Log Viewer.msi", "logviewer/old.msi"],
      ["Log Viewer.dmg", "logviewer/old.dmg"],
      ["Log Viewer.AppImage", "logviewer/old.AppImage"],
    ])
  })

  it("fails when a tag build has no installers", () => {
    expect(() =>
      updateReleasesDocument(null, { version: "1.2.3", filenames: ["latest.yml"], baseUrl }),
    ).toThrow(/No installers found/)
  })
})
