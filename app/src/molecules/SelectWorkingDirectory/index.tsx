import * as React from "react"

import styles from "./selectworkingdirectory.module.css"
export interface SelectWorkingDirectoryProps {
  changeWorkingDirectory: () => void
}
export function SelectWorkingDirectory(props: SelectWorkingDirectoryProps): React.ReactNode {
  return (
    <button
      aria-label="Select working directory"
      className={styles.select_working_directory_button}
      onClick={props.changeWorkingDirectory}
    >
      <span className={styles.select_working_directory_button_text}>Select a directory</span>
    </button>
  )
}
