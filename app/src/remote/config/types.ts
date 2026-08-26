export type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly"

export type UrlProtocol = "file:" | "http:"

export type UpdateChannel = "latest" | "beta" | "alpha"

export type DiscoveryCandidates = string[]

export type DevInternalFlag = "dummy"

export type FeatureFlags = Partial<Record<DevInternalFlag, boolean | undefined>>

export interface ConfigV0 {
  version: 0
  devtools: boolean
  reinstallDevtools: boolean

  // app update config
  update: {
    channel: UpdateChannel
    automaticallyDownloadUpdates: boolean
  }

  // logging config
  log: {
    level: {
      file: LogLevel
      console: LogLevel
    }
  }

  // ui and browser config
  ui: {
    width: number
    height: number
    minWidth: number
    minHeight: number
    url: {
      protocol: UrlProtocol
      path: string
    }
  }

  // internal development flags
  devInternal?: FeatureFlags
}

export type Config = ConfigV0
