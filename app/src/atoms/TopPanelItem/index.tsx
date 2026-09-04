import { clsx } from "clsx"
import * as React from "react"
export interface TopPanelItemProps {
  title?: string
  justify?: "top" | "center"
  children: React.ReactNode
}
import style from "./toppanelitem.module.css"
export function TopPanelItem({ title, children, justify }: TopPanelItemProps): React.ReactNode {
  return (
    <div
      className={clsx(style.container, {
        [style.justify_flex_start]: (justify ?? "top") === "top",
        [style.justify_center]: (justify ?? "top") === "center",
      })}
    >
      {title != null && <p className={style.title_text}>{title}</p>}
      {children}
    </div>
  )
}
