# BUILD_IN_PUBLIC.md — the judged social layer

This file exists because **posting is 25% of the score.** Not a tiebreaker, not marketing — a
quarter of the total, published in the rules. It is the part of a hackathon engineers reliably
neglect, and here it outweighs every implementation detail combined.

---

## What is actually being judged

From the [rules page](https://hackathon.telegraphprotocol.com/rules), Track 1 is scored out of 100:

```
75 pts   Normalized Performance   (your score ÷ the best score in your intent)
25 pts   Engagement & Updates on X
```

Because the best miner in an intent automatically gets the **full 75**, the performance half
saturates the moment we hold rank 1. Past that point, **X is the only axis left to compete on.**

Two hard requirements from the rules:

- Updates must be **publicly posted on X** and **tagged `@Telegraphprotoc`**.
- Judged on *"quality, consistency, reach, and meaningful engagement"* — so cadence and substance
  both count, and a burst of posts on the final day scores badly on consistency.

## Posting also protects prize eligibility

An intent is only eligible for cash prizes if it receives **≥100 real requests from Track 3
applications** (G13). Track 3 opens **Aug 31**, and those builders pick miners that are visible and
look maintained.

So posting is not adjacent to the technical work — it is one of the two levers on the guardrail
that decides whether any of this is eligible at all. **Posting before Aug 31 matters far more than
posting after**, because that is when Track 3 builders are choosing what to build on.

## Cadence

Roughly one post per real milestone. Not daily filler — a log nobody reads scores nothing, and
volume without substance reads as noise.

| When | Post | Hook |
|---|---|---|
| Intent chosen | Which intent, and the occupancy data behind the choice | Showing the reasoning is more interesting than the answer |
| Endpoint live | The URL, latency numbers | Something concrete people can hit |
| Registered | `registrationId`, tx link, Explorer link | Proof, on-chain |
| First traffic | Grace-period requests arriving | The system visibly working |
| Ranked | Leaderboard position after the 7-day grace period | The payoff post |
| Open invitation | "Here is the miner, build on it" — aimed at Track 3 | Directly targets the applications-built criterion |

## What to actually write

The strongest material is the **non-obvious thing learned**, not the status update. Things already
in hand that qualify:

- `base_url` is the upstream API — a Telegraph miner can be pure YAML with **zero code**. Most
  people assume they have to build and host a service. That is a genuinely useful correction.
- Routing is **70/20/10 and nothing to 4th** — so intent selection beats implementation quality.
- Spot checks every ~20s with revocation at a 20% score drop — free tiers that sleep will get
  silently removed from routing.
- `additionalProperties: false` everywhere, and `input_schema` nested under an endpoint is the
  natural guess that gets your registration rejected.

Each of those is a post that helps someone else, which is what actually earns reach. Status updates
that help nobody ("day 3, still building") earn none.

## Rules

- Everything posted must be true and verified. A wrong claim about the protocol, in public, under
  our name, is worse than silence.
- Never post a key, seed, private key, or `.env` content. Screenshots get cropped and checked.
- Tag/attribute Telegraph where relevant — reach comes partly from their amplification.
- The account posting is the user's. **Claude drafts; the user posts.** No exceptions.

## Status

Not started. Tracked as **G11** in [GAPS.md](../GAPS.md) and **T5.1** in [TASKS.md](../TASKS.md).
The first post should go up at the intent decision (T0.6) — the reasoning is the content.
