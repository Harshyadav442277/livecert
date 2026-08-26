import * as http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { load, save, latest, type State } from "./store.js";
import { runOnce, checkDomain } from "./monitor.js";
import { record } from "./store.js";
import { payerAddress } from "./telegraph.js";

const PORT = Number(process.env.PORT ?? 3000);
const INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS ?? 6 * 60 * 60 * 1000);
const HERE = dirname(fileURLToPath(import.meta.url));
const INDEX = resolve(HERE, "../public/index.html");

let state: State = await load();

function json(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(payload) });
  res.end(payload);
}

async function readBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as Record<string, unknown>;
  } catch {
    return {};
  }
}

const server = http.createServer((req, res) => {
  void (async () => {
    const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (path === "/" && req.method === "GET") {
        const html = await readFile(INDEX, "utf8");
        res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        res.end(html);
        return;
      }

      if (path === "/api/state" && req.method === "GET") {
        json(res, 200, {
          domains: state.domains,
          latest: latest(state),
          totals: state.totals,
          payer: payerAddress(),
          keyConfigured: Boolean(process.env.EVM_PRIVATE_KEY),
        });
        return;
      }

      if (path === "/api/domains" && req.method === "POST") {
        const body = await readBody(req);
        const domain = String(body["domain"] ?? "").trim().toLowerCase();
        if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) {
          json(res, 400, { error: "invalid domain" });
          return;
        }
        if (!state.domains.includes(domain)) {
          state.domains.push(domain);
          await save(state);
          // Check it immediately so the dashboard is never empty on first add.
          const check = await checkDomain(domain);
          record(state, check);
          await save(state);
        }
        json(res, 200, { ok: true, domains: state.domains });
        return;
      }

      if (path === "/api/domains" && req.method === "DELETE") {
        const domain = String(url.searchParams.get("domain") ?? "").toLowerCase();
        state.domains = state.domains.filter((d) => d !== domain);
        await save(state);
        json(res, 200, { ok: true, domains: state.domains });
        return;
      }

      if (path === "/api/check" && req.method === "POST") {
        state = await runOnce(state);
        json(res, 200, { ok: true, latest: latest(state), totals: state.totals });
        return;
      }

      json(res, 404, { error: "not found" });
    } catch (e) {
      json(res, 500, { error: (e as Error).message });
    }
  })();
});

server.listen(PORT, () => {
  console.log(`certwatch dashboard on http://localhost:${PORT}`);
  console.log(`paying from ${payerAddress() ?? "(EVM_PRIVATE_KEY not set — checks will fail)"}`);
});

if (INTERVAL_MS > 0) {
  setInterval(() => {
    console.log(`[${new Date().toISOString()}] scheduled sweep`);
    runOnce(state).catch((e) => console.error("sweep failed:", (e as Error).message));
  }, INTERVAL_MS);
}
