import flow from "lodash/flow"

import type { Config, ConfigV0, ConfigV1 } from "./types"

const CONFIG_VERSION_LATEST = 1

export const DEFAULTS_V0: ConfigV0 = {
  version: 0,
  devtools: false,
  reinstallDevtools: false,

  // app update config
  update: {
    channel: "latest",
    automaticallyDownloadUpdates: false,
  },

  // logging config
  log: {
    level: {
      file: "debug",
      console: "info",
    },
  },

  // ui and browser config
  ui: {
    width: 1024,
    height: 768,
    minWidth: 600,
    minHeight: 600,
    url: {
      protocol: "file:",
      path: "lib/ui/index.html",
    },
  },
}

const toVersion1 = (prevConfig: ConfigV0): ConfigV1 => {
  const nextConfig = {
    ...prevConfig,
    version: 1 as const,
    logFiles: { workingDirectory: null },
  }

  return nextConfig
}

const MIGRATIONS = [toVersion1] as const

export const DEFAULTS: Config = migrate(DEFAULTS_V0)

export function migrate(prevConfig: ConfigV0): Config {
  const prevVersion = prevConfig.version
  const result = flow(MIGRATIONS.slice(prevVersion))(prevConfig)

  if (result.version < CONFIG_VERSION_LATEST) {
    throw new Error(
      `Config migration failed; expected at least version ${CONFIG_VERSION_LATEST} but got ${result.version}`,
    )
  }

  return result
}
