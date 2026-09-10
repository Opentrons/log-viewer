import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./searchbar.module.css"
export interface SearchBarProps {
  onSearch: (text: string | null) => void
  placeholderText: string
  match: { count: number; index: number } | null
  currentText: string
}

export function SearchBar({
  currentText,
  match,
  placeholderText,
  onSearch,
}: SearchBarProps): React.ReactNode {
  return (
    <search className={style.outer_container}>
      <div className={style.search_bar_container}>
        <div className={style.icon_container}>
          <Icon className={style.icon} name="lens" />
        </div>
        <input
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onSearch(event.target.value)
          }}
          placeholder={placeholderText}
          className={style.search_bar}
          value={currentText}
          type="search"
          id="search-logs"
          name="Search Logs"
        />
      </div>
      {match != null && <p className={style.match_text}>{`${match.index}/${match.count}`}</p>}
    </search>
  )
}
