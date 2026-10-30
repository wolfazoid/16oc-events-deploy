import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import worker from "../../worker/src/index.js";
import { SITES } from "../../worker/src/sites.js";

const realFetch = globalThis.fetch;
const realCaches = globalThis.caches;
afterEach(() => {
  globalThis.fetch = realFetch;
  globalThis.caches = realCaches;
});

function memoryCache() {
  const store = new Map();
  return {
    keys: () => [...store.keys()],
    async match(req) {
      const hit = store.get(req.url);
      return hit ? hit.clone() : undefined;
    },
    async put(req, res) {
      store.set(req.url, res.clone());
    },
  };
}

function makeKV(seed = {}) {
  const store = new Map(Object.entries(seed).map(([k, v]) => [k, JSON.stringify(v)]));
  return {
    store,
    async get(key, type) {
      const v = store.get(key);
      if (v === undefined) return null;
      return type === "json" ? JSON.parse(v) : v;
    },
    async put(key, value) {
      store.set(key, value);
    },
  };
}

const ctx = { waitUntil() {} };
const ev = (id) => ({
  id,
  name: id,
  url: `https://www.ticketmaster.com/${id}`,
  dates: { start: { localDate: "2026-12-01", dateTime: "2026-12-02T01:00:00Z" } },
});
const snap = (ids) => ({ site: "saltshed", builtAt: "2026-10-30T15:00:00Z", events: ids.map(ev), requests: [] });
const mkEnv = (kv) => ({
  SNAPSHOTS: kv,
  UPSTREAM_BASE: "https://tm.test/v2",
  ADMIN_TOKEN: "admintoken123",
  TM_KEY_SALTSHED: "SECRETKEY-saltshed",
  TM_KEY_THALIA: "SECRETKEY-thalia",
  TM_KEY_SPACE: "SECRETKEY-space",
  TM_KEY_EMPTYBOTTLE: "SECRETKEY-eb",
  TM_KEY_DEFAULT: "SECRETKEY-default",
});
const get = (path, env, init) => worker.fetch(new Request(`https://hub.test${path}`, init), env, ctx);
const freshMeta = (over = {}) => ({
  lastAttemptAt: new Date().toISOString(),
  lastSuccessAt: new Date().toISOString(),
  lastError: null,
  kept: false,
  capped: false,
  ...over,
});
const allMeta = (over = {}) => Object.fromEntries(Object.keys(SITES).map((id) => [`meta:${id}`, freshMeta(over)]));

test("serves events from the snapshot", async () => {
  const env = mkEnv(makeKV({ "snapshot:saltshed": snap(["a", "b"]) }));
  const res = await get("/v1/saltshed/events.json", env);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body._embedded.events.map((e) => e.id), ["a", "b"]);
  assert.equal(res.headers.get("cache-control"), "public, max-age=300");
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
});

test("503 when no snapshot", async () => {
  const res = await get("/v1/saltshed/events.json", mkEnv(makeKV()));
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { error: "snapshot unavailable" });
});

test("404 for unknown site and for promontory", async () => {
  const env = mkEnv(makeKV());
  assert.equal((await get("/v1/nope/events.json", env)).status, 404);
  assert.equal((await get("/v1/promontory/events.json", env)).status, 404);
  assert.equal((await get("/v1/saltshed/other.json", env)).status, 404);
  assert.equal((await get("/", env)).status, 404);
});

test("OPTIONS returns 204 with CORS; non-GET is 405", async () => {
  const env = mkEnv(makeKV());
  const o = await get("/v1/saltshed/events.json", env, { method: "OPTIONS" });
  assert.equal(o.status, 204);
  assert.equal(o.headers.get("access-control-allow-origin"), "*");
  assert.equal((await get("/v1/saltshed/events.json", env, { method: "POST" })).status, 405);
});

