// config migration tests
import { describe, expect, it } from "vitest"

import { MOCK_CONFIG_V0, MOCK_CONFIG_V1 } from "../../__fixtures__/config"
import { migrate } from "../migrate"

const NEWEST_VERSION = 1
const NEWEST_MOCK_CONFIG = MOCK_CONFIG_V1

describe("config migration", () => {
  it("should migrate version 0 to latest", () => {
    const v0Config = MOCK_CONFIG_V0
    const result = migrate(v0Config)

    expect(result.version).toBe(NEWEST_VERSION)
    expect(result).toEqual(NEWEST_MOCK_CONFIG)
  })
})
