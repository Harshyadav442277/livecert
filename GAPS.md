# GAPS.md — honesty ledger

What we do not know, have not verified, or have deliberately left undone. Feeds the README's
"Assumptions & Limitations" and stops unknowns from being quietly rounded to "fine."

Status: `OPEN` unresolved · `CHECKING` in progress · `CLOSED` resolved, with the answer

---

## Blocking

### G1 · Which intent to claim — `CLOSED: SSL_VERIFICATION`
Decided on occupancy **and scoring tier** → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).
Tier A (exact match), 3 incumbents, all three with exploitable weaknesses. The zero-occupancy
intents turned out to be Tier B (LLM-judged) and were rejected for it.


### G2 · Runtime for TLS inspection — `CLOSED: Node, not Workers`
Confirmed by spike: Workers' `fetch` does not expose peer certificates; Node's
`tls.connect()` + `getPeerCertificate()` does, and was verified working against the full
badssl.com suite (valid, expired, self-signed, hostname-mismatch, untrusted-root, unreachable).
Hosting is therefore Node on an always-on machine — `fly.toml` pins `min_machines_running = 1`
precisely because scale-to-zero would read as spot-check failure (A3).

### G3 · Assumption that weather would be crowded — `CLOSED (confirmed)`
`WEATHER_CHECK` 8 miners, `WEATHER_FORECAST` 9 — among the most contested on the board. The
"avoid the docs' example" thesis holds.

Recorded alongside it: the **`ONCHAIN_TX_LOOKUP` suggestion was wrong** — 10 miners, tied
second-most crowded. Picking by domain familiarity would have bought a rank-4 zero. Crypto-native
intents are where crypto-native entrants cluster.

## Unverified protocol facts

### G4 · How answers are scored — `CLOSED (with one residual unknown)`
Both docs read. Scoring is a sandboxed WASM module receiving **three plain strings** —
`question`, `ground_truth`, `miner_answer` — and returning an f32 in [0,1]. The reference module
scores `matched ÷ total words in the miner's answer`, so **verbose answers are penalised**: every
word the ground truth lacks lowers the fraction. Our `reason` is one tight factual sentence for
exactly this reason.

**Residual unknown:** the *actual champion module* for `SSL_VERIFICATION` is not published, so we
know the mechanism but not the specific comparison. Terseness and canonical phrasing are the right
hedge under any word-overlap or embedding-similarity scheme, but this is inference, not fact.

### G5 · `example-miner.yaml` not yet retrieved — `OPEN`
The docs point at it repeatedly as the working starting point covering every block. We have the
field reference but not the file.
**Resolve:** find it in https://github.com/telegraphprotocol/telegraph-usecases

### G6 · Truncated doc pages — `OPEN`
Both [YAML Configuration] and [Registering as a Miner] were read at a character cap and cut off
mid-section — the tail of the validation-failures table and the troubleshooting table respectively.
Something in the cut region may matter.
**Resolve:** re-read the tails, or pull the markdown from the docs repo.

### G7 · Base Sepolia access not set up — `OPEN`
Registration needs an RPC endpoint (docs show Alchemy) and testnet ETH for gas. Neither exists yet.
Also unverified: whether the web console handles RPC itself, making this moot for the console path.

## Deliberately out of scope

### G8 · Track 2 and Track 3 — `CLOSED (excluded)`
Script Author and Application tracks are not being attempted in H1. Recorded so the choice reads as
a decision rather than an oversight. Track 3 opens Aug 31 and needs live miners; revisit for H2.

### G9 · `on_chain` block omitted — `CLOSED (excluded)`
Per ARCHITECTURE A9. Cost: our miner **cannot be targeted by ERC-8183 on-chain jobs at all** — the
node has no way to build the call without `on_chain.request`. We serve HTTP and WebSocket traffic
only. Accepted for H1; this is a real capability we are giving up, not a no-op.

### G10 · No monitoring built yet — `OPEN` (unchanged)
A3 makes uptime the product, and spot checks run every ~20s, but nothing watches our endpoint. A
revocation could go unnoticed for a day. Needs at minimum a periodic check of
`/api/miners/<registrationId>` for `activation_status`.

## Process risks

### G11 · Judging weights social reach, and we have no plan yet — `OPEN`
Every track lists "Progress updates posted on X" and "Engagement & reach on those posts" as
criteria. Track 1 additionally counts "number of applications built on your Miner" and "total
requests served" — both demand-side, neither controlled by code quality.
[docs/BUILD_IN_PUBLIC.md](docs/BUILD_IN_PUBLIC.md) sketches a cadence; it is not being executed yet.
**Honest read:** this is the part most likely to be neglected and it is weighted like the rest.

### G12 · Hackathon rules — `CLOSED` → [docs/JUDGING.md](docs/JUDGING.md)
Worth having read early: it corrected our deadline by a week (Track 1 closes **Aug 31**, not Sep 7),
revealed the exact scoring split (**75% performance / 25% X**), and surfaced G13 below.

### G13 · Our intent may not be prize-eligible — `OPEN` · **highest-severity open risk**
> An Intent must have at least 3 active Miners **and receive at least 100 real requests from
> Track 3 applications** to be eligible for global cash prizes.

`SSL_VERIFICATION` clears the first condition (4 miners once we register). The second is
**entirely outside our control**: it depends on other people choosing to build applications that
check SSL certificates. We can hold rank 1 with a flawless score and win nothing.

**Mitigation in scope:** build a Track 3 application ourselves that genuinely consumes the intent
(Phase 4b). Bounded honestly — rule 04 disqualifies artificial metric inflation, so it must be a
real product with a real reason to check certificates, not a request generator.

**Residual risk:** even so, 100 requests is a floor we may not reach alone, and we cannot verify
the current count for our intent — no published per-intent Track 3 request counter has been found.
This is the single most likely way the project produces excellent work and zero prize.
