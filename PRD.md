# PRD.md — Telegraph Hackathon, Season I / H1

**Status:** draft, scope not yet frozen. Freeze after the Intent Decision (see Open Decisions).
**Deadline:** 2026-09-07 12:00 UTC — submissions close. ~12 days from 2026-08-26.
**Track:** 1 — Miner. (Track 2 Script Author and Track 3 Apps are out of scope; see Non-Goals.)

---

## Goal

Register and operate a Telegraph miner that reaches **rank 1 in its intent** by the end of H1,
and can show a real track record of served requests.

Rank matters more than it sounds. Routing is **70 / 20 / 10** to ranks 1/2/3 and **nothing to
4th**. This is not a leaderboard for pride — position *is* the revenue, and it is the primary
judging criterion.

## Why we can win

Three structural advantages, all from [TELEGRAPH_FACTS.md](docs/TELEGRAPH_FACTS.md):

1. **A miner is declarative.** `base_url` points at an upstream API; Telegraph proxies to it. A
   valid miner can be pure YAML with no code. The build cost of *entering* is near zero, so our
   time goes into choosing well and operating reliably rather than into plumbing.
2. **The docs ship a weather example** and tell newcomers to "register it as-is." Most of the
   300+ registrants will land on weather. Every intent they crowd is one we should avoid, and
   every intent they ignore is a 70% slot sitting unclaimed.
3. **Scoring rewards reliability, which is buyable.** Spot checks run every ~20s and a 20% score
   drop triggers immediate Routing Revocation. Most hobby registrations will sit on sleepy free
   tiers and get revoked. Simply *staying up* is a competitive edge.

## Success criteria

| # | Criterion | Measure |
|---|---|---|
| S1 | Miner is live | `activation_status: active` at `/api/miners/<registrationId>` |
| S2 | Survives grace period | 7 days, zero Routing Revocations |
| S3 | Rank 1 in its intent | Explorer leaderboard at submission time |
| S4 | Demonstrable traffic | Non-trivial served-request count |
| S5 | Build-in-public log | See [docs/BUILD_IN_PUBLIC.md](docs/BUILD_IN_PUBLIC.md) — an explicit judging criterion |

S1 and S5 are must-haves. S2–S4 are the competitive layer.

## In scope

- **One** miner, one intent, registered on Base Sepolia
- Miner YAML meeting the strict schema, pinned to IPFS via the web console
- Sandbox validation before spending gas
- A hosted endpoint **only if** the chosen intent needs logic no upstream API provides
- Uptime and latency monitoring against the ~20s spot-check cadence
- Public build log on X across the build window

## Non-goals

Deliberately excluded to protect the deadline:

- **Track 2 (Script Author).** Different skill, separate submission. Revisit for H2 in October.
- **Track 3 (Applications).** Opens Aug 31, depends on live miners. Out of scope for H1.
- **Multiple miners.** Spreading across intents splits attention; 70/20/10 rewards depth.
- **`on_chain` block.** ERC-8183 job targeting is optional and unnecessary for ranking. Ship without.
- **Mainnet.** H1 is Base Sepolia testnet only.
- **Custom scoring, validator node, MACHINA economics.** Not our layer.

## Constraints

- **Registration is on-chain and immutable in practice.** Mistakes cost an `updateMiner` tx and a
  new `registrationId` + `intentId`. Validate in the sandbox first, every time.
- **A rejected registration releases its slug immediately** — someone else can take the name.
- **`min_price_usdc` floor** is $0.01 minimum. Changeable via `updateMiner` but not for free.
- **Wallet operations are the user's.** Claude does not connect wallets, sign, or send
  transactions. See [CLAUDE.md](CLAUDE.md).

## Open decisions

**D1 — Which intent? (blocking; decide first)**
Occupancy captured 2026-08-26 → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).
45 canonical intents. Three are empty, but **empty is not the same as available**:

| Candidate | Miners | Read |
|---|---|---|
| `TEXT_AUTHENTICITY_CHECK` | **0** | **Front-runner.** The only empty intent whose emptiness looks like an oversight rather than an economic wall — it sits next to `AI_TEXT_DETECTION` (2 miners) and is easily mistaken for it. Objective ground truth. |
| `SSL_VERIFICATION` | 3 | Strong second. No upstream at all — we implement it, so no rate limit and no third-party outage feeding a revocation (A3). Needs a Node runtime; see G2. |
| `CVE_LOOKUP` | 2 | Objective, free NVD upstream, thin field. Upstream rate limits are the risk. |
| `RESEARCH_SYNTHESIS` | **0** | Empty because it costs LLM inference per call. A bill, not an opening. |
| `TWITTER_SEARCH` | **0** | Empty because the X API is paywalled at ~$100+/mo. Same. |
| `WEATHER_CHECK` / `WEATHER_FORECAST` | 8 / 9 | **Avoid.** The docs' own example; most contested on the board. |
| `ONCHAIN_TX_LOOKUP` | 10 | **Avoid**, despite fitting existing blockchain experience — tied second-most crowded, and rank 4+ earns nothing. |

Cannot close until **G4** (how the chosen intent is actually scored) is read. Optimizing for a
scoring function we have not seen is guesswork.

**D2 — Host our own endpoint, or proxy an upstream directly?**
Falls out of D1. A pure-proxy miner is free and instant but trivially copyable — anyone can point
at the same upstream, and then we compete on nothing. Our own endpoint costs a day and wins on
latency, response shape, and correctness. Lean toward our own *if* D1 picks an intent where logic
adds real value.

**D3 — Slug and numeric `id`.**
`id` must be unused network-wide; a clash is a terminal rejection. Check the live catalog before
choosing. Slug binds to the wallet permanently — pick a name worth keeping.

**D4 — Fee address.**
Which EVM wallet receives MACHINA. Can be the registering wallet or a separate cold address.
User's call; no payouts on testnet, so low stakes for H1.
