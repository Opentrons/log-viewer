import { clsx } from "clsx"
import type { MouseEventHandler, ReactNode, JSX } from "react"

import { COLORS } from "../helix-design-system"
import { Icon, type IconProps } from "../icons/Icon"
import { SPACING } from "../ui-style-constants"

import styles from "./modalheader.module.css"

export interface ModalHeaderProps {
  title: ReactNode
  onClose?: MouseEventHandler
  titleElement1?: JSX.Element
  titleElement2?: JSX.Element
  tagElement?: JSX.Element
  backgroundColor?: string
  color?: string
  icon?: IconProps
  closeButton?: ReactNode
}

export const ModalHeader = (props: ModalHeaderProps): JSX.Element => {
  const {
    icon,
    onClose,
    title,
    titleElement1,
    titleElement2,
    backgroundColor,
    tagElement,
    color = COLORS.black90,
    closeButton,
  } = props
  return (
    <>
      <div
        className={clsx(styles.styled_modal_header)}
        background-color={backgroundColor}
        data-testid="Modal_header"
        role="heading" // oxlint-disable-line prefer-tag-over-role
        aria-level={1}
      >
        <div className={clsx(styles.header_title_bar)}>
          {icon != null && <Icon {...icon} data-testid="Modal_header_icon" />}
          {titleElement1}
          {titleElement2}
          <p className={clsx(styles.title_text)} color={color}>
            {title}
          </p>
        </div>
        <div className={styles.close_button_container}>
          {tagElement}
          {closeButton != null ||
            (onClose != null && (
              <button
                onClick={onClose}
                className={styles.close_button}
                data-testid={`ModalHeader_icon_close${
                  typeof title === "string" ? `_${title}` : ""
                }`}
              >
                <Icon
                  name="close"
                  width={SPACING.spacing24}
                  height={SPACING.spacing24}
                  color={color}
                />
              </button>
            ))}
        </div>
      </div>
      <div className={styles.divider} data-testid="divider" />
    </>
  )
}
