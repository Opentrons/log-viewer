import * as NiceModal from "@ebay/nice-modal-react"
import * as React from "react"

import { Modal } from "@/components-copy/modals"
import { RobotIdentityDetails } from "@/molecules/RobotIdentityDetails"
import type { RobotId } from "@/redux/logDirectory/types"

import styles from "./viewrobotidentitymodal.module.css"
export interface ViewRobotIdentityModalProps {
  robotId: RobotId
  source: string
}

export const ViewRobotIdentityModal = NiceModal.create(
  ({ robotId, source }: ViewRobotIdentityModalProps) => {
    const modal = NiceModal.useModal()
    return (
      <Modal
        title={`Robot identity for ${robotId.name}`}
        style={{ width: "32.25rem" }}
        closeOnOutsideClick
        onClose={modal.remove}
        footer={
          <div className={styles.modal_footer_container}>
            <button className={styles.done_button} onClick={modal.remove}>
              Done
            </button>
          </div>
        }
      >
        <div className={styles.modal_content}>
          <RobotIdentityDetails robotId={robotId} source={source} />
        </div>
      </Modal>
    )
  },
)
