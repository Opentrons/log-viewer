import path from "path"

import fontkit from "@pdf-lib/fontkit"
import { PDFDocument, PDFFont } from "pdf-lib"

import { findPeriod, findEntryForPeriod } from "../logDirectory/stateHelpers"
import type { LogChecker } from "../logDirectory/types"
import { verifyPeriodIdentity, verifyMessages } from "../logDirectory/verifiers"
import { embedPdfFonts } from "./fonts"

export async function generatePdf(zipPath: string, logChecker: LogChecker): Promise<PDFDocument> {
  const period = findPeriod(logChecker.state, zipPath)
  const [robot, robotEntry] = findEntryForPeriod(logChecker.state, zipPath)
  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const fonts = await embedPdfFonts(pdfDoc)

  return pdfDoc
}
