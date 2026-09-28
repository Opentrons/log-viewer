import * as React from "react"

import { usePdfDispatch } from "@/redux/pdf-store"
import { useCoalescedData } from "@/redux/pdf/hooks"
import { status } from "@/redux/pdf/pdfSlice"

import { PDFRenderedLog } from "./PDFRenderedLog"

export function PDFContent(): React.ReactNode {
  const dispatch = usePdfDispatch()
  const data = useCoalescedData()
  React.useEffect(() => {
    if (data.status === "error") {
      void dispatch(status({ status: "error", error: "Could not load log data for PDF" }))
    } else if (data.status === "ok") {
      void dispatch(status({ status: "ready" }))
    }
  }, [data, dispatch])
  return data.status === "error" ? (
    <div>Error rendering PDF: Could not load log data</div>
  ) : data.status === "not-loaded" ? (
    <div>Error rendering PDF: log data not loaded</div>
  ) : (
    <PDFRenderedLog data={data} />
  )
}
