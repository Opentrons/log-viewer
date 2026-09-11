import { clsx } from "clsx"
import * as React from "react"

import { LogStatus } from "@/atoms/LogStatus"
import { I18nContext } from "@/i18n"
import type { LogLine } from "@/redux/logDirectory/types"

import style from "./logline.module.css"
export interface LogLineProps {
  log: LogLine["payload"]
  onClick: () => void
  selected: boolean
}

export function LogLine({ log, selected, onClick }: LogLineProps): React.ReactNode {
  const { dateFormatter } = React.useContext(I18nContext)
  const date = new Date(log.loggedAt)
  // @ts-expect-error: i don't want to talk about it
  const formattedDate = isNaN(date) ? log.loggedAt : dateFormatter.format(date)
  return (
    <button
      onClick={onClick}
      className={clsx(style.container, {
        [style.container_unselected]: !selected,
        [style.container_selected]: selected,
      })}
    >
      <p className={clsx(style.log_field, style.text_field)}>{formattedDate}</p>
      <p className={clsx(style.log_field, style.text_field)}>{log.action}</p>
      <p className={clsx(style.log_field, style.text_field)}>{log.userName}</p>
      <p className={clsx(style.log_field, style.text_field)}>{log.legalName}</p>
      <div className={style.log_field}>
        <LogStatus status="unverified" />
      </div>
    </button>
  )
}
