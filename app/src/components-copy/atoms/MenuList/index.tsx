import type { MouseEventHandler, ReactNode, JSX } from "react"

import style from "./menulist.module.css"

interface MenuListProps {
  children: ReactNode
  onClick?: MouseEventHandler
}

export const MenuList = (props: MenuListProps): JSX.Element | null => {
  // oxlint-disable-next-line no-unused-vars
  const { children, onClick = null } = props
  return <div className={style.container}>{children}</div>
}
