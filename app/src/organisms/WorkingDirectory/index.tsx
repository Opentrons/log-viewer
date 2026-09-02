import * as React from "react"

import { TreeItem } from "@/atoms/TreeItem"
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
        {props.workingDirectory == null ? (
          <p className={style.directory_name}>'No directory found'</p>
        ) : (
          <TreeItem type="folder" text={props.workingDirectory} />
        )}
      </div>
      {props.workingDirectory == null ? (
        <SelectWorkingDirectory changeWorkingDirectory={props.changeWorkingDirectory} />
      ) : (
        <DirectoryList />
      )}
    </div>
  )
}
