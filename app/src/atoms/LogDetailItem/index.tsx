import * as React from "react"

import { Chip } from "@/components-copy/atoms/Chip"
export interface LogDetailItemProps {
  title: string
  content: string
  titleError?: boolean
}

import style from "./logdetailitem.module.css"

export function LogDetailItem({ title, content, titleError }: LogDetailItemProps): React.ReactNode {
  return (
    <div className={style.container}>
      {titleError ? (
        <Chip background={false} chipSize="medium" text={title} type="error" />
      ) : (
        <p className={style.title}>{title}</p>
      )}
      <p className={style.content}>{content}</p>
    </div>
  )
}
