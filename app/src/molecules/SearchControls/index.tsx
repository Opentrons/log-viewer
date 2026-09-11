import * as React from "react"

import { SearchBar } from "@/atoms/SearchBar"
import { Icon } from "@/components-copy/icons/Icon"
import { useFilteredLogs } from "@/redux/logDirectory/hooks"
import { setLogFilter } from "@/redux/logDirectory/logDirectorySlice"
import { useAppDispatch } from "@/redux/store"

import style from "./searchcontrols.module.css"
export interface SearchControlsProps {}

export function SearchControls(_props: SearchControlsProps): React.ReactNode {
  const dispatch = useAppDispatch()
  const filteredLogs = useFilteredLogs()
  const [filterText, setFilterText] = React.useState<string>("")
  const matches =
    filteredLogs.status === "loaded"
      ? { index: filteredLogs.filteredLines.length, count: filteredLogs.lines.length }
      : { index: 0, count: 0 }
  return (
    <div className={style.container}>
      <SearchBar
        placeholderText="Search log entries..."
        onSearch={(text) => {
          dispatch(setLogFilter({ filterText: text }))
          setFilterText(text ?? "")
        }}
        match={matches}
        currentText={filterText}
      />
      <button
        className={style.controls}
        onClick={() => {
          setFilterText("")
          dispatch(setLogFilter({ filterText: null }))
        }}
      >
        <div className={style.icon_container}>
          <Icon className={style.icon} name="close" />
        </div>
      </button>
    </div>
  )
}
