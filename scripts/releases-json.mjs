const PLATFORMS = [
  { name: "win", extensions: [".msi", ".exe"] },
  { name: "mac", extensions: [".dmg", ".zip"] },
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
