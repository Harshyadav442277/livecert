import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

/** A single check, as Telegraph answered it. */
export interface Check {
  domain: string;
  at: string;
  verdict: string | null;
  daysRemaining: number | null;
  issuer: string | null;
  validTo: string | null;
  minerName: string | null;
  minerId: string | null;
  intent: string | null;
  signalHash: string | null;
  costUsd: number | null;
  durationMs: number | null;
  error: string | null;
}

export interface State {
  domains: string[];
  checks: Check[];
  totals: { requests: number; spentUsd: number; sslVerificationRequests: number };
}

/**
 * Serverless filesystems are read-only apart from /tmp, and /tmp does not survive
 * between cold starts. So on Vercel the watchlist is seeded from WATCH_DOMAINS and
 * state is best-effort — the app still makes real, paid, verifiable Telegraph calls,
 * it just does not remember them across instances. Locally it persists normally.
 */
const ON_SERVERLESS = Boolean(process.env.VERCEL);
const FILE = resolve(process.env.STATE_FILE ?? (ON_SERVERLESS ? "/tmp/state.json" : "data/state.json"));
const MAX_CHECKS = 500;

/** Comma-separated seed list, so a fresh serverless instance is never empty. */
function seedDomains(): string[] {
  return (process.env.WATCH_DOMAINS ?? "")
    .split(",")
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.length > 0);
}

const empty: State = {
  domains: [],
  checks: [],
  totals: { requests: 0, spentUsd: 0, sslVerificationRequests: 0 },
};

export async function load(): Promise<State> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<State>;
    const domains = parsed.domains ?? [];
    for (const d of seedDomains()) if (!domains.includes(d)) domains.push(d);
    return {
      domains,
      checks: parsed.checks ?? [],
      totals: parsed.totals ?? { ...empty.totals },
    };
  } catch {
    return { domains: seedDomains(), checks: [], totals: { ...empty.totals } };
  }
}

export async function save(state: State): Promise<void> {
  // Best-effort: a read-only filesystem must not take the dashboard down.
  try {
    await mkdir(dirname(FILE), { recursive: true });
    const trimmed: State = { ...state, checks: state.checks.slice(-MAX_CHECKS) };
    await writeFile(FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch {
    /* ignore — state is in memory for the life of this instance */
  }
}

export function record(state: State, check: Check): void {
  state.checks.push(check);
  if (!check.error) {
    state.totals.requests += 1;
    state.totals.spentUsd = Number((state.totals.spentUsd + (check.costUsd ?? 0)).toFixed(6));
    // Tracked separately: the hackathon's prize-eligibility guardrail counts
    // requests to an *intent*, so what the router classified matters, not who served it.
    if (check.intent === "SSL_VERIFICATION") state.totals.sslVerificationRequests += 1;
  }
}

/** Latest check per domain, newest first. */
export function latest(state: State): Check[] {
  const seen = new Map<string, Check>();
  for (const c of state.checks) seen.set(c.domain, c);
  return [...seen.values()].sort((a, b) => (a.at < b.at ? 1 : -1));
}
