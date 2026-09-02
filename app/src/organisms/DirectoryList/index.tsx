import { clsx } from "clsx"
import * as React from "react"

import { TreeItem } from "@/atoms/TreeItem"
import {
  useLogPeriodsForRobot,
  useSelectedLogPeriod,
  useKnownRobots,
} from "@/redux/logDirectory/hooks"
import { setSelectedLogPeriod } from "@/redux/logDirectory/logDirectorySlice"
import { useAppDispatch } from "@/redux/store"

import style from "./directorylist.module.css"

interface LogPeriodPathProps {
  path: string
  dateString: string
}
function LogPeriodPath(props: LogPeriodPathProps): React.ReactNode {
  const selectedPeriod = useSelectedLogPeriod()
  const isSelected = selectedPeriod != null && selectedPeriod.filePath === props.path
  const dispatch = useAppDispatch()
  return (
    <TreeItem
      type="file"
      onClick={() => {
        dispatch(setSelectedLogPeriod({ selectedPath: isSelected ? null : props.path }))
      }}
      active={isSelected}
      text={props.dateString}
    />
  )
}

interface RobotContainerProps {
  robotName: string
  dateFormatter: Intl.DateTimeFormat
}
function RobotContainer(props: RobotContainerProps): React.ReactNode {
  const periodsForRobot = useLogPeriodsForRobot(props.robotName)
  const [displayed, setDisplayed] = React.useState<boolean>(false)
  return (
    <div className={style.robot_container}>
      <TreeItem
        text={props.robotName}
        type={displayed ? "directory-expanded" : "directory-collapsed"}
        onClick={() => setDisplayed(!displayed)}
      />
      <div
        className={clsx({
          [style.log_entries_for_robot_container]: displayed,
          [style.log_entries_for_robot_container_hidden]: !displayed,
        })}
      >
        {Object.entries(periodsForRobot).map(([filePath, period]) => {
          return (
            <LogPeriodPath
              path={filePath}
              dateString={props.dateFormatter.format(new Date(period.endDate))}
              key={`${props.robotName}-${filePath}`}
            />
          )
        })}
      </div>
    </div>
  )
}

export function DirectoryList(): React.ReactNode {
  const knownRobots = useKnownRobots()
  const [deviceExpanded, setDeviceExpanded] = React.useState<boolean>(false)
  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone: "UTC",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })

  return (
    <div className={style.overall_container}>
      <TreeItem
        text="Device"
        type={deviceExpanded ? "directory-expanded" : "directory-collapsed"}
        onClick={() => setDeviceExpanded(!deviceExpanded)}
      />
      {deviceExpanded
        ? knownRobots.map((robotName) => (
            <RobotContainer robotName={robotName} key={robotName} dateFormatter={dateFormatter} />
          ))
        : null}
    </div>
  )
}
