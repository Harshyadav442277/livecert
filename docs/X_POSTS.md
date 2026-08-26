# X_POSTS.md — drafts

**25% of the Track 1 score.** Tag `@Telegraphprotoc` on every post. Judged on *"quality,
consistency, reach, and meaningful engagement"* — so cadence matters as much as content, and a
burst on the final day scores badly.

**I draft, you post.** These go out from your account, in your voice — edit freely.

Every claim below is verified. Do not post a number that has not actually happened yet.

---

## Post 1 — the correction (ready now)

The strongest opener is a genuinely useful correction, not a "day 1, starting my build" post.
This one helps every other entrant, which is what actually earns reach.

> Most people registering a @Telegraphprotoc miner think they have to build and host an API.
>
> You don't. `base_url` points at the **upstream** — the protocol proxies to it. A valid miner
> can be pure YAML, zero code.
>
> Took me two hours and a read of the spec to figure that out.

## Post 2 — the strategy insight (ready now)

> Reading @Telegraphprotoc's routing rules before picking an intent, and it completely changed
> what I built.
>
> Routing is 70/20/10 to ranks 1/2/3. **4th place gets nothing.**
>
> So intent selection matters more than implementation quality. Rank 1 in a quiet intent beats
> rank 4 in a popular one — by infinity.
>
> Pulled the live occupancy numbers before choosing.

## Post 3 — the tier insight (ready now)

> Subtle thing in the @Telegraphprotoc docs that decided my whole build:
>
> Intents are scored in two tiers.
> **Tier A** — deterministic, WASM exact match. One right answer.
> **Tier B** — LLM-judge. Open-ended.
>
> Three intents had ZERO miners. All three were Tier B.
>
> I took a Tier A intent with 3 incumbents instead. I'd rather solve a problem than hope a judge
> agrees with me.

## Post 4 — endpoint live (**after** Step 1 deploys)

> `livecert` is live — a TLS certificate miner for @Telegraphprotoc.
>
> Live handshake against the host, ~100ms cold / 12ms cached.
>
> The differentiator: the existing cert miner answers from **certificate-transparency logs**.
> CT tells you what was *issued*. It cannot tell you what the server actually has *deployed*.
> Those disagree exactly when you care — a host still serving an expired cert.
>
> [screenshot of expired.badssl.com returning verdict=expired]

## Post 5 — registered (**after** Step 3)

> Registered on-chain. `livecert`, id 4433, serving SSL_VERIFICATION on @Telegraphprotoc.
>
> registrationId: `<fill in>`
> tx: `<basescan link>`
>
> No bond, no stake, no permission needed. Gas on Base Sepolia and that's it.

## Post 6 — first traffic (**after** grace period traffic arrives)

> First routed requests hitting `livecert`.
>
> Grace period on @Telegraphprotoc gives new miners an equal share of 5% of traffic for 7 days,
> so you build a track record before you're ranked.
>
> Genuinely good design — new miners aren't dead on arrival.

## Post 7 — open invitation (post **before Aug 31**, when Track 3 opens)

This one is doing real work: an intent needs **≥100 real Track 3 requests** to be prize-eligible
(G13). Track 3 builders pick miners that look alive and maintained.

> Track 3 opens Aug 31 on @Telegraphprotoc — build apps on live miners.
>
> If you're building anything that touches domains, `livecert` gives you real TLS cert status:
> valid / expired / self-signed / hostname-mismatch / untrusted, with issuer and days-remaining.
>
> Intent: `SSL_VERIFICATION`. Free to call. Ask me anything.

## Post 8 — ranked (**after** grace period ends)

> `livecert` is ranked #<n> for SSL_VERIFICATION on @Telegraphprotoc.
>
> <one honest sentence about what moved the score>

---

## Rules

- **Verified claims only.** A wrong claim about the protocol, in public, under your name, is worse
  than not posting. Every latency number here came from an actual measurement.
- **Never** post a key, seed phrase, private key, or `.env` contents. Crop screenshots and check
  them before sending.
- Tag `@Telegraphprotoc` every time — the rules require it for judging.
- Reply to people who engage. *"Meaningful engagement"* is in the criteria, and a thread that
  answers questions outperforms a broadcast.
