import * as React from "react"

import type { SequentialConsistency, LogLine } from "@/redux/logDirectory/types"

export interface SequentialConsistencyErrorDetails {
  source: keyof LogLine["envelope"] | null
  message: string
}

export const useSequentialConsistencyError = <T>(
  sequentialConsistency?: SequentialConsistency<T> | null,
): SequentialConsistencyErrorDetails | null =>
  React.useMemo<SequentialConsistencyErrorDetails | null>(() => {
    if (sequentialConsistency == null) {
      return null
    } else if (sequentialConsistency.status === "consistent") {
      return null
    } else if (sequentialConsistency.status === "unverified") {
      return { message: "Log consistency has not yet been verified", source: null }
    } else {
      switch (sequentialConsistency.type) {
        case "hash-mismatch":
          return {
            message:
              "The cryptographic hash of the message content does not match the claimed cryptographic hash for the message.",
            source: "message_hash",
          }
        case "signature-mismatch": {
          return {
            message: "The cryptographic signature of the message hash cannot be verified.",
            source: "message_sig",
          }
        }
        case "unknown-signature-version": {
          return {
            message: "The message was signed with an unhandled signature algorithm",
            source: "sig_version",
          }
        }
        case "invalid-hash": {
          return {
            message: "The claimed hash of the message could not be parsed",
            source: "message_hash",
          }
        }
        case "bad-crypto-id": {
          return {
            message: "A message component was not properly serialized",
            source: null,
          }
        }
        case "invalid-signature": {
          return {
            message: "The signature of the message could not be parsed",
            source: "message_sig",
          }
        }
        case "no-target": {
          return {
            message: "The message previous to this message could not be found",
            source: null,
          }
        }
        default:
          return {
            // As long as the switch above is exhaustive, the type of
            // sequentialConsistency is never. If you get a tsc output
            // saying that the ts-expect-error does nothing, then you're missing a case.
            // @ts-expect-error
            message: `Unknown log consistency failure: ${sequentialConsistency.type}`,
            source: null,
          }
      }
    }
  }, [sequentialConsistency])
