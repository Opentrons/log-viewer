import type { PDFFont } from "pdf-lib"

import { FONTS } from "./constants"
export type AvailableFont = (typeof FONTS)[FontStyle][FontWeight][number]

export type LoadedFonts = Record<AvailableFont, PDFFont>

export type FontStyle = "normal" | "italic"
export type FontWeight = "light" | "regular" | "semi-bold" | "bold"

export interface StringChunk {
  contentSegment: string
  font: PDFFont
}
