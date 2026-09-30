import NiceModal from "@ebay/nice-modal-react"

import { ListItem } from "@/atoms/ListItem/ListItem"
import { Icon } from "@/components-copy/icons/Icon"
import { Modal } from "@/components-copy/modals"
import { SelectedLogPeriod } from "@/redux/logDirectory/types"
import { api } from "@/remote/api"

import styles from "./associatedfilesmodal.module.css"

export const AssociatedFilesModal = NiceModal.create(
  ({ logPeriod }: { logPeriod: SelectedLogPeriod }) => {
    const modal = NiceModal.useModal()
    const { associatedFiles } = logPeriod

    const onOpenFile = (fileName: string) => () => {
      api.openFile({ logPath: logPeriod.filePath, fileName }).catch((error) => {
        console.error(error)
      })
    }

    return (
      <Modal
        title="Associated files for log period"
        className={styles.associated_files_modal}
        closeOnOutsideClick
        onClose={() => {
          modal.remove()
        }}

        footer={
          <div className={styles.modal_footer_container}>
            <button className={styles.done_button} onClick={modal.remove}>
              Done
            </button>
          </div>
        }
      >
        <div className={styles.associated_files_list}>
          <div className={styles.list_item_header}>
            <div className={styles.list_item_header_label}>File type</div>
            <div className={styles.list_item_header_label}>File name</div>
          </div>
          {associatedFiles.map((file) => (
            <ListItem key={file} className={styles.list_item}>
              <div className={styles.list_item_left}>
                <div className={styles.list_item_label}>Run log</div>
                <div className={styles.list_item_value}>{file}</div>
              </div>
              <button className={styles.list_item_button} onClick={onOpenFile(file)}>
                <Icon name="open-in-new" width={14.167} height={14.167} />
                Open file
              </button>
            </ListItem>
          ))}
          <ListItem className={styles.list_item}>
            <div className={styles.list_item_left}>
              <div className={styles.list_item_label}>Audit logs</div>
              <div className={styles.list_item_value}>log_period.json</div>
            </div>
            <button className={styles.list_item_button} onClick={onOpenFile("log_period.json")}>
              <Icon name="open-in-new" width={14.167} height={14.167} />
              Open file
            </button>
          </ListItem>
        </div>
      </Modal>
    )
  },
)