test("event detail 404 when missing, 200 when present", async () => {
  const env = mkEnv(makeKV({ "snapshot:saltshed": snap(["a"]) }));
  const miss = await get("/v1/saltshed/events/zzz.json", env);
  assert.equal(miss.status, 404);
  assert.deepEqual(await miss.json(), { error: "not found" });
  const hit = await get("/v1/saltshed/events/a.json", env);
  assert.equal(hit.status, 200);
  assert.equal((await hit.json()).id, "a");
});

test("venues and classifications proxy with the site key", async () => {
  const seen = [];
  globalThis.fetch = async (url) => {
    seen.push(String(url));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const env = mkEnv(makeKV());
  const v = await get("/v1/saltshed/venues/KovZ917AI5F.json?locale=en", env);
  assert.equal(v.status, 200);
  assert.equal(v.headers.get("cache-control"), "public, max-age=86400");
  const c = await get("/v1/saltshed/classifications.json", env);
  assert.equal(c.status, 200);
  assert.ok(seen[0].startsWith("https://tm.test/v2/venues/KovZ917AI5F.json"));
  assert.ok(seen[0].includes("apikey=SECRETKEY-saltshed"));
  assert.ok(seen[0].includes("locale=en"));
  assert.ok(seen[1].startsWith("https://tm.test/v2/classifications.json"));
  assert.ok(!(await v.text()).includes("SECRETKEY"));
});

test("health degraded when stale or capped", async () => {
  const stale = new Date(Date.now() - 31 * 60 * 1000).toISOString();
  let res = await get("/health", mkEnv(makeKV({ ...allMeta(), "meta:saltshed": freshMeta({ lastSuccessAt: stale }) })));
  assert.equal(res.status, 503);
  assert.equal((await res.json()).status, "degraded");

  res = await get("/health", mkEnv(makeKV({ ...allMeta(), "meta:thalia": freshMeta({ capped: true }) })));
  assert.equal(res.status, 503);

  const noMeta = allMeta();
  delete noMeta["meta:space"];
  res = await get("/health", mkEnv(makeKV(noMeta)));
  assert.equal(res.status, 503);

  res = await get("/health", mkEnv(makeKV(allMeta())));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
  assert.deepEqual(Object.keys(body.sites).sort(), Object.keys(SITES).sort());
});

test("admin refresh requires the token", async () => {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return new Response(
      JSON.stringify({ _embedded: { events: [ev("x")] }, page: { size: 200, totalElements: 1, totalPages: 1, number: 0 } }),
      { status: 200 },
    );
  };
  const env = mkEnv(makeKV());
  const url = "/admin/refresh?site=saltshed";
  assert.equal((await get(url, env, { method: "POST" })).status, 401);
  assert.equal((await get(url, env, { method: "POST", headers: { Authorization: "Bearer wrong" } })).status, 401);
  assert.equal((await get(url, env, { method: "POST", headers: { Authorization: "Bearer admintoken12X" } })).status, 401);
  assert.equal(calls, 0);
  const noToken = { ...env, ADMIN_TOKEN: undefined };
  assert.equal((await get(url, noToken, { method: "POST", headers: { Authorization: "Bearer undefined" } })).status, 401);
  const ok = await get(url, env, { method: "POST", headers: { Authorization: "Bearer admintoken123" } });
  assert.equal(ok.status, 200);
  const results = await ok.json();
  assert.equal(results[0].site, "saltshed");
  assert.ok(calls > 0);
  assert.equal((await get("/admin/refresh?site=bogus", env, { method: "POST", headers: { Authorization: "Bearer admintoken123" } })).status, 404);
});

test("scheduled runs refreshAll via waitUntil", async () => {
  let p;
  globalThis.fetch = async () => new Response("{}", { status: 500 });
  const env = { ...mkEnv(makeKV()), UPSTREAM_BASE: "https://tm.test/v2" };
  worker.scheduled({}, env, { waitUntil: (x) => (p = x) });
  assert.ok(p && typeof p.then === "function");
  p.catch(() => {});
});

