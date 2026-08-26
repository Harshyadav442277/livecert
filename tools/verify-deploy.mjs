#!/usr/bin/env node
/**
 * Post-deploy acceptance check.
 *
 * Run this against the deployed URL BEFORE registering on-chain. Registration is
 * effectively immutable — a broken endpoint costs an updateMiner transaction and a
 * new registrationId. This proves the deployment behaves exactly like the local
 * build did, across every verdict path.
 *
 *   node tools/verify-deploy.mjs https://livecert.fly.dev
 *
 * Exits 0 only if everything passes.
 */

const base = (process.argv[2] ?? process.env.MINER_BASE_URL ?? "").replace(/\/+$/, "");
if (!base) {
  console.error("Usage: node tools/verify-deploy.mjs https://your-miner.fly.dev");
  process.exit(2);
}

const CASES = [
  ["github.com", "valid"],
  ["expired.badssl.com", "expired"],
  ["self-signed.badssl.com", "self_signed"],
  ["wrong.host.badssl.com", "hostname_mismatch"],
  ["untrusted-root.badssl.com", "untrusted"],
  ["no-such-host-xyz123-telegraph.invalid", "unreachable"],
];

let failures = 0;
const timings = [];

async function get(path, ms = 20_000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  const started = Date.now();
  try {
    const res = await fetch(`${base}${path}`, { signal: ac.signal });
    return { res, ms: Date.now() - started };
  } finally {
    clearTimeout(t);
  }
}

function report(ok, label, detail) {
  if (!ok) failures++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

console.log(`verifying ${base}\n`);

// 1. HTTPS is mandatory: the YAML declares an https base_url and validators use it.
report(base.startsWith("https://"), "served over HTTPS", base.startsWith("https://") ? "" : "base_url must be https for registration");

// 2. Health endpoint.
try {
  const { res, ms } = await get("/health");
  const body = await res.json();
  report(res.ok && body.status === "ok", "GET /health", `${res.status} in ${ms}ms`);
} catch (e) {
  report(false, "GET /health", e.message);
}

// 3. Every verdict path, against the deployed instance.
console.log("\n  verdict matrix:");
for (const [domain, expected] of CASES) {
  try {
    const { res, ms } = await get(`/ssl-check?domain=${encodeURIComponent(domain)}`);
    timings.push(ms);
    const body = await res.json();
    report(res.ok && body.verdict === expected, `${domain} -> ${expected}`, res.ok ? `got ${body.verdict}, ${ms}ms` : `HTTP ${res.status}`);
  } catch (e) {
    report(false, `${domain} -> ${expected}`, e.message);
  }
}

// 4. Input handling.
console.log("\n  input handling:");
try {
  const { res } = await get(`/ssl-check?domain=${encodeURIComponent("not a domain")}`);
  report(res.status === 400, "rejects a malformed domain with 400", `got ${res.status}`);
} catch (e) {
  report(false, "rejects a malformed domain with 400", e.message);
}
try {
  const { res } = await get(`/ssl-check?url=${encodeURIComponent("https://cloudflare.com/x")}`);
  const body = await res.json();
  report(res.ok && body.domain === "cloudflare.com", "accepts a full URL via ?url=", `domain=${body.domain}`);
} catch (e) {
  report(false, "accepts a full URL via ?url=", e.message);
}

// 5. Latency. Spot checks run every ~20s and latency feeds the score.
if (timings.length) {
  const sorted = [...timings].sort((a, b) => a - b);
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  console.log(`\n  latency: median ${sorted[Math.floor(sorted.length / 2)]}ms, p95 ${p95}ms, max ${sorted.at(-1)}ms`);
  if (p95 > 5000) {
    console.log("  !! p95 above 5s — validators spot-check every ~20s; this will cost score.");
    failures++;
  }
}

console.log(failures === 0 ? "\nALL CHECKS PASSED — safe to register." : `\n${failures} CHECK(S) FAILED — fix before registering.`);
process.exit(failures === 0 ? 0 : 1);
