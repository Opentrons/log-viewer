import { createPublicKey } from "crypto"
import { readFile } from "fs/promises"
import path from "path"

import { describe, it, expect, vi } from "vitest"

import { parseLines } from "../parseLines"

vi.mock("../../log.js", () => ({
  createLogger: vi.fn<(...args: any) => unknown>(),
}))

const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("parseLines happy path", async () => {
  const unzippedPath = path.join(fixturesPath, "pre-unzipped", "period3")
  // Keep these in sync, only load a key corresponding to the zip
  const keyFile = await readFile(path.join(unzippedPath, "signing_key.pem"))
  const logPeriodPath = path.join(fixturesPath, "logperiod_2026-08-20T20_34_18.573005Z.zip")
  const key = createPublicKey(keyFile)

  it("parses log lines out of a log with no previous period", async () => {
    expect(await Array.fromAsync(parseLines(logPeriodPath, key, Buffer.from("")))).toStrictEqual([
      {
        sequentialConsistency: {
          status: "inconsistent",
          failure: "The message was not properly signed by the associated key.",
          type: "signature-mismatch",
        },
        envelope: {
          message:
            '{"action":"log-period-begin","accountName":"system","legalName":"","message":"Log period begun","reason":"","loggedAt":"2026-08-20T20:34:18.557561Z"}',
          message_hash: "sha256:BdvRwgLWXLdUWDIpT9cPtvJNOqTVaxSBOf69Crt6S5A=",
          message_sig:
            "ed25519:XpglbB0JBvzfOgXb-L4uerilQt3617PJsv6bjCS30fj-s9kye9IS2-2PeAiPAsEkedu8Ovph5xSviLAZfKEyDw==",
          sig_version: "1",
        },
        id: 0,
        payload: {
          action: "log-period-begin",
          legalName: "",
          loggedAt: "2026-08-20T20:34:18.557561Z",
          message: "Log period begun",
          userName: "system",
          userNote: "",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 0 },
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/739f9a67-19bb-4707-b150-80fda22f23eb via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=26, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=efsadfasdfasdfa, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"current\\":false}}; Response code: 200; Response headers: content-length=1828, content-type=application/json; Response body: <streaming>","reason":"efsadfasdfasdfa","loggedAt":"2026-08-20T20:34:19.054687Z"}',
          message_hash: "sha256:RcfWTJ92DbYGbaXgBhcNcE52wKOtDCzphGkBqdz7384=",
          message_sig:
            "ed25519:YQvjtQkHBiJGeJPJxVPyNApSoIv2UAhrpJxlwdJfjLI-JXimz06uPDM-9LOtcjR8FoXzQJFtzPHrU1dQ_z75Cw==",
          sig_version: "1",
        },
        id: 1,
        payload: {
          action: "update protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:19.054687Z",
          message:
            'PATCH to /runs/739f9a67-19bb-4707-b150-80fda22f23eb via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=26, sec-ch-ua-platform="macOS", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=efsadfasdfasdfa, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"current":false}}; Response code: 200; Response headers: content-length=1828, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "efsadfasdfasdfa",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 1 },
        envelope: {
          message:
            '{"action":"create maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=11, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{}}; Response code: 201; Response headers: content-length=280, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:22.477818Z"}',
          message_hash: "sha256:_iaxehew7K5c6YUYuXXDZjrkSQFKLEViOzcrCi_vOfA=",
          message_sig:
            "ed25519:lZVLO8XQZ0a8MIUP39iI0oAlv8_XoppXK6qGkstRQ38qR9AXKnlRrvCoo4M0Wg5Np1PGArfT9WRmqtaIj5eTDg==",
          sig_version: "1",
        },
        id: 2,
        payload: {
          action: "create maintenance run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:22.477818Z",
          message:
            'POST to /maintenance_runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=11, sec-ch-ua-platform="macOS", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{}}; Response code: 201; Response headers: content-length=280, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfsdf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 2 },
        envelope: {
          message:
            '{"action":"execute command in maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=127, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"commandType\\":\\"loadPipette\\",\\"params\\":{\\"pipetteId\\":\\"p50_single_flex\\",\\"mount\\":\\"left\\",\\"pipetteName\\":\\"managedPipetteId\\"}}}; Response code: 422; Response headers: opentrons-min-version=2, opentrons-version=4, content-length=489, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:25.878767Z"}',
          message_hash: "sha256:aT1j4hJkrcSC8995cxQdbmTFVBOufdKJuV4f5GHY4PA=",
          message_sig:
            "ed25519:l5m1l8-m97R3qcBRVn79IXcN6aPVPH3l9R3Q5VtE1RhX_6XiA_t-LbflAWJZ1npqPXWFN5H-dOWW3Fx9du9MBA==",
          sig_version: "1",
        },
        id: 3,
        payload: {
          action: "execute command in maintenance run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:25.878767Z",
          message:
            'POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=127, sec-ch-ua-platform="macOS", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"commandType":"loadPipette","params":{"pipetteId":"p50_single_flex","mount":"left","pipetteName":"managedPipetteId"}}}; Response code: 422; Response headers: opentrons-min-version=2, opentrons-version=4, content-length=489, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfsdf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 3 },
        envelope: {
          message:
            '{"action":"delete audit log period","accountName":"testadmin","legalName":"Test Admin","message":"DELETE to /audit/external/logPeriods/184 via http; Query parameters: deletionKey=O8_5jE82CzD5M8AfhIAfKYGyWRFkcBWMTirwBVmUQhI; Headers: host=localhost, connection=close, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=34, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdfs","loggedAt":"2026-08-20T20:34:27.669162Z"}',
          message_hash: "sha256:omhcaaqd5x4LxY3xJbMExTkVhccen5UBPjyPVRzCRYI=",
          message_sig:
            "ed25519:dNcafPfBfwhhRhTIYwu_Y7J1gGsq5ZDOvbBt3fDidh3iwPk1W0Oy6x2LQ4EnEAkI9ECv_PRUKSRkfHi2jGLGAQ==",
          sig_version: "1",
        },
        id: 4,
        payload: {
          action: "delete audit log period",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:27.669162Z",
          message:
            'DELETE to /audit/external/logPeriods/184 via http; Query parameters: deletionKey=O8_5jE82CzD5M8AfhIAfKYGyWRFkcBWMTirwBVmUQhI; Headers: host=localhost, connection=close, sec-ch-ua-platform="macOS", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=34, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasdfs",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 4 },
        envelope: {
          message:
            '{"action":"execute command in maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=76, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"commandType\\":\\"home\\",\\"params\\":{\\"axes\\":[\\"leftZ\\",\\"rightZ\\",\\"x\\",\\"y\\"]}}}; Response code: 201; Response headers: content-length=380, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:28.832019Z"}',
          message_hash: "sha256:BOM_8T1JkUq34ImeSWONxyuQlsZbFNXG_TKHe6ZzsDg=",
          message_sig:
            "ed25519:V8edWwSyPxlR2427Slt-nOsw8al8xV3bLDO1Jx8K38ds4kicR-OMOPy0C-XxoQRiLDrqrIiLFIjjj0merpfgCg==",
          sig_version: "1",
        },
        id: 5,
        payload: {
          action: "execute command in maintenance run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:28.832019Z",
          message:
            'POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=76, sec-ch-ua-platform="macOS", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"commandType":"home","params":{"axes":["leftZ","rightZ","x","y"]}}}; Response code: 201; Response headers: content-length=380, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfsdf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 5 },
        envelope: {
          message:
            '{"action":"delete maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"DELETE to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2 via http; Query parameters: none; Headers: connection=close, host=localhost, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsaf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=2, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsaf","loggedAt":"2026-08-20T20:34:32.671836Z"}',
          message_hash: "sha256:HZZNKOZ5-_LhqKOEX3nDhlEVjMpd15VBOINKBJ4yfSA=",
          message_sig:
            "ed25519:R-m_ifBXTy0TDYroRQiNB3Cv7A4jnZbKovbLnknw6Myn2PoEQ-q8pz7VX2m3pAKjwd9liGksVToHiAMqR3IpBQ==",
          sig_version: "1",
        },
        id: 6,
        payload: {
          action: "delete maintenance run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:32.671836Z",
          message:
            'DELETE to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2 via http; Query parameters: none; Headers: connection=close, host=localhost, sec-ch-ua-platform="macOS", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsaf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=2, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfsaf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 6 },
        envelope: {
          message:
            '{"action":"change compliance ready software settings","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /accessControl/settings via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=44, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer uWVmShOQwwfNrB9Mr9TOGtTNhn0k9I, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"requireLogsToBeSavedInApp\\":false}}; Response code: 200; Response headers: content-length=116, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdf","loggedAt":"2026-08-20T20:34:49.374738Z"}',
          message_hash: "sha256:pHvqP-IOaLDhFm41IALTmsh0xfCEEPbiTg1QMXIII8U=",
          message_sig:
            "ed25519:Ljmrm3OE4AvawXZE7_ryNLxQNSOnREI-43qhxjZnveVmml2UvtjdL05YXxo86I3ScK9FpocOxcDfb2KglKGoDg==",
          sig_version: "1",
        },
        id: 7,
        payload: {
          action: "change compliance ready software settings",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:34:49.374738Z",
          message:
            'PATCH to /accessControl/settings via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=44, sec-ch-ua-platform="macOS", authorization=Bearer uWVmShOQwwfNrB9Mr9TOGtTNhn0k9I, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"requireLogsToBeSavedInApp":false}}; Response code: 200; Response headers: content-length=116, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasdf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 7 },
        envelope: {
          message:
            '{"action":"create protocol run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=474, sec-ch-ua-platform=\\"Linux\\", authorization=Bearer qTZrK6FJNBCTTR6s6Z086oNjP0cwhN, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdfsdfsdf, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"protocolId\\":\\"615c17da-6203-474e-8bcc-4b72696e4abc\\",\\"labwareOffsets\\":[{\\"id\\":\\"15e24cd9-3b85-4450-83e5-bb6e6d369639\\",\\"createdAt\\":\\"2026-08-20T20:32:29.043163Z\\",\\"definitionUri\\":\\"opentrons/opentrons_flex_96_tiprack_50ul/1\\",\\"location\\":{\\"slotName\\":\\"C2\\"},\\"locationSequence\\":[{\\"kind\\":\\"onAddressableArea\\",\\"addressableAreaName\\":\\"C2\\"}],\\"vector\\":{\\"x\\":-0.10000000000002274,\\"y\\":-1.1989999999999554,\\"z\\":0.4990000000000805}}],\\"runTimeParameterValues\\":{},\\"runTimeParameterFiles\\":{}}}; Response code: 201; Response headers: content-length=741, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdfsdfsdf","loggedAt":"2026-08-20T20:35:06.339075Z"}',
          message_hash: "sha256:-fUFWlVDdRQkE5jL0HYuAYvist0BlioQwUAqOtU5-OA=",
          message_sig:
            "ed25519:Dl4paIyBdNDjVUFsRURi4ocH7oRm1msxWsUCxGUxXZzcTixOG1D7xduep1XAlMV-v3H-6-eDPCFMmH1CDkspBg==",
          sig_version: "1",
        },
        id: 8,
        payload: {
          action: "create protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:35:06.339075Z",
          message:
            'POST to /runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=474, sec-ch-ua-platform="Linux", authorization=Bearer qTZrK6FJNBCTTR6s6Z086oNjP0cwhN, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdfsdfsdf, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"protocolId":"615c17da-6203-474e-8bcc-4b72696e4abc","labwareOffsets":[{"id":"15e24cd9-3b85-4450-83e5-bb6e6d369639","createdAt":"2026-08-20T20:32:29.043163Z","definitionUri":"opentrons/opentrons_flex_96_tiprack_50ul/1","location":{"slotName":"C2"},"locationSequence":[{"kind":"onAddressableArea","addressableAreaName":"C2"}],"vector":{"x":-0.10000000000002274,"y":-1.1989999999999554,"z":0.4990000000000805}}],"runTimeParameterValues":{},"runTimeParameterFiles":{}}}; Response code: 201; Response headers: content-length=741, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfsdfsdfsdf",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 8 },
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/d3c78e4c-387d-4698-be3b-196bee4fd55c via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=34, sec-ch-ua-platform=\\"Linux\\", authorization=Bearer ICABOzhEkngc99jKp23Idb6VhgveBk, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasfd, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"signedBy\\":\\"Test Admin\\"}}; Response code: 200; Response headers: content-length=919, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasfd","loggedAt":"2026-08-20T20:36:33.816566Z"}',
          message_hash: "sha256:MALtTPbLnYkkX6RxqP5DY9wNMNiua1-l5TiCyVLahPg=",
          message_sig:
            "ed25519:z0o9oxLOsCAtDj-at5wiM2jWx2bNderDPmCWFnTJ3EPFNyQp780lz97gIErogozWP6Lj8GSW2V5ivW0ZwpciBA==",
          sig_version: "1",
        },
        id: 9,
        payload: {
          action: "update protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:36:33.816566Z",
          message:
            'PATCH to /runs/d3c78e4c-387d-4698-be3b-196bee4fd55c via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=34, sec-ch-ua-platform="Linux", authorization=Bearer ICABOzhEkngc99jKp23Idb6VhgveBk, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasfd, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"signedBy":"Test Admin"}}; Response code: 200; Response headers: content-length=919, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasfd",
        },
      },
      {
        sequentialConsistency: { status: "consistent", previousId: 9 },
        envelope: {
          message:
            '{"action":"log-period-end","accountName":"system","legalName":"","message":"Log period ended","reason":"","loggedAt":"2026-08-20T20:36:53.973108Z"}',
          message_hash: "sha256:JJcpuFhtY6RVCsJVdewQTuPmgNZ2oHvyEykX6Q6aShU=",
          message_sig:
            "ed25519:DwDIUFgsmnD65rLIA6WQ8i4_HfQoOP_dUelg3LEaHnoW7ImlwqV7SaX98ZNxDp3_60kbWnQ31L7Go1KTEIiRBg==",
          sig_version: "1",
        },
        id: 10,
        payload: {
          action: "log-period-end",
          legalName: "",
          loggedAt: "2026-08-20T20:36:53.973108Z",
          message: "Log period ended",
          userName: "system",
          userNote: "",
        },
      },
    ])
  })
  it("parses log lines out of a log with a previous period", async () => {
    const results = await Array.fromAsync(parseLines(logPeriodPath, key, Buffer.from("")))
    console.log(`last is ${JSON.stringify(results[results.length - 1].envelope.message_hash)}`)
    const lastHash = Buffer.from(
      results[results.length - 1].envelope.message_hash.split(":")[1],
      "base64url",
    )
    const subsequentTarget = path.join(fixturesPath, "logperiod_2026-08-20T20_36_54.051806Z.zip")
    expect(await Array.fromAsync(parseLines(subsequentTarget, key, lastHash))).toStrictEqual([
      {
        envelope: {
          message:
            '{"action":"log-period-begin","accountName":"system","legalName":"","message":"Log period begun","reason":"","loggedAt":"2026-08-20T20:36:54.027589Z"}',
          message_hash: "sha256:wpe9oMB42rzChVsANp6DudnQOo3z8QHogjJ_-XLuPD4=",
          message_sig:
            "ed25519:k7Q5PBhrCFlHCW2E_2h_x_9Jij22FzmrIn2t86fO9n8gxlWRSih0VtiASQmTlHgUQKmN-FDb2Tl5XNKaNlUKAQ==",
          sig_version: "1",
        },
        id: 0,
        payload: {
          action: "log-period-begin",
          legalName: "",
          loggedAt: "2026-08-20T20:36:54.027589Z",
          message: "Log period begun",
          userName: "system",
          userNote: "",
        },
        sequentialConsistency: {
          previousId: -1,
          status: "consistent",
        },
      },
      {
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/d3c78e4c-387d-4698-be3b-196bee4fd55c via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=26, sec-ch-ua-platform=\\"Linux\\", authorization=Bearer DPhdahpJKK7x690uowvGmjLVdxKGmn, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfasdfas, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"current\\":false}}; Response code: 200; Response headers: content-length=920, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdfasdfas","loggedAt":"2026-08-20T20:36:54.169815Z"}',
          message_hash: "sha256:-zvyFWdK41TRyRhPenAigqMt_ac6DPav62JsEzKtkik=",
          message_sig:
            "ed25519:EYVTdWmHgPhH8tYXlGueD1vVSWNbdwBv0EodFpbW1T6-Cn2OJvpKLybqOPmFEnkSyuME63D2n0r2p0avKkgdAA==",
          sig_version: "1",
        },
        id: 1,
        payload: {
          action: "update protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:36:54.169815Z",
          message:
            'PATCH to /runs/d3c78e4c-387d-4698-be3b-196bee4fd55c via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=26, sec-ch-ua-platform="Linux", authorization=Bearer DPhdahpJKK7x690uowvGmjLVdxKGmn, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfasdfas, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"current":false}}; Response code: 200; Response headers: content-length=920, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasdfasdfas",
        },
        sequentialConsistency: {
          previousId: 0,
          status: "consistent",
        },
      },
      {
        envelope: {
          message:
            '{"action":"create protocol run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=474, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer BJDD79O3SAlGU4zkmtwvIoUq0ZEU9x, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"protocolId\\":\\"615c17da-6203-474e-8bcc-4b72696e4abc\\",\\"labwareOffsets\\":[{\\"id\\":\\"db74568c-d53b-4092-8f84-0a860e48942c\\",\\"createdAt\\":\\"2026-08-20T20:35:01.060033Z\\",\\"definitionUri\\":\\"opentrons/opentrons_flex_96_tiprack_50ul/1\\",\\"location\\":{\\"slotName\\":\\"C2\\"},\\"locationSequence\\":[{\\"kind\\":\\"onAddressableArea\\",\\"addressableAreaName\\":\\"C2\\"}],\\"vector\\":{\\"x\\":-0.10000000000002274,\\"y\\":-1.1989999999999554,\\"z\\":0.4990000000000805}}],\\"runTimeParameterValues\\":{},\\"runTimeParameterFiles\\":{}}}; Response code: 201; Response headers: content-length=741, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdf","loggedAt":"2026-08-20T20:38:29.374240Z"}',
          message_hash: "sha256:opzqlXpijqw2sFDrfqNljaOGH50jxcWHR63HdV5i1GI=",
          message_sig:
            "ed25519:KuB3y0N7BV0O0yFmGSSaJKg0XyJoKXDoACJZgmiBRjE5wfEfiufICKWPGFk31ugNL3E3tFQbDnbHxR6_KwqZDA==",
          sig_version: "1",
        },
        id: 2,
        payload: {
          action: "create protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:38:29.374240Z",
          message:
            'POST to /runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=474, sec-ch-ua-platform="macOS", authorization=Bearer BJDD79O3SAlGU4zkmtwvIoUq0ZEU9x, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"protocolId":"615c17da-6203-474e-8bcc-4b72696e4abc","labwareOffsets":[{"id":"db74568c-d53b-4092-8f84-0a860e48942c","createdAt":"2026-08-20T20:35:01.060033Z","definitionUri":"opentrons/opentrons_flex_96_tiprack_50ul/1","location":{"slotName":"C2"},"locationSequence":[{"kind":"onAddressableArea","addressableAreaName":"C2"}],"vector":{"x":-0.10000000000002274,"y":-1.1989999999999554,"z":0.4990000000000805}}],"runTimeParameterValues":{},"runTimeParameterFiles":{}}}; Response code: 201; Response headers: content-length=741, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasdf",
        },
        sequentialConsistency: {
          previousId: 1,
          status: "consistent",
        },
      },
      {
        envelope: {
          message:
            '{"action":"create run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /runs/f6c62b99-c4ba-441f-94c9-9c2572bbb923/actions via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=30, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer mPF4bdH3RwXzLrvLsYHjx4Z2MqCqrR, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"actionType\\":\\"stop\\"}}; Response code: 201; Response headers: content-length=116, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdfs","loggedAt":"2026-08-20T20:38:48.361488Z"}',
          message_hash: "sha256:_EiE_zveN1cPGTymEbWz7sL2UD4xLUf7mWuxpFkgH84=",
          message_sig:
            "ed25519:DNOsA1cGPr3Fc26TnNwYVQ35VHEAzsdYHq-BvU3IecVd4YLRn0H5e8MHIra-MRYeQCrbYi1QHCZ5mWoz26CMCw==",
          sig_version: "1",
        },
        id: 3,
        payload: {
          action: "create run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:38:48.361488Z",
          message:
            'POST to /runs/f6c62b99-c4ba-441f-94c9-9c2572bbb923/actions via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=30, sec-ch-ua-platform="macOS", authorization=Bearer mPF4bdH3RwXzLrvLsYHjx4Z2MqCqrR, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"actionType":"stop"}}; Response code: 201; Response headers: content-length=116, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfasdfasdfs",
        },
        sequentialConsistency: {
          previousId: 2,
          status: "consistent",
        },
      },
      {
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/f6c62b99-c4ba-441f-94c9-9c2572bbb923 via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=34, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer dx63TW2VfWtIqTyBUCT0GjSRaZbi1E, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfsadfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"signedBy\\":\\"Test Admin\\"}}; Response code: 200; Response headers: content-length=919, content-type=application/json; Response body: <streaming>","reason":"asdfsadfasdfs","loggedAt":"2026-08-20T20:39:16.407589Z"}',
          message_hash: "sha256:R4sEV8Bh04_PiOgKTtfi0o2IQdjCZgdo_GdUxKQNSRQ=",
          message_sig:
            "ed25519:oMx5873reVEK5Hld0v2hDKWjMjHu2EGTJtex9RXbiY7Q24jCo3wiUkIckGyZtp9VBx7qnjx_w2yDna3pBG0ACg==",
          sig_version: "1",
        },
        id: 4,
        payload: {
          action: "update protocol run",
          legalName: "Test Admin",
          loggedAt: "2026-08-20T20:39:16.407589Z",
          message:
            'PATCH to /runs/f6c62b99-c4ba-441f-94c9-9c2572bbb923 via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=34, sec-ch-ua-platform="macOS", authorization=Bearer dx63TW2VfWtIqTyBUCT0GjSRaZbi1E, sec-ch-ua="Not_A Brand";v="99", "Chromium";v="142", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfsadfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {"data":{"signedBy":"Test Admin"}}; Response code: 200; Response headers: content-length=919, content-type=application/json; Response body: <streaming>',
          userName: "testadmin",
          userNote: "asdfsadfasdfs",
        },
        sequentialConsistency: {
          previousId: 3,
          status: "consistent",
        },
      },
      {
        envelope: {
          message:
            '{"action":"log-period-end","accountName":"system","legalName":"","message":"Log period ended","reason":"","loggedAt":"2026-08-20T20:39:22.860397Z"}',
          message_hash: "sha256:8M-983O6jj1lm7ilybGMN21j_F2Z3hba2S1N_9faN2w=",
          message_sig:
            "ed25519:GndRue_qvxlsZ75uvgduEOBBFOEI7JrXAzg5fXpHphv01zOEnqLVElqczN-FXt_sMkL780DDRcXy3LVrJBtkAg==",
          sig_version: "1",
        },
        id: 5,
        payload: {
          action: "log-period-end",
          legalName: "",
          loggedAt: "2026-08-20T20:39:22.860397Z",
          message: "Log period ended",
          userName: "system",
          userNote: "",
        },
        sequentialConsistency: {
          previousId: 4,
          status: "consistent",
        },
      },
    ])
  })
})
