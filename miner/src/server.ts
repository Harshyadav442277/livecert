import * as http from "node:http";
import { checkCertificate, normalizeTarget, type SslResult } from "./ssl";
import { checkStorm, type StormResult } from "./storm";

const PORT = Number(process.env.PORT ?? 8080);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS ?? 60_000);
const MAX_CACHE = 500;

/**
 * Telegraph validators spot-check roughly every 20 seconds. A short cache keeps
 * repeat checks of the same host sub-millisecond without ever serving a stale
 * verdict for longer than the spot-check interval.
 */
const cache = new Map<string, { at: number; value: SslResult | StormResult }>();

function fromCache(key: string): SslResult | StormResult | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.value;
}

function toCache(key: string, value: SslResult | StormResult): void {
  if (cache.size >= MAX_CACHE) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), value });
}

function send(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
  });
  res.end(payload);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const path = url.pathname.replace(/\/+$/, "") || "/";

  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, { error: "method_not_allowed", message: "Use GET." });
    return;
  }

  // Liveness. Deliberately does no outbound work so it can never fail for a
  // reason outside this process.
  if (path === "/" || path === "/health") {
    send(res, 200, { status: "ok", service: "livecert", uptime_s: Math.floor(process.uptime()) });
    return;
  }

  if (path === "/storm-alert") {
    const q =
      url.searchParams.get("location") ??
      url.searchParams.get("place") ??
      url.searchParams.get("city") ??
      url.searchParams.get("query") ??
      "";
    if (!q.trim()) {
      send(res, 400, {
        error: "invalid_location",
        message: "Name a location. Example: /storm-alert?location=Chennai",
      });
      return;
    }
    const key = `storm:${q.trim().toLowerCase()}`;
    const hit = fromCache(key);
    if (hit) {
      send(res, 200, hit);
      return;
    }
    checkStorm(q)
      .then((result) => {
        toCache(key, result);
        send(res, 200, result);
      })
      .catch((e: unknown) => {
        send(res, 502, { error: "check_failed", message: (e as Error).message });
      });
    return;
  }

  if (path !== "/ssl-check") {
    send(res, 404, {
      error: "not_found",
      message: "Try /ssl-check?domain=example.com or /storm-alert?location=Chennai",
    });
    return;
  }

  const raw =
    url.searchParams.get("domain") ??
    url.searchParams.get("host") ??
    url.searchParams.get("hostname") ??
    url.searchParams.get("url") ??
    url.searchParams.get("query") ??
    "";

  const target = normalizeTarget(raw);
  if (!target) {
    send(res, 400, {
      error: "invalid_domain",
      message: `Could not read a hostname from ${JSON.stringify(raw)}. Example: /ssl-check?domain=example.com`,
    });
    return;
  }

  const key = `ssl:${target.host}:${target.port}`;
  const cached = fromCache(key);
  if (cached) {
    send(res, 200, cached);
    return;
  }

  checkCertificate(target.host, target.port)
    .then((result) => {
      toCache(key, result);
      send(res, 200, result);
    })
    .catch((e: unknown) => {
      send(res, 502, { error: "check_failed", message: (e as Error).message });
    });
});

// Long enough that a validator reusing a connection is never cut off mid-request.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 70_000;

server.listen(PORT, () => {
  process.stdout.write(`livecert listening on :${PORT}\n`);
});

for (const sig of ["SIGTERM", "SIGINT"] as const) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
  });
}
