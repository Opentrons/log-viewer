import * as React from "react"

import { MainPageNoWorkingDirectory } from "@/molecules/MainPageNoWorkingDirectory"
import { useWorkingDirectory } from "@/redux/config/hooks"

import style from "./mainwindow.module.css"

export function MainWindow(): React.ReactNode {
  const { current, change } = useWorkingDirectory()
  return (
    <div className={style.container}>
      {current == null && <MainPageNoWorkingDirectory changeWorkingDirectory={change} />}
    </div>
  )
}
