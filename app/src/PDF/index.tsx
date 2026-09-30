import * as React from "react"
import * as ReactRedux from "react-redux"

import { I18N_DATETIME_SPEC, I18nContext, buildFormatter } from "@/i18n"
import { PDFContainer } from "@/organisms/PDFContainer"
import { pdfStore } from "@/redux/pdf-store"
export function PDF(): React.ReactNode {
  console.log("pdf root render")
  return (
    <ReactRedux.Provider store={pdfStore}>
      <I18nContext.Provider
        value={{
          dateFormatter: {
            format: buildFormatter(new Intl.DateTimeFormat(undefined, I18N_DATETIME_SPEC)),
          },
        }}
      >
        <PDFContainer />
      </I18nContext.Provider>
    </ReactRedux.Provider>
  )
}
