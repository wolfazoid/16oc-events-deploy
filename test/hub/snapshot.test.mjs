import { test } from "node:test";
import assert from "node:assert/strict";
import { SITES } from "../../worker/src/sites.js";
import { buildSnapshot, saveSnapshot, loadSnapshot, refreshAll } from "../../worker/src/snapshot.js";

const NOW = new Date("2026-10-30T15:00:00Z");
const base = "https://tm.test/v2";

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

const ev = (id, name = id) => ({
  id,
  name,
  url: `https://www.ticketmaster.com/${id}`,
  dates: { start: { localDate: "2026-12-01", dateTime: "2026-12-02T01:00:00Z" } },
});

// handler(params: URLSearchParams) -> { status, events, totalPages }
function fakeFetch(handler) {
  return async (url) => {
    const qs = new URL(url).searchParams;
    const { status = 200, events = [], totalPages = 1 } = handler(qs) || {};
    return {
      ok: status >= 200 && status < 300,
      status,
      json: async () => ({
        _embedded: { events },
        page: { size: 200, totalElements: events.length, totalPages, number: 0 },
      }),
    };
  };
}

const envFor = (kv) => ({
  SNAPSHOTS: kv,
  UPSTREAM_BASE: base,
  TM_KEY_SALTSHED: "k1",
  TM_KEY_THALIA: "k2",
  TM_KEY_EMPTYBOTTLE: "k3",
  TM_KEY_SPACE: "k4",
  TM_KEY_DEFAULT: "k5",
});

test("builds a snapshot with selected events and request meta", async () => {
  const fetchImpl = fakeFetch(() => ({ events: [ev("a", "Good Band"), ev("b", "Oliver Tree")] }));
  const snap = await buildSnapshot(SITES.saltshed, { apiKey: "K", baseUrl: base, fetchImpl, now: NOW, delayMs: 0 });
  assert.equal(snap.site, "saltshed");
  assert.equal(snap.builtAt, NOW.toISOString());
  assert.deepEqual(snap.events.map((e) => e.id), ["a"]);
  assert.equal(snap.requests.length, 1);
  assert.deepEqual(Object.keys(snap.requests[0]).sort(), ["capped", "pagesRead", "params", "totalElements"]);
});

test("rejects when any request fails", async () => {
  const fetchImpl = fakeFetch((qs) => (qs.get("promoterId") ? { status: 500 } : { events: [ev("a")] }));
  await assert.rejects(
    buildSnapshot(SITES.space, { apiKey: "K", baseUrl: base, fetchImpl, now: NOW, delayMs: 0 }),
    /TM 500/,
  );
});

test("refreshAll keeps the previous snapshot when a site fails", async () => {
  const prev = { site: "space", builtAt: "old", events: Array.from({ length: 20 }, (_, i) => ev(`p${i}`)), requests: [] };
  const kv = makeKV({ "snapshot:space": prev, "meta:space": { lastSuccessAt: "earlier" } });
  const fetchImpl = fakeFetch((qs) => (qs.get("apikey") === "k4" ? { status: 500 } : { events: [ev("t1")] }));
  const res = await refreshAll(envFor(kv), { fetchImpl, now: NOW, delayMs: 0, siteIds: ["space", "thalia"] });
  assert.deepEqual(await kv.get("snapshot:space", "json"), prev);
  const meta = await kv.get("meta:space", "json");
  assert.match(meta.lastError, /TM 500/);
  assert.equal(meta.lastSuccessAt, "earlier");
  assert.equal(meta.kept, true);
  assert.equal(res[0].saved, false);
  assert.equal(res[1].saved, true);
  assert.equal((await kv.get("snapshot:thalia", "json")).events.length, 1);
  assert.equal((await kv.get("meta:thalia", "json")).lastError, null);
});

test("refreshAll treats a missing key binding as a failed site and never leaks keys", async () => {
  const kv = makeKV();
  const env = envFor(kv);
  delete env.TM_KEY_THALIA;
  const fetchImpl = fakeFetch(() => ({ status: 401 }));
  const res = await refreshAll(env, { fetchImpl, now: NOW, delayMs: 0, siteIds: ["thalia", "space"] });
  assert.equal(res[0].saved, false);
  assert.match((await kv.get("meta:thalia", "json")).lastError, /TM_KEY_THALIA/);
  assert.equal(res.length, 2);
  for (const v of kv.store.values()) assert.ok(!v.includes("k4"));
});

test("drop guard refuses a collapse", async () => {
  const prev = { site: "space", builtAt: "old", events: Array.from({ length: 20 }, (_, i) => ev(`p${i}`)), requests: [] };
  const kv = makeKV({ "snapshot:space": prev });
  const small = { site: "space", builtAt: "new", events: [ev("x"), ev("y"), ev("z")], requests: [] };
  assert.deepEqual(await saveSnapshot(kv, small), { saved: false, reason: "drop-guard" });
  assert.deepEqual(await loadSnapshot(kv, "space"), prev);

  const kv2 = makeKV({ "snapshot:space": { ...prev, events: prev.events.slice(0, 5) } });
  const empty = { site: "space", builtAt: "new", events: [], requests: [] };
  assert.deepEqual(await saveSnapshot(kv2, empty), { saved: true });
  assert.deepEqual(await loadSnapshot(kv2, "space"), empty);
});

test("loadSnapshot returns null when absent", async () => {
  assert.equal(await loadSnapshot(makeKV(), "space"), null);
});

test("meta carries capped", async () => {
  const kv = makeKV();
  const fetchImpl = fakeFetch(() => ({ events: [ev("a")], totalPages: 8 }));
  await refreshAll(envFor(kv), { fetchImpl, now: NOW, delayMs: 0, siteIds: ["sixteenoc"] });
  assert.equal((await kv.get("meta:sixteenoc", "json")).capped, true);
});

test("refreshAll records a drop-guard block as an error and does not advance lastSuccessAt", async () => {
  const prev = { site: "thalia", builtAt: "old", events: Array.from({ length: 20 }, (_, i) => ev(`p${i}`)), requests: [] };
  const kv = makeKV({ "snapshot:thalia": prev, "meta:thalia": { lastSuccessAt: "earlier", lastError: null } });
  const fetchImpl = fakeFetch(() => ({ events: [ev("a"), ev("b"), ev("c")] }));
  const res = await refreshAll(envFor(kv), { fetchImpl, now: NOW, delayMs: 0, siteIds: ["thalia"] });
  assert.deepEqual(await kv.get("snapshot:thalia", "json"), prev);
  const meta = await kv.get("meta:thalia", "json");
  assert.match(meta.lastError, /drop-guard/);
  assert.equal(meta.lastError, "drop-guard: kept 20 events, refused 3");
  assert.equal(meta.lastSuccessAt, "earlier");
  assert.equal(meta.kept, true);
  assert.equal(res[0].saved, false);
  assert.equal(res[0].reason, "drop-guard");
});

test("refreshAll never throws when the meta read fails", async () => {
  const kv = makeKV();
  const realGet = kv.get.bind(kv);
  kv.get = async (key, type) => {
    if (key === "meta:space") throw new Error("kv down");
    return realGet(key, type);
  };
  const fetchImpl = fakeFetch(() => ({ events: [ev("t1")] }));
  const res = await refreshAll(envFor(kv), { fetchImpl, now: NOW, delayMs: 0, siteIds: ["space", "thalia"] });
  assert.equal(res.length, 2);
  assert.match(res[0].error, /kv down/);
  assert.equal(res[0].saved, false);
  assert.equal(res[1].saved, true);
  assert.equal((await kv.get("snapshot:thalia", "json")).events.length, 1);
});
