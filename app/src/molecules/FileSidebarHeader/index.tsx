import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./filesidebarheader.module.css"
export interface FileSidebarHeaderProps {
  changeWorkingDirectory: () => void
}
export function FileSidebarHeader({
  changeWorkingDirectory,
}: FileSidebarHeaderProps): React.ReactNode {
  return (
    <div className={style.container}>
      <span className={style.app_name_text}>Log Verifier</span>
      <button
        type="button"
        className={style.select_working_directory_button}
        onClick={changeWorkingDirectory}
        aria-label="Select working directory"
      >
        <Icon name="plus" size="100%" backgroundColor="white" />
      </button>
    </div>
  )
}
