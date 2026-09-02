import { clsx } from "clsx"
import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./treeitem.module.css"

export interface TreeItemProps {
  type: "directory-collapsed" | "directory-expanded" | "file" | "folder"
  text: React.ReactNode
  active?: boolean
  onClick?: () => void
}
export function TreeItem(props: TreeItemProps): React.ReactNode {
  const active = props?.active ?? false
  const onClick = props.onClick
  const klass = clsx(style.container, {
    [style.container_active]: active,
    [style.container_inactive]: !active,
  })
  return onClick == null ? (
    <div className={klass}>
      <Contents text={props.text} type={props.type} />
    </div>
  ) : (
    <button onClick={onClick} className={klass}>
      <Contents text={props.text} type={props.type} />
    </button>
  )
}

function Contents({ text, type }: TreeItemProps): React.ReactNode {
  return (
    <>
      <div className={style.icon_alignment_container}>
        <div className={style.icon_container}>
          <Icon name={ICON_LOOKUP[type]} className={style.icon} />
        </div>
      </div>
      <p className={style.text}>{text}</p>
    </>
  )
}

const ICON_LOOKUP = {
  "directory-collapsed": "expandable-unexpanded",
  "directory-expanded": "expandable-expanded",
  file: "file-2",
  folder: "folder-2",
} as const
