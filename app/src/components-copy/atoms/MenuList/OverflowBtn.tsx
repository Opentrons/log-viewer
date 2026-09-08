import { forwardRef } from "react"
import type { ComponentProps } from "react"

import { Btn } from "../../primitives/Btn"

import style from "./overflowbtn.module.css"

interface OverflowBtnProps extends ComponentProps<typeof Btn> {
  fillColor?: string
}

export const OverflowBtn = forwardRef<HTMLButtonElement, OverflowBtnProps>(
  (props: OverflowBtnProps, ref) => {
    const { fillColor, ...restProps } = props
    return (
      <Btn className={style.btn_extra_css} {...restProps} ref={ref}>
        <svg
          width="19"
          height="31"
          viewBox="0 0 19 31"
          fill={fillColor ?? "#737578" /* COLORS.grey50 */}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="9.5" cy="9.5" r="1.5" />
          <circle cx="9.5" cy="15.5" r="1.5" />
          <circle cx="9.5" cy="21.5" r="1.5" />
        </svg>
      </Btn>
    )
  },
)
