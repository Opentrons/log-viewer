// create logger function
import path from "path"
import { inspect } from "util"

import dateFormat from "dateformat"
import { app } from "electron"
import fse from "fs-extra"
import winston from "winston"
import type * as Transport from "winston-transport"

import { getConfig } from "./config"

export const LOG_DIR = path.join(app.getPath("userData"), "logs")
const ERROR_LOG = path.join(LOG_DIR, "error.log")
const COMBINED_LOG = path.join(LOG_DIR, "combined.log")
const FILE_OPTIONS = {
  // JSON logs
  format: winston.format.json(),
  // 1 MB max log file size (to ensure emailablity)
  maxsize: 1024 * 1024,
  // keep 10 backups at most
  maxFiles: 10,
  // roll filenames in accending order (larger the number, older the log)
  tailable: true,
}

let log: winston.Logger | undefined
let transports: Transport[] | undefined

export function createLogger(label: string): winston.Logger {
  if (transports === undefined) {
    transports = initializeTransports()
  }
  return createWinstonLogger(label, transports)
}

function _erroringEnsureDirSync(dir: string): Error | null {
  try {
    fse.ensureDirSync(dir)
  } catch (e: unknown) {
    return e as Error
  }
  return null
}

function initializeTransports(): Transport[] {
  const maybeError = _erroringEnsureDirSync(LOG_DIR)

  const createdTransports = createTransports()
  log = createWinstonLogger("log", createdTransports)

  if (maybeError != null) {
    log.error("Could not create log directory", { error: maybeError })
  }
  const config = getConfig("log")
  log.info(`Level "error" and higher logging to ${ERROR_LOG}`)
  log.info(`Level "${config.level.file}" and higher logging to ${COMBINED_LOG}`)
  log.info(`Level "${config.level.console}" and higher logging to console`)
  return createdTransports
}

function createTransports(): Transport[] {
  const timeFromStamp = (ts: string): string => dateFormat(new Date(ts), "HH:MM:ss.l")
  const config = getConfig("log")
  return [
    // error file log
    new winston.transports.File(
      Object.assign(
        {
          level: "error",
          filename: ERROR_LOG,
        },
        FILE_OPTIONS,
      ),
    ),

    // regular combined file log
    new winston.transports.File(
      Object.assign(
        {
          level: config.level.file,
          filename: COMBINED_LOG,
        },
        FILE_OPTIONS,
      ),
    ),

    // console log
    new winston.transports.Console({
      level: config.level.console,
      format: winston.format.combine(
        winston.format.printf((info) => {
          const { level, message, timestamp, label } = info
          const time = timeFromStamp(timestamp as string)
          const print = `${time} [${label as string}] ${level}: ${message as string}`
          const meta = inspect(info.meta, { depth: 6 })

          if (meta !== "{}") return `${print} ${meta}`

          return print
        }),
      ),
    }),
  ]
}

function createWinstonLogger(label: string, useTransports: Transport[]): winston.Logger {
  if (log !== undefined) {
    log.debug(`Creating winston logger for ${label}`)
  }

  const formats = [
    winston.format.label({ label }),
    winston.format.timestamp(),
    winston.format.metadata({
      key: "meta",
      fillExcept: ["level", "message", "timestamp", "label"],
    }),
  ]

  return winston.createLogger({
    transports: useTransports,
    format: winston.format.combine(...formats),
  })
}
