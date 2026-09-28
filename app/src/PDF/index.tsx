import * as React from "react"
import * as ReactRedux from "react-redux"

import { PDFContainer } from "@/organisms/PDFContainer"
import { pdfStore } from "@/redux/pdf-store"
export function PDF(): React.ReactNode {
  console.log("pdf root render")
  return (
    <ReactRedux.Provider store={pdfStore}>
      <PDFContainer />
    </ReactRedux.Provider>
  )
}
