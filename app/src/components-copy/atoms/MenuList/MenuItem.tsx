import * as React from "react"

import type { StyleProps } from "../../primitives/types"

import style from "./menuitem.module.css"

interface ButtonProps extends StyleProps {
  children: React.ReactNode
}

export function MenuItem(props: ButtonProps): React.ReactNode {
  const { children, ...styleProps } = props
  return (
    <div className={style.container} {...styleProps}>
      {children}
    </div>
  )
}
