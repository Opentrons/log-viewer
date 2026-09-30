import { clsx } from "clsx"
import * as React from "react"

import { TopPanelItem } from "@/atoms/TopPanelItem"
import { Chip } from "@/components-copy/atoms/Chip"
import { Icon } from "@/components-copy/icons/Icon"
import { I18nContext } from "@/i18n"
import { exportPdf } from "@/redux/logDirectory/logDirectorySlice"
import type { SelectedLogPeriod } from "@/redux/logDirectory/types"
import { useAppDispatch } from "@/redux/store"

import style from "./logperiodtoppanel.module.css"
export interface LogPeriodTopPanelProps {
  logPeriod: SelectedLogPeriod
}

function RobotIdentity(props: { robotName: string; isOk: boolean }): React.ReactNode {
  return props.isOk ? (
    <Chip iconName="identity-known" type="info" text={props.robotName} background hasIcon />
  ) : (
    <Chip iconName="identity-unknown" type="warning" text={props.robotName} background hasIcon />
  )
}

export function LogPeriodTopPanel({ logPeriod }: LogPeriodTopPanelProps): React.ReactNode {
  const { dateFormatter } = React.useContext(I18nContext)
  const dispatch = useAppDispatch()
  return (
    <div className={style.container}>
      <div className={clsx(style.row_container, style.top_row_shade)}>
        <TopPanelItem title="Device">
          <div className={style.chip_container}>
            <RobotIdentity
              robotName={logPeriod.robotId.name}
              isOk={logPeriod.attestationConsistency.status === "consistent"}
            />
          </div>
        </TopPanelItem>
        <TopPanelItem title="Protocol Name">
          <p className={style.card_text}>
            {logPeriod.protocolNames.length > 0 ? logPeriod.protocolNames.join(", ") : "N/A"}
          </p>
        </TopPanelItem>
        <TopPanelItem title="Software Version">
          <p className={style.card_text}>
            {logPeriod.softwareVersions.length > 0
              ? logPeriod.softwareVersions.join(", ")
              : "unknown"}
          </p>
        </TopPanelItem>
        <TopPanelItem title="Associated Files">
          <p className={style.card_text}>{logPeriod.associatedFiles.length}</p>
        </TopPanelItem>
      </div>
      <div className={style.row_container}>
        <TopPanelItem title="Log period start">
          <p className={style.card_text}>{dateFormatter.format(new Date(logPeriod.startDate))}</p>
        </TopPanelItem>
        <TopPanelItem title="Log period end">
          <p className={style.card_text}>{dateFormatter.format(new Date(logPeriod.endDate))}</p>
        </TopPanelItem>
        <TopPanelItem title="Total entries">
          <p className={style.card_text}>{logPeriod.logCount}</p>
        </TopPanelItem>
        <TopPanelItem justify="center">
          <button
            aria-label="Export PDF"
            className={style.visual_button}
            onClick={() => dispatch(exportPdf({ zipPath: logPeriod.filePath }))}
          >
            <div className={style.visual_button_icon_container}>
              <Icon name="download" />
            </div>
            <div className={style.button_text}>Export PDF</div>
          </button>
        </TopPanelItem>
      </div>
    </div>
  )
}
