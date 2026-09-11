import { clsx } from "clsx"
import * as React from "react"

import type { StyleProps } from "@/components-copy/primitives/types"

import style from "./skeleton.module.css"
interface SkeletonProps {
  width: StyleProps["width"]
  height: StyleProps["height"]
  //  backgroundSize is the total width to add to every Skeleton in the component which controls the animation speed
  backgroundSize: string
  borderRadius?: StyleProps["borderRadius"]
  fixedBackground?: boolean
}
export function Skeleton(props: SkeletonProps): React.JSX.Element {
  const { width, height, backgroundSize, borderRadius, fixedBackground } = props

  return (
    <div
      style={
        {
          "--background-size": backgroundSize,
          "--border-radius": borderRadius ?? "var(--border-radius-8)",
          width: width,
          height: height,
        } as React.CSSProperties
      }

      className={clsx(style.skeleton, { [style.skeleton_fixed_background]: fixedBackground })}
      role="presentation"
    />
  )
}
