# SETUP.md — the manual steps

Two things need your accounts and your hands. Everything else is done and committed.

**Do step 1 today.** Track 1 closes **2026-08-31**, and the 7-day grace-period score sets our
opening leaderboard position — every day of delay shortens the record we are judged on.

---

## Step 1 — Deploy the miner to Fly.io

`Dockerfile` and `fly.toml` are written and committed. This is signup plus two commands.

**1a. Create a Fly.io account** — https://fly.io/app/sign-up
A card is required for verification. A 256MB shared-cpu machine sits inside the free allowance;
this will not bill at our size.

**1b. Install flyctl** (Windows PowerShell):

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

Then reopen your terminal so `fly` is on PATH.

**1c. Log in:**

```bash
fly auth login
```

**1d. Deploy** — from the `miner/` directory:

```bash
cd miner && fly launch --no-deploy --copy-config --name livecert && fly deploy
```

If `livecert` is taken, pick another name and tell me — it has to match `app =` in `fly.toml`.

**1e. Confirm it works:**

```bash
curl "https://livecert.fly.dev/ssl-check?domain=expired.badssl.com"
```

You should get `"verdict":"expired"`. **Send me the URL** and I'll put it into `miner.yaml`
and run the sandbox validation.

> **Do not** set `min_machines_running = 0` or enable `auto_stop_machines`. Telegraph spot-checks
> every ~20 seconds and revokes routing on a 20% score drop — a cold start reads as a failure.
> This is exactly why the incumbent on Render is beatable.

---

## Step 2 — Create an EVM wallet and get Base Sepolia ETH

**I cannot do any of this for you.** Wallet creation, seed phrases, and signing are yours alone —
I won't ask for a seed phrase, and you should never paste one to me or into any site.

**2a. Install MetaMask** — https://metamask.io (browser extension). Create a new wallet.

Write the seed phrase on paper. Not in this repo, not in a file, not in a chat.
Consider using a **fresh wallet** for this hackathon rather than one holding real assets.

**2b. Add the Base Sepolia network.** MetaMask → Networks → Add network manually:

| Field | Value |
|---|---|
| Network name | `Base Sepolia` |
| RPC URL | `https://sepolia.base.org` |
| Chain ID | `84532` |
| Currency symbol | `ETH` |
| Block explorer | `https://sepolia.basescan.org` |

**2c. Get testnet ETH.** It is free and worthless — it only pays gas. Any of:

- https://www.alchemy.com/faucets/base-sepolia
- https://faucet.quicknode.com/base/sepolia
- https://console.optimism.io/faucet

A fraction of an ETH is plenty; registration is one transaction and there is **no bond or stake**.

**2d. Confirm** the balance shows on Base Sepolia in MetaMask, then tell me.

---

## Step 3 — Register (I prepare, you click)

Once steps 1 and 2 are done:

1. I put your deployed URL into `miner.yaml` as `base_url`
2. I run the sandbox validation at `integrate.telegraphprotocol.com` and fix anything it flags
3. **You** connect the wallet, review, and send the `registerMiner` transaction
4. I capture the `registrationId` and confirm `activation_status: active`

I do not connect wallets or send transactions. I'll have everything staged so your part is
reviewing and clicking.

---

## Step 4 — Ongoing: post on X

**25% of the score.** Tag `@Telegraphprotoc` on every update. Drafts are in
[docs/X_POSTS.md](docs/X_POSTS.md) — I write them, you post them from your account.

Judged on *"quality, consistency, reach, and meaningful engagement"*, so a steady cadence beats a
burst on the last day.

---

## What's already done

- `miner/` — the service. Node, zero runtime dependencies, all six verdicts verified against
  badssl.com. ~100ms cold, 12ms cached.
- `miner.yaml` — passes a local strict-schema precheck. `slug: livecert`, `id: 4433`, both verified free.
- `tools/watch.mjs` — uptime and revocation watcher.
- Full planning docs, judging analysis, and the intent decision with its reasoning.
