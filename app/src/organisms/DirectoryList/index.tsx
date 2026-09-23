import { clsx } from "clsx"
import * as React from "react"

import { TreeItem } from "@/atoms/TreeItem"
import { I18nContext } from "@/i18n"
import {
  useLogPeriodsForRobot,
  useSelectedLogPeriod,
  useKnownRobots,
} from "@/redux/logDirectory/hooks"
import { setSelectedLogPeriod, loadLogs } from "@/redux/logDirectory/logDirectorySlice"
import { useAppDispatch } from "@/redux/store"

import style from "./directorylist.module.css"

interface LogPeriodPathProps {
  path: string
  dateString: string
  status: "normal" | "warning" | "error"
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
        return isSelected ? Promise.resolve() : dispatch(loadLogs({ zipPath: props.path }))
      }}
      active={isSelected}
      text={<p className={style.tree_item_text}>{props.dateString}</p>}
      status={props.status}
    />
  )
}

interface RobotContainerProps {
  robotName: string
}
function RobotContainer(props: RobotContainerProps): React.ReactNode {
  const periodsForRobot = useLogPeriodsForRobot(props.robotName)
  const [displayed, setDisplayed] = React.useState<boolean>(false)
  const { dateFormatter } = React.useContext(I18nContext)
  return (
    <div className={style.robot_container}>
      <div className={style.robot_name_container}>
        <TreeItem
          text={<p className={style.tree_item_text}>{props.robotName}</p>}
          type={displayed ? "directory-expanded" : "directory-collapsed"}
          onClick={() => setDisplayed(!displayed)}
          status="normal"
        />
      </div>
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
              dateString={dateFormatter.format(new Date(period.endDate))}
              status={
                period.sequentialConsistency.status === "consistent"
                  ? period.attestationConsistency.status === "consistent"
                    ? "normal"
                    : "warning"
                  : "error"
              }
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
  return (
    <div className={style.overall_container}>
      <TreeItem
        text={<p className={style.tree_item_text}>Device</p>}
        type={deviceExpanded ? "directory-expanded" : "directory-collapsed"}
        onClick={() => setDeviceExpanded(!deviceExpanded)}
        status="normal"
      />
      {deviceExpanded
        ? knownRobots.map((robotName) => <RobotContainer robotName={robotName} key={robotName} />)
        : null}
    </div>
  )
}
