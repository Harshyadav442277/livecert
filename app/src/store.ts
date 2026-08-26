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

const FILE = resolve(process.env.STATE_FILE ?? "data/state.json");
const MAX_CHECKS = 500;

const empty: State = {
  domains: [],
  checks: [],
  totals: { requests: 0, spentUsd: 0, sslVerificationRequests: 0 },
};

export async function load(): Promise<State> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      domains: parsed.domains ?? [],
      checks: parsed.checks ?? [],
      totals: parsed.totals ?? { ...empty.totals },
    };
  } catch {
    return { ...empty, domains: [], checks: [], totals: { ...empty.totals } };
  }
}

export async function save(state: State): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  const trimmed: State = { ...state, checks: state.checks.slice(-MAX_CHECKS) };
  await writeFile(FILE, JSON.stringify(trimmed, null, 2), "utf8");
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
