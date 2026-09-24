import { clsx } from "clsx"
import type {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  KeyboardEvent,
  KeyboardEventHandler,
} from "react"
import { JSX } from "react"

import type { StyleProps } from "../primitives/types"

import styles from "./modalshell.module.css"

export type Position = "center" | "bottomRight"
export interface ModalShellProps extends StyleProps {
  /** Modal content */
  children: ReactNode
  /** Optional close on outside click **/
  onOutsideClick?: MouseEventHandler
  /** Optional close on escape press **/
  onEscapePress?: KeyboardEventHandler
  /** Optional header */
  header?: ReactNode
  /** Optional footer */
  footer?: ReactNode
  /** Optional full page takeover */
  fullPage?: boolean
  /** Optional zIndex for the overlay */
  zIndexOverlay?: number
  /** Optional position to make the modal appear at the center or bottom right */
  position?: Position
  /** Optional visible overlay */
  showOverlay?: boolean
  /** Optional remove padding */
  noPadding?: boolean
}

/**
 * A ModalShell is a layout component for building more specific modals.
 *
 * It includes:
 * - An overlay
 * - A shell clipped to border-radius (overflow: hidden) so corners stay rounded
 * - A content area that scrolls independently of the header and footer
 * - An optional header
 * - An optional footer
 * - An optional onOutsideClick function
 */
export function ModalShell(props: ModalShellProps): JSX.Element {
  const {
    onOutsideClick,
    zIndex = 10,
    header,
    footer,
    fullPage = false,
    children,
    zIndexOverlay = 1,
    position = "center",
    showOverlay = true,
    noPadding = false,
    onEscapePress,
    ...styleProps
  } = props

  // Keep nested clipping off when a caller opts into overflow: visible
  // (ex, dropdown menus that must extend outside the modal).
  const allowOverflow = styleProps.overflow === "visible" || styleProps.overflowY === "visible"

  return (
    <div // oxlint-disable-line click-events-have-key-events,no-static-element-interactions
      className={clsx(styles.overlay, {
        [styles.overlay_show_background]: showOverlay,
        [styles.overlay_no_background]: !showOverlay,
      })}
      z-index={zIndexOverlay}
      aria-label="BackgroundOverlay_ModalShell"
      onClick={(e: MouseEvent) => {
        e.stopPropagation()
        if (onOutsideClick != null) onOutsideClick(e)
      }}
      onKeyUp={(e: KeyboardEvent) => {
        if (e.key === "Escape" && onEscapePress != null) {
          console.log("handling escape key event")
          onEscapePress(e)
          e.stopPropagation()
        }
      }}
    >
      <div
        className={clsx(styles.content_area, {
          [styles.content_area_center]: position === "center",
          [styles.content_area_end]: position !== "center",
          [styles.content_area_padding]: !noPadding,
        })}
        z-index={zIndex}
      >
        {/* oxlint-disable-next-line no-noninteractive-element-interactions,click-events-have-key-events */}
        <dialog
          aria-label="ModalShell_ModalArea"
          aria-modal="true"
          className={clsx(styles.modal_area, {
            [styles.modal_area_full_page]: fullPage,
            [styles.modal_area_fill]: !fullPage,
          })}
          onClick={(e: MouseEvent) => {
            e.stopPropagation()
          }}

          {...styleProps}
        >
          {header != null ? <div className={styles.header}>{header}</div> : null}
          <div
            className={clsx(styles.modal_body, {
              [styles.modal_body_overflow_visible]: allowOverflow,
              [styles.modal_body_overflow_auto]: !allowOverflow,
            })}
          >
            {children}
          </div>
          {footer != null ? <div className={styles.footer}>{footer}</div> : null}
        </dialog>
      </div>
    </div>
  )
}
