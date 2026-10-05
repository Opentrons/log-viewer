import { clsx } from "clsx"
import range from "lodash/range"
import * as React from "react"

import { InfoScreen } from "@/atoms/InfoScreen"
import { LogLine } from "@/atoms/LogLine"
import { Skeleton } from "@/atoms/Skeleton"
import { useFilteredLogs, useSelectedLog, useSelectedLogPeriod } from "@/redux/logDirectory/hooks"
import { setSelectedLogLine } from "@/redux/logDirectory/logDirectorySlice"
import { useAppDispatch } from "@/redux/store"

import style from "./loglines.module.css"

const SKELETON_HEIGHT_PX = 48

export interface LogLinesProps {}

export function LogLines(_props: LogLinesProps): React.ReactNode {
  const logs = useFilteredLogs()
  const containerRef = React.useRef<HTMLDivElement>(null)
  const selectedLogLine = useSelectedLog()
  const dispatch = useAppDispatch()
  const selectedPeriod = useSelectedLogPeriod()
  const [itemCount, setItemCount] = React.useState(0)
  const [shimmerWidth, setShimmerWidth] = React.useState(0)
  React.useEffect(() => {
    const calculateCapacity = () => {
      if (!containerRef.current) {
        return
      }

      const containerHeight = containerRef.current?.clientHeight ?? 0
      const totalItemSpace = SKELETON_HEIGHT_PX + 4
      const fitsCount = Math.floor(containerHeight / totalItemSpace)

      setItemCount(Math.max(1, fitsCount))
      const containerWidth = containerRef.current?.clientWidth ?? 0
      setShimmerWidth(containerWidth * 2)
    }

    // Calculate on mount
    calculateCapacity()

    // Recalculate if the window resizes
    window.addEventListener("resize", calculateCapacity)
    return () => window.removeEventListener("resize", calculateCapacity)
  }, [])
  return (
    <div className={style.outer_container}>
      {logs.status === "loaded" && logs.filteredLines.length === 0 && (
        <InfoScreen
          statusIcon="ot-alert"
          title="No matching log entries found"
          subTitle="Try again"
        />
      )}
      {!(logs.status !== "loaded" || logs.filteredLines.length === 0) && (
        <div className={style.header_container}>
          <p className={clsx(style.column_header, style.column_header_text)}>Timestamp</p>
          <p className={clsx(style.column_header, style.column_header_text)}>Action</p>
          <p className={clsx(style.column_header, style.column_header_text)}>Username</p>
          <p className={clsx(style.column_header, style.column_header_text)}>Legal name</p>
          <p className={clsx(style.column_header_fixed, style.column_header_text)}>Status</p>
        </div>
      )}
      <div className={style.inner_container} ref={containerRef}>
        {["loading", "empty"].includes(logs.status) &&
          range(itemCount).map((index) => (
            <Skeleton
              width="100%"
              height={`${SKELETON_HEIGHT_PX}px`}
              backgroundSize={`${shimmerWidth}px`}
              key={index}
            />
          ))}
        {logs.status === "loaded" &&
          logs.filteredLines.map((logLine) => (
            <LogLine
              log={logLine}
              period={selectedPeriod!}
              key={logLine.id}
              selected={selectedLogLine?.id === logLine.id}
              onClick={() =>
                dispatch(
                  setSelectedLogLine({
                    selectedLog: logLine.id === selectedLogLine?.id ? null : logLine.id,
                  }),
                )
              }
            />
          ))}
      </div>
    </div>
  )
}
