import { clsx } from "clsx"
import type { MouseEventHandler, JSX, ComponentProps } from "react"

import { COLORS } from "../../helix-design-system"
import { Icon } from "../../icons/Icon"
import type { StyleProps } from "../../primitives/types"

import styles from "./inlinenotification.module.css"

type InlineNotificationType = "alert" | "error" | "neutral" | "success"

export interface InlineNotificationProps extends StyleProps {
  /** name constant of the icon to display */
  type: InlineNotificationType
  /** InlineNotification contents */
  heading?: string
  message?: string
  /** Optional dynamic width based on contents */
  hug?: boolean
  /** optional handler to show close button/clear alert  */
  onCloseClick?: (() => unknown) | MouseEventHandler<HTMLButtonElement>
  linkText?: string
  onLinkClick?: (() => unknown) | MouseEventHandler<HTMLAnchorElement>

  className?: string
}

const INLINE_NOTIFICATION_PROPS_BY_TYPE: Record<
  InlineNotificationType,
  ComponentProps<typeof Icon>
> = {
  alert: {
    name: "ot-alert",
    color: COLORS.yellow60,
  },
  error: {
    name: "ot-alert",
    color: COLORS.red60,
  },
  neutral: {
    name: "information",
    color: COLORS.blue60,
  },
  success: {
    name: "ot-check",
    color: COLORS.green60,
  },
}

export function InlineNotification(props: InlineNotificationProps): JSX.Element {
  const {
    heading,
    hug = false,
    onCloseClick,
    message,
    type,
    linkText,
    onLinkClick,
    className,
  } = props
  // TODO (sb: 8/20/25) RSQ-189 Remove punctuation from this component and add to translation strings
  // Temp fix (nd: 2/25/26): Avoid double-period for translations that already end in a period.
  const doesMessageEndInPeriod = message?.trim().match(/\.$/) ?? false
  const fullHeading = `${heading}${message && !doesMessageEndInPeriod ? ". " : ""}`
  const fullMessage = `${message}${doesMessageEndInPeriod ? "" : "."}`
  const inlineNotificationProps = INLINE_NOTIFICATION_PROPS_BY_TYPE[type]
  const iconProps = {
    ...inlineNotificationProps,
    size: "100%",
  }

  return (
    <div
      data-testid={`InlineNotification_${type}`}
      className={clsx(
        styles.wrapper,
        {
          [styles.wrapper_hug]: hug,
          [styles.wrapper_fixed]: !hug,
          [styles.wrapper_alert]: type === "alert",
          [styles.wrapper_error]: type === "error",
          [styles.wrapper_neutral]: type === "neutral",
          [styles.wrapper_success]: type === "success",
        },
        className,
      )}
    >
      <div className={styles.icon_message_container}>
        <div className={styles.icon_container}>
          <Icon {...iconProps} aria-label={`icon_${type}`} />
        </div>
        <div className={styles.text_container}>
          <p className={styles.text}>
            {heading != null && (
              <>
                <span className={styles.text_heading}>{fullHeading}</span>
                {/* this break is because the desktop wants this on two lines, but also wants/
                  inline text layout on ODD. Soooo here you go */}
                <br />
              </>
            )}
            {message != null && fullMessage}
          </p>
        </div>
      </div>
      <div className={styles.link_button_container}>
        {linkText && (
          /* oxlint-disable anchor-is-valid */
          <a
            href="#"
            aria-label="View notification details"
            className={styles.link_text}
            onClick={onLinkClick}
          >
            {linkText}
          </a>
        )}
        {onCloseClick && (
          <button onClick={onCloseClick} className={styles.button}>
            <Icon aria-label="close_icon" name="close" />
          </button>
        )}
      </div>
    </div>
  )
}
