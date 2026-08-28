import * as React from "react"

import { SelectWorkingDirectory } from "@/molecules/SelectWorkingDirectory"
import { DirectoryList } from "@/organisms/DirectoryList"

import style from "./workingdirectory.module.css"
export interface WorkingDirectoryProps {
  workingDirectory: string | null
  changeWorkingDirectory: () => void
}
export function WorkingDirectory(props: WorkingDirectoryProps): React.ReactNode {
  return (
    <div className={style.container}>
      <div className={style.header_box}>
        <p className={style.directory_name_label}>Working Directory</p>
        <p className={style.directory_name}>
          {props.workingDirectory == null ? "No directory found" : props.workingDirectory}
        </p>
      </div>
      {props.workingDirectory == null ? (
        <SelectWorkingDirectory changeWorkingDirectory={props.changeWorkingDirectory} />
      ) : (
        <DirectoryList workingDirectory={props.workingDirectory} />
      )}
    </div>
  )
}
