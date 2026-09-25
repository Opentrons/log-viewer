import * as React from "react"

import { LogDetailItem } from "@/atoms/LogDetailItem"
import type { LogLine } from "@/redux/logDirectory/types"

export interface LogEnvelopeDetailProps {
  envelope: LogLine["envelope"]
  errorSource?: keyof LogLine["envelope"] | null
}

import style from "./logenvelopedetail.module.css"

export function LogEnvelopeDetail({
  envelope,
  errorSource,
}: LogEnvelopeDetailProps): React.ReactNode {
  return (
    <div className={style.container}>
      <LogDetailItem
        titleError={errorSource === "message_hash"}
        title="Entry Hash"
        content={envelope.message_hash}
      />
      <LogDetailItem
        titleError={errorSource === "message_sig"}
        title="Signature"
        content={envelope.message_sig}
      />
      <LogDetailItem
        titleError={errorSource === "sig_version"}
        title="Signature Version"
        content={envelope.sig_version}
      />
    </div>
  )
}
