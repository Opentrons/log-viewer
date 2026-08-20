export type LogLevel = "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly"

export type UrlProtocol = "file:" | "http:"

export type UpdateChannel = "latest" | "beta" | "alpha"

export type DiscoveryCandidates = string[]

export type DevInternalFlag =
  | "forceHttpPolling"
  | "protocolStats"
  | "enableRunNotes"
  | "protocolTimeline"
  | "enableLabwareCreator"
  | "reactQueryDevtools"
  | "reactScan"
  | "quickTransferProtocolContentsLog"
  | "accessControlMode"
  | "robotSearchBar"
  | "showGitDetails"

export type FeatureFlags = Partial<Record<DevInternalFlag, boolean | undefined>>

export type ProtocolsOnDeviceSortKey =
  | "alphabetical"
  | "reverse"
  | "recentRun"
  | "oldRun"
  | "recentCreated"
  | "oldCreated"

export type QuickTransfersOnDeviceSortKey =
  | "alphabetical"
  | "reverse"
  | "recentCreated"
  | "oldCreated"

export interface OnDeviceDisplaySettings {
  sleepMs: number
  brightness: number
  textSize: number
  unfinishedUnboxingFlowRoute: string | null
}

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

export type Overrides = Partial<Config>
