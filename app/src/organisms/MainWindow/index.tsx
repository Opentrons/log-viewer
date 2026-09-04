import * as React from "react"

import { MainPageNoWorkingDirectory } from "@/molecules/MainPageNoWorkingDirectory"
import { NoSelectedLogPeriod } from "@/molecules/NoSelectedLogPeriod"
import { LogPeriodOverview } from "@/organisms/LogPeriodOverview"
import { useWorkingDirectory } from "@/redux/config/hooks"
import { useSelectedLogPeriod } from "@/redux/logDirectory/hooks"

import style from "./mainwindow.module.css"

export function MainWindow(): React.ReactNode {
  const { current, change } = useWorkingDirectory()
  const selectedLogPeriod = useSelectedLogPeriod()
  return (
    <div className={style.container}>
      {current == null ? (
        <MainPageNoWorkingDirectory changeWorkingDirectory={change} />
      ) : selectedLogPeriod == null ? (
        <NoSelectedLogPeriod />
      ) : (
        <LogPeriodOverview logPeriod={selectedLogPeriod} />
      )}
    </div>
  )
}
