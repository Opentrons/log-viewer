import * as React from "react"

import { LogPeriodTopPanel } from "@/molecules/LogPeriodTopPanel"
import type { SelectedLogPeriod } from "@/redux/logDirectory/hooks"

import style from "./logperiodoverview.module.css"

export interface LogPeriodOverviewProps {
  logPeriod: SelectedLogPeriod
}

export function LogPeriodOverview(props: LogPeriodOverviewProps): React.ReactNode {
  return (
    <div className={style.container}>
      <LogPeriodTopPanel logPeriod={props.logPeriod} />
      <p>Log period content yay</p>
    </div>
  )
}
