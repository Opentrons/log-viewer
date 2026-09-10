import * as React from "react"

import { LogEntriesHeader } from "@/molecules/LogEntriesHeader"
import { LogLines } from "@/molecules/LogLines"
import type { SelectedLogPeriod } from "@/redux/logDirectory/hooks"

import style from "./logentries.module.css"
export interface LogEntriesProps {
  logPeriod: SelectedLogPeriod
}

export function LogEntries(_props: LogEntriesProps): React.ReactNode {
  return (
    <div className={style.container}>
      <LogEntriesHeader />
      <LogLines />
    </div>
  )
}
