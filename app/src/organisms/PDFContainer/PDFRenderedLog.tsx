import * as React from "react"

import type { LoadedCoalescedState } from "@/redux/pdf/hooks"

export interface PDFRenderedLogProps {
  data: LoadedCoalescedState
}

export function PDFRenderedLog(_props: PDFRenderedLogProps): React.ReactNode {
  return <div>This would be a pdf if i wasnt lazy</div>
}
