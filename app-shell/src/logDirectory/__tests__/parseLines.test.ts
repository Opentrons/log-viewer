import path from "path"

import { describe, it, expect, vi } from "vitest"

import { parseLines } from "../parseLines"

vi.mock("../../log.js", () => ({
  createLogger: vi.fn<(...args: any) => unknown>(),
}))

const fixturesPath: string = import.meta.env.VITE_AUDITLOG_FIXTURES

describe("parseLines happy path", () => {
  it("parses log lines out of a log", async () => {
    const target = "logperiod_2026-08-20T20_34_18.573005Z.zip"
    expect(await parseLines(path.join(fixturesPath, target))).toStrictEqual([
      {
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"log-period-begin","accountName":"system","legalName":"","message":"Log period begun","reason":"","loggedAt":"2026-08-20T20:34:18.557561Z"}',
          messageHash: "sha256:BdvRwgLWXLdUWDIpT9cPtvJNOqTVaxSBOf69Crt6S5A=",
          messageSignature:
            "ed25519:XpglbB0JBvzfOgXb-L4uerilQt3617PJsv6bjCS30fj-s9kye9IS2-2PeAiPAsEkedu8Ovph5xSviLAZfKEyDw==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/739f9a67-19bb-4707-b150-80fda22f23eb via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=26, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=efsadfasdfasdfa, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"current\\":false}}; Response code: 200; Response headers: content-length=1828, content-type=application/json; Response body: <streaming>","reason":"efsadfasdfasdfa","loggedAt":"2026-08-20T20:34:19.054687Z"}',
          messageHash: "sha256:RcfWTJ92DbYGbaXgBhcNcE52wKOtDCzphGkBqdz7384=",
          messageSignature:
            "ed25519:YQvjtQkHBiJGeJPJxVPyNApSoIv2UAhrpJxlwdJfjLI-JXimz06uPDM-9LOtcjR8FoXzQJFtzPHrU1dQ_z75Cw==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"create maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=11, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{}}; Response code: 201; Response headers: content-length=280, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:22.477818Z"}',
          messageHash: "sha256:_iaxehew7K5c6YUYuXXDZjrkSQFKLEViOzcrCi_vOfA=",
          messageSignature:
            "ed25519:lZVLO8XQZ0a8MIUP39iI0oAlv8_XoppXK6qGkstRQ38qR9AXKnlRrvCoo4M0Wg5Np1PGArfT9WRmqtaIj5eTDg==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"execute command in maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=127, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer o2mhqatsgx765dY1loelqrov2EPICK, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"commandType\\":\\"loadPipette\\",\\"params\\":{\\"pipetteId\\":\\"p50_single_flex\\",\\"mount\\":\\"left\\",\\"pipetteName\\":\\"managedPipetteId\\"}}}; Response code: 422; Response headers: opentrons-min-version=2, opentrons-version=4, content-length=489, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:25.878767Z"}',
          messageHash: "sha256:aT1j4hJkrcSC8995cxQdbmTFVBOufdKJuV4f5GHY4PA=",
          messageSignature:
            "ed25519:l5m1l8-m97R3qcBRVn79IXcN6aPVPH3l9R3Q5VtE1RhX_6XiA_t-LbflAWJZ1npqPXWFN5H-dOWW3Fx9du9MBA==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"delete audit log period","accountName":"testadmin","legalName":"Test Admin","message":"DELETE to /audit/external/logPeriods/184 via http; Query parameters: deletionKey=O8_5jE82CzD5M8AfhIAfKYGyWRFkcBWMTirwBVmUQhI; Headers: host=localhost, connection=close, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdfs, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=34, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdfs","loggedAt":"2026-08-20T20:34:27.669162Z"}',
          messageHash: "sha256:omhcaaqd5x4LxY3xJbMExTkVhccen5UBPjyPVRzCRYI=",
          messageSignature:
            "ed25519:dNcafPfBfwhhRhTIYwu_Y7J1gGsq5ZDOvbBt3fDidh3iwPk1W0Oy6x2LQ4EnEAkI9ECv_PRUKSRkfHi2jGLGAQ==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"execute command in maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2/commands via http; Query parameters: waitUntilComplete=true, requiresClosedDoor=true; Headers: connection=close, host=localhost, content-length=76, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"commandType\\":\\"home\\",\\"params\\":{\\"axes\\":[\\"leftZ\\",\\"rightZ\\",\\"x\\",\\"y\\"]}}}; Response code: 201; Response headers: content-length=380, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdf","loggedAt":"2026-08-20T20:34:28.832019Z"}',
          messageHash: "sha256:BOM_8T1JkUq34ImeSWONxyuQlsZbFNXG_TKHe6ZzsDg=",
          messageSignature:
            "ed25519:V8edWwSyPxlR2427Slt-nOsw8al8xV3bLDO1Jx8K38ds4kicR-OMOPy0C-XxoQRiLDrqrIiLFIjjj0merpfgCg==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"delete maintenance run","accountName":"testadmin","legalName":"Test Admin","message":"DELETE to /maintenance_runs/f46cbc21-12fc-42c4-beb7-6a46e18bd2c2 via http; Query parameters: none; Headers: connection=close, host=localhost, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer bgOQl9pFm7epG5mpD2dLtylxewFBvF, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsaf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: none; Response code: 200; Response headers: content-length=2, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsaf","loggedAt":"2026-08-20T20:34:32.671836Z"}',
          messageHash: "sha256:HZZNKOZ5-_LhqKOEX3nDhlEVjMpd15VBOINKBJ4yfSA=",
          messageSignature:
            "ed25519:R-m_ifBXTy0TDYroRQiNB3Cv7A4jnZbKovbLnknw6Myn2PoEQ-q8pz7VX2m3pAKjwd9liGksVToHiAMqR3IpBQ==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"change compliance ready software settings","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /accessControl/settings via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=44, sec-ch-ua-platform=\\"macOS\\", authorization=Bearer uWVmShOQwwfNrB9Mr9TOGtTNhn0k9I, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasdf, user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, referer=http://localhost:5173/, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"requireLogsToBeSavedInApp\\":false}}; Response code: 200; Response headers: content-length=116, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasdf","loggedAt":"2026-08-20T20:34:49.374738Z"}',
          messageHash: "sha256:pHvqP-IOaLDhFm41IALTmsh0xfCEEPbiTg1QMXIII8U=",
          messageSignature:
            "ed25519:Ljmrm3OE4AvawXZE7_ryNLxQNSOnREI-43qhxjZnveVmml2UvtjdL05YXxo86I3ScK9FpocOxcDfb2KglKGoDg==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"create protocol run","accountName":"testadmin","legalName":"Test Admin","message":"POST to /runs via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=474, sec-ch-ua-platform=\\"Linux\\", authorization=Bearer qTZrK6FJNBCTTR6s6Z086oNjP0cwhN, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfsdfsdfsdf, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"protocolId\\":\\"615c17da-6203-474e-8bcc-4b72696e4abc\\",\\"labwareOffsets\\":[{\\"id\\":\\"15e24cd9-3b85-4450-83e5-bb6e6d369639\\",\\"createdAt\\":\\"2026-08-20T20:32:29.043163Z\\",\\"definitionUri\\":\\"opentrons/opentrons_flex_96_tiprack_50ul/1\\",\\"location\\":{\\"slotName\\":\\"C2\\"},\\"locationSequence\\":[{\\"kind\\":\\"onAddressableArea\\",\\"addressableAreaName\\":\\"C2\\"}],\\"vector\\":{\\"x\\":-0.10000000000002274,\\"y\\":-1.1989999999999554,\\"z\\":0.4990000000000805}}],\\"runTimeParameterValues\\":{},\\"runTimeParameterFiles\\":{}}}; Response code: 201; Response headers: content-length=741, content-type=application/json; Response body: <streaming>","reason":"asdfasdfsdfsdfsdf","loggedAt":"2026-08-20T20:35:06.339075Z"}',
          messageHash: "sha256:-fUFWlVDdRQkE5jL0HYuAYvist0BlioQwUAqOtU5-OA=",
          messageSignature:
            "ed25519:Dl4paIyBdNDjVUFsRURi4ocH7oRm1msxWsUCxGUxXZzcTixOG1D7xduep1XAlMV-v3H-6-eDPCFMmH1CDkspBg==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"update protocol run","accountName":"testadmin","legalName":"Test Admin","message":"PATCH to /runs/d3c78e4c-387d-4698-be3b-196bee4fd55c via http; Query parameters: none; Headers: connection=close, host=localhost, content-length=34, sec-ch-ua-platform=\\"Linux\\", authorization=Bearer ICABOzhEkngc99jKp23Idb6VhgveBk, sec-ch-ua=\\"Not_A Brand\\";v=\\"99\\", \\"Chromium\\";v=\\"142\\", sec-ch-ua-mobile=?0, opentrons-user-notes=asdfasdfasfd, user-agent=Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Opentrons/0.0.0-dev Chrome/142.0.7444.134 Electron/39.1.2 Safari/537.36, accept=application/json, text/plain, */*, content-type=application/json, opentrons-version=3, sec-fetch-site=cross-site, sec-fetch-mode=cors, sec-fetch-dest=empty, accept-encoding=gzip, deflate, br, zstd, accept-language=en-US; Request body: {\\"data\\":{\\"signedBy\\":\\"Test Admin\\"}}; Response code: 200; Response headers: content-length=919, content-type=application/json; Response body: <streaming>","reason":"asdfasdfasfd","loggedAt":"2026-08-20T20:36:33.816566Z"}',
          messageHash: "sha256:MALtTPbLnYkkX6RxqP5DY9wNMNiua1-l5TiCyVLahPg=",
          messageSignature:
            "ed25519:z0o9oxLOsCAtDj-at5wiM2jWx2bNderDPmCWFnTJ3EPFNyQp780lz97gIErogozWP6Lj8GSW2V5ivW0ZwpciBA==",
          signatureVersion: "1",
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
        consistencyFailures: [],
        envelope: {
          message:
            '{"action":"log-period-end","accountName":"system","legalName":"","message":"Log period ended","reason":"","loggedAt":"2026-08-20T20:36:53.973108Z"}',
          messageHash: "sha256:JJcpuFhtY6RVCsJVdewQTuPmgNZ2oHvyEykX6Q6aShU=",
          messageSignature:
            "ed25519:DwDIUFgsmnD65rLIA6WQ8i4_HfQoOP_dUelg3LEaHnoW7ImlwqV7SaX98ZNxDp3_60kbWnQ31L7Go1KTEIiRBg==",
          signatureVersion: "1",
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
})
