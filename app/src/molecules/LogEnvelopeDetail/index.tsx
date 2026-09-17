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
      <LogDetailItem title="Entry Hash" content={envelope.message_hash} />
      <LogDetailItem title="Signature" content={envelope.message_sig} />
      <LogDetailItem title="Signature Version" content={envelope.sig_version} />
    </div>
  )
}
