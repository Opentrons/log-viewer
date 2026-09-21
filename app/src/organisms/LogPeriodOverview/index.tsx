import countBy from "lodash/countBy"
import * as React from "react"

import { InlineNotification } from "@/components-copy/atoms/InlineNotification"
import { MenuList } from "@/components-copy/atoms/MenuList"
import { MenuItem } from "@/components-copy/atoms/MenuList/MenuItem"
import { OverflowBtn } from "@/components-copy/atoms/MenuList/OverflowBtn"
import { useOnClickOutside } from "@/components-copy/interaction-enhancers"
import { LogPeriodTopPanel } from "@/molecules/LogPeriodTopPanel"
import { LogEntries } from "@/organisms/LogEntries"
import type { SelectedLogPeriod } from "@/redux/logDirectory/hooks"
import { useFilteredLogs } from "@/redux/logDirectory/hooks"

import style from "./logperiodoverview.module.css"

export interface LogPeriodOverviewProps {
  logPeriod: SelectedLogPeriod
}

const bannerPropsFromConsistency = (
  logPeriod: SelectedLogPeriod,
): React.ComponentProps<typeof InlineNotification> | null => {
  const logLines = useFilteredLogs()
  if ((logPeriod?.sequentialConsistency?.status ?? "unverified") === "unverified") {
    return null
  }

  if (logPeriod.sequentialConsistency.status !== "consistent") {
    const errorCount =
      logLines.status === "loaded"
        ? logLines.lines.length -
          countBy(logLines.lines, (line) => line.sequentialConsistency.status)["consistent"]
        : 0
    return {
      type: "error",
      message: `${errorCount} ${errorCount === 1 ? "issue" : "issues"} detected`,
    }
  } else if (logPeriod.attestationConsistency.status !== "consistent") {
    return { type: "alert", message: "Robot identity is unknown" }
  } else {
    return { type: "success", message: "All log entries verified" }
  }
}

function LogPeriodStatusBanner({ logPeriod }: LogPeriodOverviewProps): React.ReactNode | null {
  const notificationProps = bannerPropsFromConsistency(logPeriod)

  return notificationProps == null ? null : (
    <div className={style.banner_container}>
      <InlineNotification {...notificationProps} />
    </div>
  )
}

export function LogPeriodOverview({ logPeriod }: LogPeriodOverviewProps): React.ReactNode {
  const [showOverflowMenu, setShowOverflowMenu] = React.useState<boolean>(false)
  const overflowWrapperRef = useOnClickOutside<HTMLDivElement>({
    onClickOutside: () => {
      setShowOverflowMenu(false)
    },
  })
  return (
    <div className={style.outer_container}>
      <LogPeriodStatusBanner logPeriod={logPeriod} />
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
        <LogPeriodTopPanel logPeriod={logPeriod} />
        <LogEntries logPeriod={logPeriod} />
      </div>
    </div>
  )
}
