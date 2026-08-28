import * as React from "react"

import { FileSidebarHeader } from "@/molecules/FileSidebarHeader"
import { WorkingDirectory } from "@/organisms/WorkingDirectory"
import { useWorkingDirectory } from "@/redux/config/hooks"

import style from "./filesidebar.module.css"
export interface FileSidebarProps {}
export function FileSidebar(_props: FileSidebarProps): React.ReactNode {
  const { current, change } = useWorkingDirectory()
  return (
    <div className={style.file_sidebar}>
      <FileSidebarHeader changeWorkingDirectory={change} />
      <WorkingDirectory workingDirectory={current} changeWorkingDirectory={change} />
    </div>
  )
}
