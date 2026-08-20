import type { Config, ConfigV0 } from "./types"

// note: this is all copied from Opentrons/opentrons app-shell/config,
// when we have to add config migrations copy it from there too

const CONFIG_VERSION_LATEST = 0

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
      path: "ui/index.html",
    },
  },
}

// Uncomment this stuff and modify for the first migration we write

// const toVersion1 = (prevConfig: ConfigV0): ConfigV1 => {
//   const nextConfig = {
//     ...prevConfig,
//     version: 1 as const,
//   }

//   return nextConfig
// }

const MIGRATIONS: [
  // (prevConfig: ConfigV0) => ConfigV1,
] = [
  // toVersion1,
]

export const DEFAULTS: Config = migrate(DEFAULTS_V0)

export function migrate(prevConfig: ConfigV0): Config {
  const prevVersion = prevConfig.version
  let result = prevConfig

  // loop through the migrations, skipping any migrations that are unnecessary
  for (let i: number = prevVersion; i < MIGRATIONS.length; i++) {
    const migrateVersion = MIGRATIONS[i]
    // @ts-expect-error(sf,8/26): no migrations yet
    result = migrateVersion(result)
  }

  if (result.version < CONFIG_VERSION_LATEST) {
    throw new Error(
      `Config migration failed; expected at least version ${CONFIG_VERSION_LATEST} but got ${result.version}`,
    )
  }

  return result as Config
}