test("responses never contain an api key", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
  const kv = makeKV({ "snapshot:saltshed": snap(["a"]), ...allMeta({ lastError: null }) });
  const env = mkEnv(kv);
  const paths = [
    "/health",
    "/v1/saltshed/events.json",
    "/v1/saltshed/events/a.json",
    "/v1/saltshed/events/zzz.json",
    "/v1/saltshed/venues/x.json",
    "/v1/saltshed/classifications.json",
    "/v1/thalia/events.json",
    "/v1/promontory/events.json",
    "/nope",
  ];
  for (const p of paths) {
    const res = await get(p, env);
    assert.ok(!(await res.text()).includes("SECRETKEY"), p);
  }
});

const throwingKV = () => ({
  async get() {
    throw new Error("kv down SECRETKEY-saltshed");
  },
  async put() {},
});

test("KV failure on events returns 503 JSON with CORS", async () => {
  const res = await get("/v1/saltshed/events.json", mkEnv(throwingKV()));
  assert.equal(res.status, 503);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const text = await res.text();
  assert.deepEqual(JSON.parse(text), { error: "unavailable" });
});

test("KV failure on health returns 503 JSON with CORS", async () => {
  const res = await get("/health", mkEnv(throwingKV()));
  assert.equal(res.status, 503);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  assert.deepEqual(await res.json(), { error: "unavailable" });
});

test("upstream network failure on venues returns 502 JSON with CORS", async () => {
  globalThis.fetch = async () => {
    throw new Error("boom apikey=SECRETKEY-saltshed");
  };
  const res = await get("/v1/saltshed/venues/X.json", mkEnv(makeKV()));
  assert.equal(res.status, 502);
  assert.equal(res.headers.get("access-control-allow-origin"), "*");
  const text = await res.text();
  assert.ok(!text.includes("SECRETKEY"));
  assert.deepEqual(JSON.parse(text), { error: "upstream unavailable" });
});

test("pass-through ignores unknown params so they cannot bust the edge cache", async () => {
  const cache = memoryCache();
  globalThis.caches = { default: cache };
  const seen = [];
  globalThis.fetch = async (url) => {
    seen.push(new URL(url));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const env = mkEnv(makeKV());
  const a = await get("/v1/saltshed/classifications.json?r=1", env);
  const b = await get("/v1/saltshed/classifications.json?r=2", env);
  assert.equal(a.status, 200);
  assert.equal(b.status, 200);
  assert.equal(b.headers.get("x-cache"), "HIT");
  assert.equal(seen.length, 1);
  assert.equal(seen[0].searchParams.get("r"), null);
  assert.equal(cache.keys().length, 1);
});

test("pass-through forwards only allowed params, sorted into the cache key", async () => {
  const cache = memoryCache();
  globalThis.caches = { default: cache };
  const seen = [];
  globalThis.fetch = async (url) => {
    seen.push(new URL(url));
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  };
  const env = mkEnv(makeKV());
  await get("/v1/saltshed/venues/X.json?foo=1&locale=en&apikey=CLIENTKEY", env);
  const v = seen[0];
  assert.deepEqual([...v.searchParams.keys()].sort(), ["apikey", "locale"]);
  assert.equal(v.searchParams.get("locale"), "en");
  assert.equal(v.searchParams.get("apikey"), "SECRETKEY-saltshed");

  await get("/v1/saltshed/classifications.json?size=5&foo=bar&page=2&locale=en&sort=x", env);
  const c = seen[1];
  assert.deepEqual([...c.searchParams.keys()].sort(), ["apikey", "locale", "page", "size"]);

  // Same allowed params in a different order hit the same cache entry.
  await get("/v1/saltshed/classifications.json?locale=en&page=2&size=5", env);
  assert.equal(seen.length, 2);
  const keys = cache.keys();
  assert.equal(keys.length, 2);
  for (const k of keys) {
    assert.ok(k.includes("/saltshed/"), k);
    assert.ok(!k.includes("foo") && !k.includes("apikey") && !k.includes("CLIENTKEY"), k);
  }
});
