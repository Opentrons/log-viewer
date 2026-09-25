import * as React from "react"

import { LogDetailHeader } from "@/molecules/LogDetailHeader"
import { LogEnvelopeDetail } from "@/molecules/LogEnvelopeDetail"
import { LogMessageDetail } from "@/molecules/LogMessageDetail"
import { useSelectedLog } from "@/redux/logDirectory/hooks"
import { setSelectedLogLine } from "@/redux/logDirectory/logDirectorySlice"
import { useAppDispatch } from "@/redux/store"
import { useSequentialConsistencyError } from "@/util/useSequentialConsistencyError"

import style from "./logdetailsidebar.module.css"

export interface LogDetailSidebarProps {}

export function LogDetailSidebar(_props: LogDetailSidebarProps): React.ReactNode | null {
  const dispatch = useAppDispatch()
  const selectedLog = useSelectedLog()
  const errorDetails = useSequentialConsistencyError(selectedLog?.sequentialConsistency)
  return selectedLog == null ? null : (
    <div className={style.log_detail_sidebar}>
      <LogDetailHeader onClose={() => dispatch(setSelectedLogLine({ selectedLog: null }))} />
      <div className={style.log_detail_sidebar_contents}>
        <LogMessageDetail payload={selectedLog.payload} errorMessage={errorDetails?.message} />
        <LogEnvelopeDetail envelope={selectedLog.envelope} errorSource={errorDetails?.source} />
      </div>
    </div>
  )
}
