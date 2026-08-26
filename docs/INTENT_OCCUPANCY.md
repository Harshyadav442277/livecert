# INTENT_OCCUPANCY.md — where the empty slots are

Source: `GET https://devnode.telegraphprotocol.com/engine/v1/intents`
Captured **2026-08-26**. `canonical_on_chain: 45`.

Routing pays **70/20/10 to ranks 1/2/3 and nothing to 4th**, so occupancy is the single highest-
leverage input to the intent decision. Re-capture before committing — the set changes on-chain.

---

## The three empty intents

| Intent | Miners | Why it is probably empty |
|---|---|---|
| `RESEARCH_SYNTHESIS` | **0** | Needs multi-source retrieval **plus** LLM synthesis. Real per-call inference cost. Barrier is money. |
| `TEXT_AUTHENTICITY_CHECK` | **0** | Adjacent to `AI_TEXT_DETECTION` (2 miners) and easily mistaken for it. Barrier may be **only that people pick the obvious neighbour**. |
| `TWITTER_SEARCH` | **0** | X API is paywalled at ~$100+/month. Barrier is money. |

**An empty intent is not automatically an opportunity.** Two of these three are empty because they
cost real money per call, which is exactly why nobody has taken them — and why taking them is not
free for us either. `TEXT_AUTHENTICITY_CHECK` is the only one whose emptiness looks like an
oversight rather than an economic barrier.

## Thinly held (1–3 miners — rank 1 still reachable)

```
1 miner   CONTENT_EXTRACTION  CONTENT_MODERATION  CONTENT_VERIFICATION
          DEEPFAKE_DETECTION  FACT_CHECK  IP_GEOLOCATION
          MEDIA_AUTHENTICITY_CHECK  NEWS_HEADLINES  TELEGRAPH_KNOWLEDGE
          VIDEO_VERIFICATION

2 miners  ACADEMIC_SEARCH  AI_TEXT_DETECTION  CVE_LOOKUP  GAME_RESULT
          IMAGE_VERIFICATION  LANGUAGE_TRANSLATION  SENTIMENT_ANALYSIS
          SPORTS_SCORE  TEXT_GENERATION

3 miners  CURRENCY_EXCHANGE  SSL_VERIFICATION  STORM_ALERT  TEXT_CLASSIFICATION
```

## Crowded — avoid

```
 6  GAS_PRICE  RESEARCH_QUERY  TVL_LOOKUP  WALLET_BALANCE_CHECK
 7  AGENT_TASK  CRYPTO_PRICE  FINANCIAL_DATA  URL_SCAN  WEB_SEARCH
 8  WEATHER_CHECK
 9  WEATHER_FORECAST
10  CHAT_COMPLETION  ONCHAIN_TX_LOOKUP
11  FRAUD_DETECTION  LANGUAGE_GENERATION  TASK_COMPLETION
```

## Two earlier assumptions, now tested

**"Weather will be crowded because the docs' example wraps a weather API."** — **Confirmed.**
`WEATHER_CHECK` 8, `WEATHER_FORECAST` 9. Among the most contested on the board. Avoiding it was right.

**"`ONCHAIN_TX_LOOKUP` is a good pick for someone with blockchain experience."** — **Wrong.**
10 miners, tied for second-most crowded. Rank 4+ earns nothing, so prior familiarity with the
domain would have bought a zero. The blockchain-adjacent intents generally (`GAS_PRICE` 6,
`TVL_LOOKUP` 6, `WALLET_BALANCE_CHECK` 6, `CRYPTO_PRICE` 7, `ONCHAIN_TX_LOOKUP` 10) are where
crypto-native hackathon entrants cluster. Domain comfort pointed at the most contested corner of
the board.

## Read

The board splits into three economic zones:

1. **Free-to-wrap, objective** (weather, crypto price, gas price) — crowded, because a free upstream
   plus fifteen minutes of YAML is all it takes.
2. **Costly per call** (`RESEARCH_SYNTHESIS`, `TWITTER_SEARCH`) — empty, because the economics are
   genuinely hard, not because nobody noticed.
3. **Objective but needs actual work** (`SSL_VERIFICATION` 3, `CVE_LOOKUP` 2,
   `TEXT_AUTHENTICITY_CHECK` 0) — thin, because it requires building something rather than
   pointing at a URL.

Zone 3 is where a competent build wins a 70% slot. Zone 1 is a race to the bottom against people
who spent fifteen minutes. Zone 2 is a bill.
