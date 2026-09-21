import { parseLines } from "./parseLines"
import { LogPeriodFile } from "./types"

/**
 * Check the sequential consistency of a set of log periods.
 *
 * These should all be log periods from one robot.
 * Sequential consistency requires that the first message of each log period
 * be signed with the last message of the previous log period (the signature is
 * over the concatenation of current hash + previous hash) and that each successive
 * message inside the log period is similarly signed with the hash of the previous
 * message. Violations of these signatures imply that a message was altered, added,
 * or deleted from the log.
 *
 * To do this, the log periods need to be searched to find the order in which they
 * go. This is like a sort, but you can't in general provide an ordering for two
 * arbitrary log periods other than their dates - one date may be before the other,
 * but there's something in between so you can't tell how they relate cryptographically.
 *
 * To solve this we first order by date and then for each log period, search all
 * date-previous log periods to find the one whose final hash works with the first
 * hash of the current period.
 *
 * This can be slow, unsurprisingly, so it's an async generator.
 *
 * @param {LogPeriodFile[]} periods: The log periods to check.
 * @yields {LogPeriodFile} Each verified log period.
 * @returns {AsyncGenerator<LogPeriodFile>}
 * @generator
 */
export async function* checkSequentialConsistency(
  periods: LogPeriodFile[],
): AsyncGenerator<LogPeriodFile> {
  const sortedByDate = periods.toSorted((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
  for (const [index, checkedPeriod] of sortedByDate.entries()) {
    const first = (
      await parseLines(checkedPeriod.periodZip, checkedPeriod.publicKey, Buffer.from("")).next()
    ).value

    if (first.sequentialConsistency.status === "consistent") {
      // if the sequential consistency of the first element of a log period passes,
      // then it was the first log period created by the robot and needs no
      // further checking
      yield {
        ...checkedPeriod,
        sequentialConsistency: { status: "consistent", previousId: checkedPeriod.periodZip },
      }
    } else if (
      first.sequentialConsistency.status === "inconsistent" &&
      first.sequentialConsistency.type !== "signature-mismatch"
    ) {
      // if the sequential consistency of the first element of a log period is
      // inconsistent for reasons other than an inconsistent signature, then
      // finding the previous log period won't help
      yield { ...checkedPeriod, sequentialConsistency: first.sequentialConsistency }
    } else {
      // if the sequential consistency of the first element is inconsistent
      // because of a bad signature, we should go find the log period whose
      // trailing hash will make the first log line pass. this would be
      // theoretically O(N^2) time in the  number of log periods we know of
      // for a robot, but by presorting and knowing we don't have to check
      // periods that ended after this period we can cut that down.
      let found = false
      for (const checkAgainst of sortedByDate.slice(0, index)) {
        if (checkAgainst.trailingLogHash == null) {
          // if the period we're checking has no trailing log hash noted,
          // that means it has no log entries and we can ignore it
          continue
        }
        const checkedFirst = (
          await parseLines(
            checkedPeriod.periodZip,
            checkedPeriod.publicKey,
            checkAgainst.trailingLogHash,
          ).next()
        ).value
        if (checkedFirst.sequentialConsistency.status === "consistent") {
          // if this check passes, we found the preceding period and should note it
          yield {
            ...checkedPeriod,
            sequentialConsistency: {
              status: "consistent",
              previousId: checkAgainst.periodZip,
            },
          }
          found = true
        }
      }
      if (!found) {
        // we never found a match, and this remains inconsistent
        yield {
          ...checkedPeriod,
          sequentialConsistency: {
            status: "inconsistent",
            type: "no-target",
          },
        }
      }
    }
  }
}
