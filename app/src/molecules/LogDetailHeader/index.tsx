import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./logdetailheader.module.css"

export interface LogDetailHeaderProps {
  onClose: () => void
}

export function LogDetailHeader({ onClose }: LogDetailHeaderProps): React.ReactNode {
  return (
    <div className={style.log_detail_header_container}>
      <p className={style.log_detail_header_title}>Log Details</p>
      <button className={style.log_detail_header_close_button} onClick={onClose}>
        <Icon name="close" size="32px" />
      </button>
    </div>
  )
}
