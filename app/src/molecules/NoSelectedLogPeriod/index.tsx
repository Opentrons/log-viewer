import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./noselectedlogperiod.module.css"
export function NoSelectedLogPeriod(): React.ReactNode {
  return (
    <div className={style.content_container}>
      <div className={style.icon_container}>
        <Icon name="error" />
      </div>
      <div className={style.text_container}>
        <p className={style.headertext}>No log period selected</p>
        <p className={style.subtext}>Select a log period to view its log entries</p>
      </div>
    </div>
  )
}
