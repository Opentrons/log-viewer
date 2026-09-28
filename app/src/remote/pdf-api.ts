import type { LogLine, LogPeriod } from "@/redux/logDirectory/types"

export interface PDFAPI {
  loadMetadata: (payload: { zipPath: string }) => Promise<Omit<LogPeriod, "scanStatus">>
  loadLines: (payload: { zipPath: string }) => Promise<LogLine[]>
  status: (
    payload: { status: "ready" } | { status: "not-ready" } | { status: "error"; error: string },
  ) => Promise<void>
}

// @ts-expect-error(sf): this is injected by preload
export const pdfApi = pdfShell as PDFAPI
