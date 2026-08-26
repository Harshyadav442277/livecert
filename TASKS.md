# TASKS.md — execution board

One task = one change = one commit. Work top-down; the ordering encodes dependencies.

**Deadline: 2026-09-07 12:00 UTC.** Days remaining from 2026-08-26: ~12.

---

## Phase 0 — Decide (blocking; nothing else starts until this closes)

- [x] **T0.1** Fetch live intent occupancy → [docs/INTENT_OCCUPANCY.md](docs/INTENT_OCCUPANCY.md).
      45 canonical intents; 3 at zero. (closes G3; narrows G1)
- [x] **T0.2** Read Intents + Build a Scoring Module. Scoring is a WASM module over three plain
      strings; verbose answers are penalised by word-overlap. (closes G4)
- [ ] **T0.3** Read the [hackathon rules](https://hackathon.telegraphprotocol.com/rules) — eligibility,
      submission format, team size. Cheap, and invalidates work if wrong. (closes G12)
- [ ] **T0.4** Pull `example-miner.yaml` from
      [telegraph-usecases](https://github.com/telegraphprotocol/telegraph-usecases). (closes G5)
- [ ] **T0.5** Re-read the truncated tails of the YAML-config and registration doc pages. (closes G6)
- [x] **T0.6** D1 = `SSL_VERIFICATION`, D2 = host our own. PRD scope frozen.

## Phase 1 — Prove the upstream

- [x] **T1.1** Runtime spike: Node `tls.connect()` required; Workers cannot read peer certs. (closes G2)
- [x] **T1.2** Built [miner/](miner/) — Node, zero runtime deps. All 6 verdicts verified against
      the badssl.com suite. Typecheck clean.
- [ ] **T1.3** *User:* deploy and get the public HTTPS URL. **This is the `base_url`.**
      `fly.toml` + `Dockerfile` are ready; needs a host account. Then update `base_url` in miner.yaml.
- [ ] **T1.4** Measure deployed cold-start and p95 latency against the ~20s cadence (A3).
      Local baseline: ~100ms cold handshake, **12ms cached**.

## Phase 2 — Author the YAML

- [x] **T2.1** `slug: livecert`, `id: 4433` — both verified free against the live 89-miner catalog.
- [x] **T2.2** [miner.yaml](miner.yaml) written; passes a local strict-schema precheck.
- [x] **T2.3** No `limitations[]` needed — we have no third-party upstream, so no account quota
      to declare. This is a direct benefit of D2.
- [x] **T2.4** No `errors` block — our service uses real HTTP status codes, never a liar-200 (A5).
- [ ] **T2.5** Verify every declared intent with `isCanonicalIntent(string)`. Exact case. One bad
      string reverts the whole transaction.
- [ ] **T2.6** Sandbox-validate at `integrate.telegraphprotocol.com` until every endpoint passes. (A2)

## Phase 3 — Register (user drives all wallet steps)

- [ ] **T3.1** *User:* fund a Base Sepolia wallet with testnet ETH for gas. (closes G7)
- [ ] **T3.2** *User:* decide the fee address. (D4)
- [ ] **T3.3** *User:* connect wallet at the console, pin YAML to IPFS, send `registerMiner`.
- [ ] **T3.4** Capture the `registrationId` from the receipt. Record it in MEMORY.md — every
      lookup from here uses it, never the slug.
- [ ] **T3.5** Confirm `activation_status: active` at `/api/miners/<registrationId>`. (closes S1)
- [ ] **T3.6** If the upstream needs an API key: install it via the EIP-191 challenge flow. Only
      possible after registration. *User signs.*

## Phase 4 — Operate through the grace period

- [ ] **T4.1** Build the uptime watcher — poll `activation_status` and alert on revocation. (closes G10)
- [ ] **T4.2** Watch the first 7 days. Grace period gives an equal share of 5% of traffic; the score
      earned here sets the opening leaderboard position. Zero revocations is the target. (S2)
- [ ] **T4.3** Tune latency and correctness from observed spot-check behaviour.
- [ ] **T4.4** Track rank once ranked. (S3, S4)

## Phase 5 — Build in public (runs in parallel from day 1, not at the end)

- [ ] **T5.1** Start the X log — see [docs/BUILD_IN_PUBLIC.md](docs/BUILD_IN_PUBLIC.md). Judged on
      every track. (G11)
- [ ] **T5.2** Post at each milestone: intent chosen, endpoint live, registered, first traffic, ranked.
- [ ] **T5.3** Write the README with an honest Assumptions & Limitations section sourced from GAPS.md.
- [ ] **T5.4** Submit before 2026-09-07 12:00 UTC. Do not discover the submission format on the last day.

---

## Done

- [x] Verified the protocol mechanics against live docs → [docs/TELEGRAPH_FACTS.md](docs/TELEGRAPH_FACTS.md)
- [x] Established that `base_url` is the **upstream** API — a miner can be pure YAML, no server
- [x] Hackathon account registered; Discord joined
- [x] Track 1 (Miner) chosen
- [x] Planning docs written
