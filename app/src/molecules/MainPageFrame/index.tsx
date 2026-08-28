import * as React from "react"

export interface MainPageFrameProps {
  children: React.ReactNode[]
}
export function MainPageFrame(props: MainPageFrameProps): React.ReactNode {
  return <div>{...props.children}</div>
}
