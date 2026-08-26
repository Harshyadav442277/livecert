# MARKET_DATA.md — live network data, and what it corrected

Captured **2026-08-26** from `/api/miners?limit=500` (89 miners) and
`/engine/v1/intents`. The `/api/miners` record exposes `total_requests_served`,
`scores`, `signal_mapping` and `activation_status` per miner — the actual competitive
picture, not inference.

Re-capture before acting on any of this.

---

## The finding that changed the plan: demand is wildly uneven

**The entire network has served 1,574 requests.** Weather is most of it.

| Tier-A intent | Requests | Miners | Top score |
|---|---|---|---|
| `WEATHER_FORECAST` | 941 | 9 | 0.0080 |
| `WEATHER_CHECK` | 620 | 8 | 0.7676 |
| **`STORM_ALERT`** | **334** | **3** | **0.0066** |
| `FRAUD_DETECTION` | 91 | 11 | 0.8245 |
| `WALLET_BALANCE_CHECK` | 48 | 6 | 0.9920 |
| `ONCHAIN_TX_LOOKUP` | 46 | 10 | 0.0111 |
| **`SSL_VERIFICATION`** | **17** | **3** | **0.0063** |
| `CVE_LOOKUP` | 5 | 2 | 0.0105 |
| `IP_GEOLOCATION` | 8 | 1 | 0.0000 |

The original intent analysis optimised for **low occupancy**. That was half the picture.
The prize-eligibility guardrail needs **≥100 real Track 3 requests to the intent**, so an intent
with no demand cannot pay out no matter how well we rank.

`SSL_VERIFICATION` has **17 lifetime requests**. Reaching 100 would mean generating essentially
all of it ourselves — which is both fragile and close to the line rule 04 draws.

**`STORM_ALERT` is the same shape of opportunity with 20× the demand:** Tier A, 3 miners, a top
score of 0.0066 (nobody is doing well), and 334 requests already flowing. It is also adjacent to
the weather traffic that dominates the network, so Track 3 apps are more likely to touch it.

**Action taken:** the miner now serves **both** intents from one deployment — `/ssl-check` and
`/storm-alert`. One Fly app, one registration, two eligibility paths. TxLens (rank 1 in several
intents from a single miner) demonstrates the pattern is allowed and effective.

## Live SSL_VERIFICATION leaderboard, epoch 283

| Rank | Slug | Score | Requests served | `signal_mapping` |
|---|---|---|---|---|
| 1 | `txlens` | 0.006276 | — | label=`status`, reason=`summary`, confidence=`confidence` |
| 2 | `ssllabs` | 0.004163 | 5 | label=`host`, reason=`status` |
| 3 | `certspotter-cert-verification` | **0.000000** | 12 | label=`has_valid_cert`, reason=`not_after` |

**The bar is extremely low.** Rank 1 is 0.0063 out of a possible 1.0. Two observations:

- `ssllabs` maps `label_field: host` — the label is then `"github.com"`, not a verdict. That is
  almost certainly why a technically excellent service scores 0.004.
- `txlens` maps `label_field: status`, whose value is `"ok"` — a request status, not a
  certificate verdict. Rank 1 with a mislabelled signal.

Ours maps `label_field: verdict`, whose value is the actual finding (`valid`, `expired`,
`self_signed`…). If the scorer compares that label against ground truth, this is a real edge —
but it is inference about an unpublished scoring module, not a proven fact. See G4.

## A claim of ours that was wrong

We asserted repeatedly — in the intent analysis, the README, and a draft X post — that TxLens was
beatable because **Render cold-starts**. Measured directly:

```
TxLens /ssl-check   cold 675ms   warm 324ms
```

**No cold start.** In hindsight the reason is obvious: validators spot-check every ~20 seconds,
which keeps the instance permanently warm. The spot-check cadence we treated as a threat to
competitors is the thing protecting them.

TxLens also performs a **real TLS handshake** — its response carries `authorized` and
`authorization_error`, which are Node `tls` fields, the same approach as ours. So the
"handshake vs certificate-transparency" differentiator applies to `certspotter`, **not** to TxLens.

TxLens is a better-built competitor than we credited. Its response even carries a `canonical`
field (`"ssl:github.com:valid:35"`) — a compact deterministic string clearly shaped for exact-match
scoring, though notably they do not map it in `signal_mapping`.

Corrected everywhere it appeared. The draft X post making the cold-start claim was rewritten
before it went out.

## What we could not determine

- **`external_path` is not exposed** by `/api/miners`, so a direct call to
  `api.certspotter.com/issuances` returning HTTP 400 does **not** prove their miner is
  misconfigured — Telegraph may forward to `/v1/issuances`. Not claimed as a weakness.
- **No per-intent Track 3 request counter** exists yet, so G13 progress cannot be tracked directly.
- `total_requests_served` is lifetime and includes Daemon traffic; none of it is Track 3 demand,
  since Track 3 opens 2026-08-31.
