import Store from "electron-store"
import get from "lodash/get"
import mergeOptions from "merge-options"
// app configuration and settings
import type * as Winston from "winston"
import yargsParser from "yargs-parser"

import { createLogger } from "../log"
import { DEFAULTS_V0, migrate } from "./migrate"
import type { Config, ConfigV0, Overrides } from "./types"

// make sure all arguments are included in production
const argv = process.argv0.endsWith("defaultApp") ? process.argv.slice(2) : process.argv.slice(1)

const PARSE_ARGS_OPTS = {
  envPrefix: "LOG_VIEWER",
  configuration: {
    "negation-prefix": "disable_",
  },
}

// lazy load store, overrides, and log because of config/log interdependency
let _store: Store<Config>
let _over: Overrides | undefined
let _log: Winston.Logger | undefined

const store = (): Store<Config> => {
  if (_store == null) {
    // perform store migration if loading for the first time
    _store = new Store({ defaults: DEFAULTS_V0 }) as unknown as Store<Config>
    _store.store = migrate(_store.store as unknown as ConfigV0)
  }
  return _store
}

const overrides = (): Overrides => {
  return _over ?? (_over = yargsParser(argv, PARSE_ARGS_OPTS) as Overrides)
}

const log = (): Winston.Logger => _log ?? (_log = createLogger("config"))

export function getStore(): Config {
  return store().store
}

export function getOverrides(): Overrides
export function getOverrides<K extends keyof Config>(key: K): Overrides[K]
export function getOverrides<K extends keyof Config>(key?: K): Overrides | Overrides[K] {
  return key != null ? get(overrides(), key) : overrides()
}

export function getConfig(): Config
export function getConfig<K extends keyof Config>(key: K): Config[K]
export function getConfig<K extends keyof Config>(key?: K): Config[K] | Config {
  const result = key == null ? store().store : store().get(key)
  // @ts-expect-error(sf): one step closer, but dont understand how to get ts to accept
  // that this matches the first signature of getOverrides if key is undefined
  const over = getOverrides(key)

  if (over != null) {
    return mergeOptions(result, over)
  }

  return result
}

export function handleConfigChange(
  path: string,
  changeHandler: (newValue: any, oldValue: any) => unknown,
): void {
  // @ts-expect-error(sf): electron-store doesnt export the type needed for this
  store().onDidChange(path, (newValue: any, oldValue: any) => {
    log().info(`Config change: ${path} ${oldValue}=>${newValue}`)
    return changeHandler(newValue, oldValue)
  })
}
