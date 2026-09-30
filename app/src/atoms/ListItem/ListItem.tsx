import clsx from "clsx"

import style from "./listitem.module.css"

export function ListItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={clsx(style.container, className)}>{children}</div>
}
