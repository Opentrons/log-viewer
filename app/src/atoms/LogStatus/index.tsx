import * as React from "react"

import { Chip } from "@/components-copy/atoms/Chip"
import type { StyleProps } from "@/components-copy/primitives/types"
export interface LogStatusProps extends StyleProps {
  status: "inconsistent" | "unverified" | "unvalidated" | "consistent"
}

const STATUS_TO_TYPE = {
  unverified: "warning",
  unvalidated: "warning",
  consistent: "success",
  inconsistent: "error",
} as const

const STATUS_TO_ICON = {
  unverified: "error",
  unvalidated: "error",
  inconsistent: "error",
  consistent: "check-circle",
} as const

const STATUS_TO_TEXT = {
  unverified: "Unknown ID",
  unvalidated: "Not checked",
  inconsistent: "Fail",
  consistent: "Pass",
}

export function LogStatus({ status, ...styleProps }: LogStatusProps): React.ReactNode {
  return (
    <Chip
      background
      chipSize="small"
      type={STATUS_TO_TYPE[status]}
      iconName={STATUS_TO_ICON[status]}
      hasIcon
      text={STATUS_TO_TEXT[status]}
      {...styleProps}
    />
  )
}
