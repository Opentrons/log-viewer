import * as React from "react"

import type { StyleProps } from "../../primitives/types"

import style from "./menuitem.module.css"

interface ButtonProps extends StyleProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
}

export function MenuItem(props: ButtonProps): React.ReactNode {
  const { children, onClick, ...styleProps } = props
  return (
    <button className={style.container} {...styleProps} onClick={onClick}>
      {children}
    </button>
  )
}
