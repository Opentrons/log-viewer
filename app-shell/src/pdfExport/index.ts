import { mkdtemp, mkdir, access, constants, rm, rename, writeFile } from "fs/promises"
import path from "path"

import { v4 } from "uuid"

import type { LogChecker } from "../logDirectory/types"
import { generatePdf } from "./pdf-generation"
export const saveToPdf = (
  zipPath: string,
  filePath: string,
  logChecker: LogChecker,
): Promise<void> =>
  access(filePath, constants.F_OK)
    .then(() => mkdtemp(`log-verifier-${v4()}`))
    .then((tmpPath) =>
      generatePdf(zipPath, logChecker)
        .then((pdfContent) => pdfContent.save())
        .then((pdfBytes) => {
          const writePath = path.join(tmpPath, "export.pdf")
          return writeFile(writePath, pdfBytes).then(() => writePath)
        })
        .then((writtenFile) => rename(writtenFile, filePath))
        .finally(() => rm(tmpPath, { recursive: true })),
    )
