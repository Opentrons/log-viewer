import type { PDFAPI } from "@log-verifier/app/src/remote/pdf-api"
import { contextBridge, ipcRenderer } from "electron"
contextBridge.exposeInMainWorld("pdfShell", {
  loadMetadata: (payload) => ipcRenderer.invoke("pdfLoadMetadata", payload),
  loadLines: (payload) => ipcRenderer.invoke("pdfLoadLines", payload),
  status: (payload) => ipcRenderer.send("pdfStatus", payload),
} as PDFAPI)
