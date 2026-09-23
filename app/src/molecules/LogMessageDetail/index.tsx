import * as React from "react"

import { LogDetailItem } from "@/atoms/LogDetailItem"
import { InlineNotification } from "@/components-copy/atoms/InlineNotification"
import { I18nContext } from "@/i18n"
import type { LogLine } from "@/redux/logDirectory/types"

export interface LogMessageDetailProps {
  payload: LogLine["payload"]
  errorMessage?: string | null
}
import style from "./logmessagedetail.module.css"

function LogLineStatusBanner({
  errorMessage,
}: {
  errorMessage?: string | null
}): React.ReactNode | null {
  if (errorMessage == null) {
    return null
  }
  return <InlineNotification type="error" message={errorMessage} />
}

export function LogMessageDetail({
  payload,
  errorMessage,
}: LogMessageDetailProps): React.ReactNode {
  const { dateFormatter } = React.useContext(I18nContext)
  const date = new Date(payload.loggedAt)
  // @ts-expect-error: i don't want to talk about it
  const formattedDate = isNaN(date) ? payload.loggedAt : dateFormatter.format(date)
  return (
    <div className={style.container}>
      <LogLineStatusBanner errorMessage={errorMessage} />
      <LogDetailItem title="Timestamp" content={formattedDate} />
      <LogDetailItem title="Action" content={payload.action} />
      <LogDetailItem title="User" content={payload.userName} />
      <LogDetailItem title="Legal Name" content={payload.legalName} />
      <LogDetailItem title="Reason" content={payload.userNote} />
    </div>
  )
}
