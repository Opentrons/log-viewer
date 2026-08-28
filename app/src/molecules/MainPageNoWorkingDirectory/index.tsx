import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./mainpagenoworkingdirectory.module.css"

export interface MainPageNoWorkingDirectoryProps {
  changeWorkingDirectory: () => void
}

export function MainPageNoWorkingDirectory(
  props: MainPageNoWorkingDirectoryProps,
): React.ReactNode {
  return (
    <div className={style.outer_container}>
      <button
        aria-label="Select working directory"
        className={style.inner_container}
        type="button"
        onClick={props.changeWorkingDirectory}
      >
        <Icon name="folder" width="24px" />

        <div className={style.caption_container}>
          <p className={style.button_label_text}>
            Select a directory containing the log entries you want to view and verify.
          </p>
        </div>
      </button>
    </div>
  )
}
