import * as React from "react"
export function useZipPathFromUrl(): string | null {
  return React.useMemo(() => {
    const queryString = window.location.search
    const params = new URLSearchParams(queryString)
    const zipPath = params.get("p")
    return zipPath ? decodeURIComponent(zipPath) : null
  }, [])
}
