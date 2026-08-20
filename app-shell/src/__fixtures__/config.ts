import type { ConfigV0 } from "../config/types"

export const MOCK_CONFIG_V0: ConfigV0 = {
  version: 0, // Default key added on boot if missing in configs
  devtools: false,
  reinstallDevtools: false,
  update: {
    automaticallyDownloadUpdates: true,
    channel: "latest",
  },
  log: {
    level: {
      file: "debug",
      console: "info",
    },
  },
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
