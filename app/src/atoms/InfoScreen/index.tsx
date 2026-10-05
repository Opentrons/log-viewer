import * as React from "react"

import { grey60 } from "@/components-copy/helix-design-system/colors"
import { Icon } from "@/components-copy/icons/Icon"

import styles from "./infoscreen.module.css"

export interface InfoScreenProps {
  statusIcon?: React.ComponentProps<typeof Icon>["name"]
  title?: React.ReactNode
  subTitle?: React.ReactNode
}

export function InfoScreen(props: InfoScreenProps): React.ReactNode {
  return (
    <div className={styles.outer_container}>
      {props.statusIcon && (
        <Icon color={grey60} name={props.statusIcon} width="20px" height="20px" />
      )}
      <div className={styles.text_container}>
        {props.title && <h1 className={styles.title}>{props.title}</h1>}
        {props.subTitle && <p className={styles.subtitle}>{props.subTitle}</p>}
      </div>
    </div>
  )
}
