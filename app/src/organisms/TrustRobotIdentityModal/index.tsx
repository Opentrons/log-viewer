import * as NiceModal from "@ebay/nice-modal-react"
import * as React from "react"

import { Modal } from "@/components-copy/modals"
import { RobotIdentityDetails } from "@/molecules/RobotIdentityDetails"
import { blessRobotIdentity } from "@/redux/logDirectory/logDirectorySlice"
import type { RobotId } from "@/redux/logDirectory/types"
import { useAppDispatch } from "@/redux/store"

import styles from "./trustrobotidentitymodal.module.css"
export interface TrustRobotIdentityModalProps {
  robotId: RobotId
  zipPath: string
  viewMode?: boolean
}

export const TrustRobotIdentityModal = NiceModal.create(
  ({ robotId, zipPath, viewMode = false }: TrustRobotIdentityModalProps) => {
    const modal = NiceModal.useModal()
    const dispatch = useAppDispatch()
    return (
      <Modal
        title={
          viewMode
            ? `Robot identity for ${robotId.name}`
            : `Authorize robot identity for ${robotId.name}`
        }
        style={{ width: "32.25rem" }}
        closeOnOutsideClick
        onClose={() => {
          modal.remove()
          modal.reject(new Error("cancelled"))
        }}
        footer={
          <div className={styles.modal_footer_container}>
            {!viewMode && (
              <button
                className={styles.cancel_button}
                onClick={() => {
                  modal.remove()
                  modal.reject(new Error("cancelled"))
                }}
              >
                Cancel
              </button>
            )}
            <button
              className={styles.authorize_button}
              onClick={
                viewMode
                  ? modal.remove
                  : () => {
                      modal.remove()
                      void dispatch(blessRobotIdentity({ zipPath })).then(() =>
                        modal.resolve(robotId),
                      )
                    }
              }
            >
              {viewMode ? "Done" : "Trust this robot"}
            </button>
          </div>
        }
      >
        <div className={styles.modal_content}>
          {!viewMode && (
            <div className={styles.modal_text}>
              <p>
                This is the first log period recorded for this robot. New robots need to be
                authorized as trusted before their logs can be verified.
              </p>
              <br />
              <p>
                Please review the details below and confirm they match <span>{robotId.name}</span>.
              </p>
            </div>
          )}
          <RobotIdentityDetails robotId={robotId} />
        </div>
      </Modal>
    )
  },
)
