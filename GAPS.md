# GAPS.md — honesty ledger

What we do not know, have not verified, or have deliberately left undone. Feeds the README's
"Assumptions & Limitations" and stops unknowns from being quietly rounded to "fine."

Status: `OPEN` unresolved · `CHECKING` in progress · `CLOSED` resolved, with the answer

---

## Blocking

### G1 · Which intent to claim — `CHECKING`
Occupancy data captured 2026-08-26 → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).
45 canonical intents; **three sit at zero miners** (`RESEARCH_SYNTHESIS`,
`TEXT_AUTHENTICITY_CHECK`, `TWITTER_SEARCH`).
**Still open:** the *choice*. Two of the three empties are empty for economic reasons (per-call
LLM cost; a paywalled X API), so they are not free wins. Decision needs G4 (how the intent is
actually scored) before it can close.

### G2 · Can `SSL_VERIFICATION` run on Cloudflare Workers? — `OPEN`
Reading a peer certificate needs `tls.connect()` + `getPeerCertificate()`, a Node API. Workers'
`fetch` does not expose certificate details. If it cannot, that intent needs a Node runtime
(Fly.io, a VPS) — which reintroduces cold-start and uptime risk that Workers avoids (A3).
**Resolve:** spike it before committing to the intent, not after.

### G3 · Assumption that weather would be crowded — `CLOSED (confirmed)`
`WEATHER_CHECK` 8 miners, `WEATHER_FORECAST` 9 — among the most contested on the board. The
"avoid the docs' example" thesis holds.

Recorded alongside it: the **`ONCHAIN_TX_LOOKUP` suggestion was wrong** — 10 miners, tied
second-most crowded. Picking by domain familiarity would have bought a rank-4 zero. Crypto-native
intents are where crypto-native entrants cluster.

## Unverified protocol facts

### G4 · Exact request/response contract validators use to score — `OPEN`
We know scoring happens ("stake-weighted median of validator local scores", spot checks every
~20s) but not what a validator actually *sends* or how a response is judged correct for a given
intent. Without this we are optimizing blind.
**Resolve:** read [Intents](https://docs.telegraphprotocol.com/docs/using/intents) — the docs say
it covers "what each one means and **how it's scored**" — and
[Build a Scoring Module](https://docs.telegraphprotocol.com/docs/scoring/build-a-scoring-module),
which shows scoring from the other side. Neither has been read yet.

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

### G10 · No monitoring built yet — `OPEN`
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

### G12 · Hackathon rules page unread — `OPEN`
https://hackathon.telegraphprotocol.com/rules — eligibility, submission format, and team rules
have not been checked. Cheap to close, and the kind of thing that invalidates work if wrong.
