import * as React from "react"

import styles from "./appcontainer.module.css"

export interface AppContainerProps {
  children: React.ReactNode[]
}

export function AppContainer(props: AppContainerProps): React.ReactNode {
  return <div className={styles.app_container}>{...props.children}</div>
}
