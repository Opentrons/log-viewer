import * as NiceModal from "@ebay/nice-modal-react"
import countBy from "lodash/countBy"
import * as React from "react"

import { InlineNotification } from "@/components-copy/atoms/InlineNotification"
import { LogPeriodTopPanel } from "@/molecules/LogPeriodTopPanel"
import { LogEntries } from "@/organisms/LogEntries"
import { TrustRobotIdentityModal } from "@/organisms/TrustRobotIdentityModal"
import { useFilteredLogs } from "@/redux/logDirectory/hooks"
import type { SelectedLogPeriod } from "@/redux/logDirectory/types"

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
    return {
      type: "alert",
      message: "Robot identity is unknown",
      linkText: "Authorize robot identity",
      onLinkClick: () => {
        void NiceModal.show(TrustRobotIdentityModal, {
          robotId: logPeriod.robotId,
          zipPath: logPeriod.filePath,
        })
      },
    }
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
  return (
    <div className={style.outer_container}>
      <LogPeriodStatusBanner logPeriod={logPeriod} />
      <div className={style.container}>
        <LogPeriodTopPanel logPeriod={logPeriod} />
        <LogEntries logPeriod={logPeriod} />
      </div>
    </div>
  )
}
