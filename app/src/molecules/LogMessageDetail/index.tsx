import * as React from "react"

import { LogDetailItem } from "@/atoms/LogDetailItem"
import { I18nContext } from "@/i18n"
import type { LogLine } from "@/redux/logDirectory/types"

export interface LogMessageDetailProps {
  message: LogLine["payload"]
}

import style from "./logmessagedetail.module.css"

export function LogMessageDetail({ message }: LogMessageDetailProps): React.ReactNode {
  const { dateFormatter } = React.useContext(I18nContext)
  const date = new Date(message.loggedAt)
  // @ts-expect-error: i don't want to talk about it
  const formattedDate = isNaN(date) ? message.loggedAt : dateFormatter.format(date)
  return (
    <div className={style.container}>
      <LogDetailItem title="Timestamp" content={formattedDate} />
      <LogDetailItem title="Action" content={message.action} />
      <LogDetailItem title="User" content={message.userName} />
      <LogDetailItem title="Legal Name" content={message.legalName} />
      <LogDetailItem title="Message" content={message.message} />
      <LogDetailItem title="Reason" content={message.userNote} />
    </div>
  )
}
