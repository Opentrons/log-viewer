import * as React from "react"

import { MenuList } from "@/components-copy/atoms/MenuList"
import { MenuItem } from "@/components-copy/atoms/MenuList/MenuItem"
import { OverflowBtn } from "@/components-copy/atoms/MenuList/OverflowBtn"
import { useOnClickOutside } from "@/components-copy/interaction-enhancers"
import { LogPeriodTopPanel } from "@/molecules/LogPeriodTopPanel"
import { LogEntries } from "@/organisms/LogEntries"
import type { SelectedLogPeriod } from "@/redux/logDirectory/hooks"

import style from "./logperiodoverview.module.css"

export interface LogPeriodOverviewProps {
  logPeriod: SelectedLogPeriod
}

export function LogPeriodOverview(props: LogPeriodOverviewProps): React.ReactNode {
  const [showOverflowMenu, setShowOverflowMenu] = React.useState<boolean>(false)
  const overflowWrapperRef = useOnClickOutside<HTMLDivElement>({
    onClickOutside: () => {
      setShowOverflowMenu(false)
    },
  })
  return (
    <div className={style.container}>
      <div className={style.overflow_button_clipper}>
        <div className={style.overflow_button_container}>
          <OverflowBtn
            onClick={() => {
              setShowOverflowMenu(true)
            }}
          />
        </div>
      </div>
      {showOverflowMenu && (
        <div
          className={style.overflow_menu_container}
          ref={overflowWrapperRef}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          role="presentation"
        >
          <MenuList>
            <MenuItem>View robot ID</MenuItem>
            <MenuItem>Show associated files</MenuItem>
          </MenuList>
        </div>
      )}
      <LogPeriodTopPanel logPeriod={props.logPeriod} />
      <LogEntries logPeriod={props.logPeriod} />
    </div>
  )
}
