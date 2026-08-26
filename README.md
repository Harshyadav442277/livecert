# livecert — a Telegraph miner for `SSL_VERIFICATION`, `STORM_ALERT`, and `WEATHER_FORECAST`

Three deterministic operational signals for the [Telegraph protocol](https://telegraphprotocol.com):
live TLS certificate status, 48-hour severe-weather risk, and weather forecasts. Built for
Telegraph Hackathon Season I, Track 1 (Miners).

**Status:** **deployed and verified**; not yet registered on-chain. See [SETUP.md](SETUP.md).

| | |
|---|---|
| Miner | `https://miner-wine.vercel.app` — all 18 acceptance checks pass |
| Track 3 app | `https://app-five-blond-45.vercel.app` |

---

## What it does

``GET /ssl-check?domain=example.com` performs a real TLS handshake and reports the certificate that
host is serving **right now**:

```json
{
  "domain": "expired.badssl.com",
  "verdict": "expired",
  "issuer": "COMODO CA Limited",
  "valid_to": "2015-04-12",
  "days_remaining": -4154,
  "reason": "The SSL certificate for expired.badssl.com is expired issued by COMODO CA Limited, it expired on 2015-04-12."
}
```

Verdicts: `valid` `expired` `not_yet_valid` `hostname_mismatch` `self_signed` `untrusted` `unreachable`

`GET /storm-alert?location=Chennai` grades 48-hour severe-weather disruption risk on Beaufort gust
thresholds plus thunderstorm and heavy-rain forecasts:

```json
{
  "location": "Chennai, Tamil Nadu, India",
  "verdict": "moderate",
  "max_wind_gust_kmh": 41,
  "thunderstorm": true,
  "reason": "Chennai, Tamil Nadu, India has a moderate storm risk in the next 48 hours: peak wind gusts of 41 km/h, thunderstorms forecast."
}
```

Verdicts: `none` `low` `moderate` `high` `severe` `unknown`

`GET /weather-forecast?location=London&hours=24` reports future conditions over a stated window —
the intent is explicitly about *future* conditions, not current ones:

```json
{
  "location": "London, England, United Kingdom",
  "verdict": "thunderstorms",
  "window_hours": 24,
  "temp_min_c": 18.5,
  "temp_max_c": 23.8,
  "reason": "The forecast for London, England, United Kingdom over the next 24 hours is thunderstorms, with temperatures from 18.5°C to 23.8°C..."
}
```

## Why this, and why this way

**Both intents were chosen from live network data** — see
[docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md) and [docs/MARKET_DATA.md](docs/MARKET_DATA.md).
Both are **Tier A** (deterministic, exact-match scoring) with only three incumbents each and a top
score under 0.007 — nobody is doing well in either.

Intents were added by measuring demand, because prize eligibility requires **≥100 real Track 3
requests to the intent** — ranking first in a dead intent pays nothing:

| Intent | Network requests | Miners | Bar to beat for rank 1 |
|---|---|---|---|
| `WEATHER_FORECAST` | **941** | 9 | 0.0080 |
| `STORM_ALERT` | 334 | 3 | 0.0066 |
| `SSL_VERIFICATION` | 17 | 3 | 0.0063 |

Judging normalizes to the best miner *within* each intent, so rank 1 is worth the full 75 points
regardless of absolute score. These are among the lowest bars on the board.

**A handshake is not a CT lookup.** Certificate transparency reports what was *issued* for a
domain. It cannot report what the server has *deployed*. Those disagree precisely when the question
matters — a host still serving an expired certificate. Only a handshake sees it.

**No upstream API.** Nothing third-party to rate-limit us, go down, or trigger a Routing Revocation.

**Terse answers on purpose.** Telegraph's scoring compares the miner's answer against a
ground-truth *string*; the reference module scores matched ÷ total words in the answer, so padding
dilutes the score. The `reason` field is one factual sentence.

## Layout

```
miner/            the service — Node, zero runtime dependencies
miner.yaml        Telegraph miner configuration
tools/watch.mjs   uptime + routing-revocation watcher
SETUP.md          the manual steps (deploy, wallet, register)
docs/             protocol facts, intent analysis, judging criteria, X drafts
```

## Run it

```bash
cd miner && npm install && npm run build && npm start
curl "http://127.0.0.1:8080/ssl-check?domain=expired.badssl.com"
```

## Assumptions and limitations

Tracked honestly in [GAPS.md](GAPS.md). The ones that matter:

- **Prize eligibility is not fully in our control.** An intent needs ≥3 active miners *and* ≥100
  real requests from Track 3 applications to be eligible. We meet the first; the second depends on
  other people building against `SSL_VERIFICATION`. Mitigated by planning a Track 3 app ourselves.
- **The exact champion scoring module for this intent is not published.** We know the mechanism —
  a WASM module comparing three plain strings — but not the specific comparison. Terse canonical
  phrasing is a hedge, not a certainty.
- **`on_chain` is deliberately omitted**, so the miner cannot be targeted by ERC-8183 on-chain jobs.
  It serves HTTP and WebSocket traffic only. A real capability traded for schema simplicity.
- **We got one thing wrong and corrected it.** We claimed the incumbent was beatable on Render
  cold starts; measurement showed 675ms cold / 324ms warm — ~20s spot checks keep it warm. The
  claim is retracted in [docs/MARKET_DATA.md](docs/MARKET_DATA.md).
- Not yet measured under real routed load.
