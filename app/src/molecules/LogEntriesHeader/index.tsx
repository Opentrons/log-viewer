import * as React from "react"
export interface LogEntriesHeaderProps {}

import { SearchControls } from "@/molecules/SearchControls"

import style from "./logentriesheader.module.css"

export function LogEntriesHeader(_props: LogEntriesHeaderProps): React.ReactNode {
  return (
    <div className={style.container}>
      <p className={style.header}>Log Entries</p>
      <SearchControls />
    </div>
  )
}
