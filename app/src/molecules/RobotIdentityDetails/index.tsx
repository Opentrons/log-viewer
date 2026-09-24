import { clsx } from "clsx"
import * as React from "react"

import type { RobotIdPayload } from "@/redux/logDirectory/types"

import styles from "./robotidentitydetails.module.css"
export interface RobotIdentityDetailsProps<TRobotId extends RobotIdPayload> {
  robotId: TRobotId
}

function IdentityDetail({ title, content }: { title: string; content: string }): React.ReactNode {
  return (
    <div className={styles.content_row_container}>
      <p className={clsx(styles.column_element, styles.content_title)}>{title}</p>
      <p className={clsx(styles.column_element, styles.content_payload)}>{content}</p>
    </div>
  )
}

export function RobotIdentityDetails<TRobotId extends RobotIdPayload>({
  robotId,
}: RobotIdentityDetailsProps<TRobotId>): React.ReactNode {
  return (
    <div className={styles.container}>
      <p className={styles.title_container}>Robot details</p>
      <div className={styles.rows_container}>
        <IdentityDetail title="Robot name" content={robotId.name} />
        <IdentityDetail title="Serial number" content={robotId.serial} />
        <IdentityDetail title="Certificate" content={robotId.publicKeyHash} />
      </div>
    </div>
  )
}
