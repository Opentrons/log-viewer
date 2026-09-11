import * as React from "react"

export interface LogDetailItemProps {
  title: string
  content: string
}

import style from "./logdetailitem.module.css"

export function LogDetailItem({ title, content }: LogDetailItemProps): React.ReactNode {
  return (
    <div className={style.container}>
      <p className={style.title}>{title}</p>
      <p className={style.content}>{content}</p>
    </div>
  )
}
