import * as React from "react"

import { usePdfDispatch } from "@/redux/pdf-store"
import { status, loadLines, loadMetadata } from "@/redux/pdf/pdfSlice"
import { useZipPathFromUrl } from "@/util/useZipPathFromUrl"

import { PDFContent } from "./PDFContent"

export function PDFContainer(): React.ReactNode {
  const zipPath = useZipPathFromUrl()
  const dispatch = usePdfDispatch()
  React.useEffect(() => {
    if (zipPath == null) {
      console.log("status dispatch error dispatch")
      void dispatch(status({ status: "error", error: "No log period path was provided" }))
    } else {
      console.log(`running generation because path is ${zipPath}`)
      void dispatch(status({ status: "not-ready" }))
      void dispatch(loadLines({ zipPath }))
      void dispatch(loadMetadata({ zipPath }))
    }
  }, [zipPath, dispatch])

  return zipPath == null ? <div>No log period was selected for PDF export.</div> : <PDFContent />
}
