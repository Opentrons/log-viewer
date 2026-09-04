import { clsx } from "clsx"
import * as React from "react"

import { type IconName, Icon } from "../../components-copy/icons/Icon"
import { StyleProps } from "../../components-copy/primitives/types"
/**
 * Note: this is a copy of the Chip component from the monorepo components
 *library. It has been modified to move from styled-components to cssmodules.
 * This has required a bit of surgery. It should be replaced with the real thing
 * as soon as the real thing doesn't use styled-components
 */

import style from "./chip.module.css"

export type ChipType = "error" | "info" | "neutral" | "success" | "warning"

type ChipSize = "medium" | "small"

interface ChipProps extends StyleProps {
  /** Display background color? */
  background?: boolean
  /** Chip icon */
  iconName?: IconName
  /** Chip content */
  text: string
  /** name constant of the text color and the icon color to display */
  type: ChipType
  /** has icon */
  hasIcon?: boolean
  /** Chip size medium is the default size */
  chipSize?: ChipSize
  /** icon should pulse */
  pulseIcon?: boolean
}

const CHIP_PROPS_BY_TYPE: Record<
  ChipType,
  {
    backgroundStyle: string
    iconColor: string
    iconName?: IconName
    textColor: string
  }
> = {
  error: {
    backgroundStyle: style.chip_container_background_error,
    iconColor: style.color_error,
    textColor: style.color_error,
  },
  info: {
    backgroundStyle: style.chip_container_background_info,
    iconColor: style.color_info,
    textColor: style.color_info,
  },
  neutral: {
    backgroundStyle: style.chip_container_background_neutral,
    iconColor: style.color_neutral,
    textColor: style.color_neutral,
  },
  success: {
    backgroundStyle: style.chip_container_background_success,
    iconColor: style.color_success,
    iconName: "ot-check",
    textColor: style.color_success,
  },
  warning: {
    backgroundStyle: style.chip_container_background_warning,
    iconColor: style.color_warning,
    textColor: style.color_warning,
  },
}

export function Chip(props: ChipProps): React.JSX.Element {
  const {
    background,
    iconName,
    type,
    text,
    hasIcon = true,
    chipSize = "medium",
    pulseIcon = false,
    ...styleProps
  } = props
  const chipProps = CHIP_PROPS_BY_TYPE[type]
  const icon = iconName ?? chipProps.iconName ?? "ot-alert"
  const iconColor = chipProps.iconColor
  return (
    <div
      className={clsx(
        style.chip_container_base,
        {
          [style.chip_container_background_none]: background === false,
          [chipProps.backgroundStyle]: background !== false,
        },
        SIZE_STYLE(chipSize, background),
      )}
      data-testid={`Chip_${type}`}
      {...styleProps}
    >
      {hasIcon ? (
        <Icon
          name={icon}
          data-testid={`icon_${text}`}
          className={clsx(ICON_STYLE(chipSize, icon), chipProps.iconColor)}
        >
          {pulseIcon ? (
            <animate
              attributeName="fill"
              values={`${iconColor}; transparent`}
              dur="1s"
              calcMode="discrete"
              repeatCount="indefinite"
              data-testid={`Chip_${type}_icon_animate`}
            />
          ) : null}
        </Icon>
      ) : null}
      <p
        className={clsx(
          {
            [style.text_style_medium]: chipSize === "medium",
            [style.text_style_small]: chipSize !== "medium",
          },
          chipProps.textColor,
        )}
      >
        {text}
      </p>
    </div>
  )
}

const ICON_STYLE = (chipSize: ChipSize, chipName: string): string =>
  chipSize === "small"
    ? chipName === "circle"
      ? style.chip_icon_small_circle
      : chipName === "connection-status"
        ? style.chip_icon_small_connection_status
        : style.chip_icon_small_defaults
    : style.chip_icon_medium

const SIZE_STYLE = (size: string, background?: boolean): string =>
  size === "medium"
    ? background !== false
      ? style.chip_container_medium_background
      : style.chip_container_medium_foreground
    : background !== false
      ? style.chip_container_small_background
      : style.chip_container_small_foreground
