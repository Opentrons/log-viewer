import * as React from "react"

import { LogDetailItem } from "@/atoms/LogDetailItem"
import type { LogLine } from "@/redux/logDirectory/types"

export interface LogEnvelopeDetailProps {
  envelope: LogLine["envelope"]
}

import style from "./logenvelopedetail.module.css"

export function LogEnvelopeDetail({ envelope }: LogEnvelopeDetailProps): React.ReactNode {
  return (
    <div className={style.container}>
      <LogDetailItem title="Entry Hash" content={envelope.messageHash} />
      <LogDetailItem title="Signature" content={envelope.messageSignature} />
      <LogDetailItem title="Signature Version" content={envelope.signatureVersion} />
    </div>
  )
}
