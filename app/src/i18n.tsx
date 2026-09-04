import * as React from "react"

export type Formatter = (date: Date) => string

export interface I18NContext {
  dateFormatter: { format: Formatter }
}

export const I18N_DATETIME_SPEC = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  timeZone: "UTC",
  timeZoneName: "short",
  hour: "numeric",
  hour12: false,
  minute: "numeric",
  second: "numeric",
} as const

export const buildFormatter =
  (formatter: Intl.DateTimeFormat): Formatter =>
  (date: Date) =>
    formatter.format(date).replace(/, /, " ")

export const I18nContext = React.createContext<I18NContext>({
  dateFormatter: { format: buildFormatter(new Intl.DateTimeFormat(undefined, I18N_DATETIME_SPEC)) },
})
