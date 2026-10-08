const PLATFORMS = [
  { name: "win", extensions: [".msi"] },
  { name: "mac", extensions: [".dmg"] },
  { name: "linux", extensions: [".AppImage"] },
]

export function selectInstallers(filenames) {
  const selected = {}
  for (const platform of PLATFORMS) {
    for (const extension of platform.extensions) {
      const matches = filenames.filter((name) => name.endsWith(extension))
      if (matches.length > 1) {
        throw new Error(`Multiple ${platform.name} ${extension} installers: ${matches.join(", ")}`)
      }
      if (matches.length === 1) {
        selected[platform.name] = matches[0]
        break
      }
    }
  }
  return selected
}

export function artifactUrl(baseUrl, filename) {
  const base = baseUrl.replace(/\/+$/, "")
  return `${base}/${encodeURIComponent(filename)}`
}

export function updateReleasesDocument(existing, { version, filenames, baseUrl }) {
  if (typeof version !== "string" || version.length === 0) {
    throw new Error("version is required")
  }
  const document = existing == null ? { productionV1: {} } : structuredClone(existing)
  if (
    document.productionV1 == null ||
    typeof document.productionV1 !== "object" ||
    Array.isArray(document.productionV1)
  ) {
    document.productionV1 = {}
  }

  const installers = selectInstallers(filenames)
  if (Object.keys(installers).length === 0) {
    throw new Error(`No installers found for ${version}`)
  }

  const previous = document.productionV1[version]
  const revoked =
    previous != null && typeof previous.revoked === "boolean" ? previous.revoked : false
  const entry = {}
  for (const platform of PLATFORMS) {
    const filename = installers[platform.name]
    if (filename != null) {
      entry[platform.name] = artifactUrl(baseUrl, filename)
    }
  }
  entry.revoked = revoked
  document.productionV1[version] = entry
  return document
}

export const MAGIC_LINK_FILENAMES = {
  win: "Log Viewer.msi",
  mac: "Log Viewer.dmg",
  linux: "Log Viewer.AppImage",
}

const PRODUCTION_VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

export function isProductionVersion(version) {
  return PRODUCTION_VERSION.test(version)
}

export function compareSemver(left, right) {
  const leftParts = left.split(".").map((part) => Number(part))
  const rightParts = right.split(".").map((part) => Number(part))
  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index]
    }
  }
  return 0
}

export function latestProductionRelease(document) {
  const releases = document?.productionV1
  if (releases == null || typeof releases !== "object" || Array.isArray(releases)) {
    return null
  }
  const versions = Object.keys(releases)
    .filter((version) => isProductionVersion(version) && releases[version]?.revoked !== true)
    .sort(compareSemver)
  const version = versions.at(-1)
  if (version == null) {
    return null
  }
  return { version, release: releases[version] }
}

export function s3KeyFromArtifactUrl(artifactUrl) {
  const pathname = new URL(artifactUrl).pathname.replace(/^\//, "")
  return decodeURIComponent(pathname)
}

export function magicLinks(document) {
  const latest = latestProductionRelease(document)
  if (latest == null) {
    return []
  }
  const links = []
  for (const [platform, filename] of Object.entries(MAGIC_LINK_FILENAMES)) {
    const artifactUrl = latest.release[platform]
    if (typeof artifactUrl !== "string" || artifactUrl.length === 0) {
      continue
    }
    links.push({
      platform,
      filename,
      version: latest.version,
      sourceKey: s3KeyFromArtifactUrl(artifactUrl),
    })
  }
  return links
}
