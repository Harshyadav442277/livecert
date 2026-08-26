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

### Intent decided: `SSL_VERIFICATION` — and why
Chosen on **occupancy × scoring tier** → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).

Scoring has two tiers. **Tier A = deterministic WASM exact match** (one right answer).
**Tier B = LLM-judge** (open-ended). Tier A is strictly better for winning rank 1 — we can be
exactly right on demand, but cannot guarantee an LLM agrees with us.

The three zero-occupancy intents (`RESEARCH_SYNTHESIS`, `TEXT_AUTHENTICITY_CHECK`,
`TWITTER_SEARCH`) are **all Tier B**, which is why `TEXT_AUTHENTICITY_CHECK` was dropped despite
being the occupancy front-runner.

`SSL_VERIFICATION` is Tier A with **3 incumbents, each with a specific weakness**:
- **TxLens** (9002) — on Render, cold starts against a ~20s spot-check cadence; SSL is 1 of 8 caps
- **certspotter** (10) — answers from **CT logs** = what was *issued*, not what is *deployed*
- **ssllabs** (227) — a full Qualys assessment takes **60–120s** on an uncached host

### Built: `livecert`
[miner/](miner/) — Node, **zero runtime dependencies**, live TLS handshake. All six verdicts
verified against badssl.com (valid / expired / self_signed / hostname_mismatch / untrusted /
unreachable). ~100ms cold, **12ms cached**. Typecheck clean.
[miner.yaml](miner.yaml) written and passing a local strict-schema precheck.
`slug: livecert`, `id: 4433` — both verified free.

**Scoring insight driving the response shape:** the WASM scorer compares *plain strings* and the
reference module scores `matched ÷ total words in the miner's answer`. Verbose answers are
**penalised**. Our `reason` is one tight factual sentence on purpose — and SSL Labs returning a
full grade report is actively hurt by that arithmetic.

### Next action — blocked on the user
**T1.3** — deploy `miner/` to get a public HTTPS URL. `Dockerfile` and `fly.toml` are ready
(`min_machines_running = 1`, non-negotiable per A3). That URL becomes `base_url` in miner.yaml,
after which registration can proceed.

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
