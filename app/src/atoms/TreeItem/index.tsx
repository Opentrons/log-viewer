import { clsx } from "clsx"
import * as React from "react"

import { Icon } from "@/components-copy/icons/Icon"

import style from "./treeitem.module.css"

export interface TreeItemProps {
  type: "directory-collapsed" | "directory-expanded" | "file" | "folder"
  text: React.ReactNode
  active?: boolean
  onClick?: () => void
  status: "normal" | "warning" | "error" | React.JSX.Element
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
      <Contents text={props.text} type={props.type} status={props.status} />
    </div>
  ) : (
    <button onClick={onClick} className={klass}>
      <Contents text={props.text} type={props.type} status={props.status} />
    </button>
  )
}

function Contents({ text, type, status }: TreeItemProps): React.ReactNode {
  return (
    <>
      <div className={style.content_container}>
        <div className={style.icon_alignment_container}>
          <div className={style.icon_container}>
            <Icon name={ICON_LOOKUP[type]} className={style.icon} />
          </div>
        </div>
        {text}
      </div>
      {status === "normal" ? null : status === "warning" || status === "error" ? (
        <Icon
          name="error"
          className={clsx(style.status_icon, {
            [style.status_icon_warning]: status === "warning",
            [style.status_icon_error]: status === "error",
          })}
        />
      ) : (
        status
      )}
    </>
  )
}

const ICON_LOOKUP = {
  "directory-collapsed": "expandable-unexpanded",
  "directory-expanded": "expandable-expanded",
  file: "file-2",
  folder: "folder-2",
} as const
