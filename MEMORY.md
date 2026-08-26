# MEMORY.md — session continuity

**Read this first every session.** Update it at session end. It is the handoff medium between
sessions and between models.

---

## Where things stand — 2026-08-26

**Day 1.** Planning only. No code, no YAML, no registration. Repo is docs and a fresh `git init`.

### Done
- Hackathon account registered (`harsh.2024a@vitstudent.ac.in`), email verified, **Discord joined**
- **Track 1 (Miner)** chosen
- Protocol mechanics verified against live docs → [docs/TELEGRAPH_FACTS.md](docs/TELEGRAPH_FACTS.md)
- Planning docs written: PRD, ARCHITECTURE, TASKS, GAPS, BUILD_IN_PUBLIC

### The finding that reframed the project
**`base_url` is the UPSTREAM API being wrapped — not a server we have to write.** Telegraph is
declarative: publish a YAML describing an existing API, nodes proxy to it. A valid miner can be
**pure YAML with zero code**.

An earlier session assumption — that a Cloudflare Worker had to be built and deployed first — was
wrong as a *requirement*. Hosting our own endpoint is now a strategic option (differentiation,
latency control), not a gate. See PRD **D2**.

### Intent occupancy — captured, and it moved the plan
45 canonical intents → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).
**Three sit at zero miners:** `RESEARCH_SYNTHESIS`, `TEXT_AUTHENTICITY_CHECK`, `TWITTER_SEARCH`.

But two of those are empty for economic reasons (per-call LLM cost; a ~$100/mo X API), not because
nobody noticed. **`TEXT_AUTHENTICITY_CHECK` is the front-runner** — the only empty one that looks
merely overlooked, sitting next to `AI_TEXT_DETECTION` (2 miners) and easily confused with it.
`SSL_VERIFICATION` (3 miners) is the strong second: no upstream at all, so no rate limit or
third-party outage can trigger a revocation.

Two earlier guesses tested: weather **is** crowded (8/9) as predicted, and `ONCHAIN_TX_LOOKUP` —
suggested for fitting blockchain experience — is a **trap at 10 miners**. Crypto-native intents
are where crypto-native entrants pile up.

### Next action
**T0.2** — read [Intents](https://docs.telegraphprotocol.com/docs/using/intents) for **how each
intent is scored**. D1 cannot close without it; picking a target before seeing its scoring function
is guesswork.

---

## Key numbers

| | |
|---|---|
| Deadline | **2026-09-07 12:00 UTC** (H1 submissions close) |
| Prize | $5K this hackathon; $15K across Season I (H1 Sep, H2 mid-Oct, H3 mainnet Dec) |
| Track 3 opens | **2026-08-31** — applications built on live miners |
| Chain | **Base Sepolia** (testnet — gas only, no bond, no stake) |
| Diamond | `0x5a2324aA18613FAD4e44bDF0d6c73Ec1f6D87ff8` |
| Routing | 70% / 20% / 10% to ranks 1/2/3, **nothing to 4th** |
| Grace period | 7 days, unranked, equal share of 5% of traffic |
| Spot checks | ~every 20s; >20% score drop ⇒ immediate Routing Revocation |
| Registrants | 300+ as of 2026-08-26 |

## Open decisions

**D1 intent** · **D2 own endpoint vs. pure proxy** · **D3 slug + numeric id** · **D4 fee address**
All four are unresolved and detailed in [PRD.md](PRD.md). D1 blocks the rest.

## Standing context

- **Wallet operations are the user's.** Claude does not connect wallets, sign messages, or send
  transactions. Claude drafts; the user clicks.
- **Verify protocol facts against live docs, never memory.** The canonical intent set changes
  on-chain. Record what was checked and when.
- Registration is effectively immutable; a rejected registration **releases its slug immediately**.
  Always sandbox-validate first.
- Judging weights **X posts and engagement** on every track — see
  [docs/BUILD_IN_PUBLIC.md](docs/BUILD_IN_PUBLIC.md). Easy to neglect, scored anyway.

## Not this project

The **Midnight / Brainwave** hackathon (NightSeal, ZK firmware attestation) is a **separate,
unrelated project** in a different folder. Do not conflate the two — an earlier session in this
conversation carried Midnight's deadline over by mistake.

## After registration, record here

```
registrationId   —      (use this for every lookup, never the slug)
intentId         —
slug             —
numeric id       —
base_url         —
fee address      —
IPFS YAML URL    —
```
