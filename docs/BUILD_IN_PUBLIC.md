# BUILD_IN_PUBLIC.md — the judged social layer

This file exists because **posting is a scored criterion, not marketing.** It is the part of a
hackathon engineers reliably neglect, and here it is weighted alongside the code.

---

## What is actually being judged

From the [hackathon page](https://hackathon.telegraphprotocol.com), Track 1 (Miner):

> Telegraph ranking & performance
> Number of applications built on your Miner
> Total requests served
> **Progress updates posted on X**
> **Engagement & reach on those posts**

Five criteria. **Two are social. Two more are demand-side** — applications built on our miner, and
requests served — and neither is won by code quality alone. Someone has to know the miner exists.

Only *one* of the five is the thing engineers instinctively optimize.

## The compounding bit

Track 3 (Applications) opens **Aug 31** and those builders need miners to build on. They will pick
from whatever is visible and looks maintained. A miner nobody has heard of gets zero applications
built on it, which costs a judging criterion directly and costs served-request volume indirectly.

So the posting is not adjacent to the technical work — it feeds two of the other criteria. Posting
before Aug 31 matters more than posting after.

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
