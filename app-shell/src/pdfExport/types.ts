import type { Font } from "fontkit"

import { FONTS } from "./constants"
export type AvailableFont = (typeof FONTS)[FontStyle][number]

export type LoadedFonts = Record<AvailableFont, Font>

export type FontStyle = "normal" | "italic"

export interface StringChunk {
  contentSegment: string
  font: PDFFont
}
