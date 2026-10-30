import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchAllEvents } from "../../worker/src/tm.js";

function fake(pages, status = 200) {
  const urls = [];
  const fetchImpl = async (url) => {
    urls.push(new URL(url));
    const n = Number(new URL(url).searchParams.get("page") || 0);
    return { ok: status >= 200 && status < 300, status, json: async () => pages[n] };
  };
  return { urls, fetchImpl };
}
const mk = (n, ids) => ({
  _embedded: { events: ids.map((id) => ({ id })) },
  page: { size: 200, totalElements: 999, totalPages: n, number: 0 },
});
const base = "https://app.ticketmaster.com/discovery/v2";

test("reads all pages", async () => {
  const { urls, fetchImpl } = fake([mk(3, ["a", "b"]), mk(3, ["c"]), mk(3, ["d"])]);
  const r = await fetchAllEvents({}, { apiKey: "K", baseUrl: base, fetchImpl, delayMs: 0 });
  assert.equal(urls.length, 3);
  assert.deepEqual(urls.map((u) => u.searchParams.get("page")), [null, "1", "2"]);
  assert.deepEqual(r.events.map((e) => e.id), ["a", "b", "c", "d"]);
  assert.equal(r.pagesRead, 3);
  assert.equal(r.capped, false);
  assert.equal(r.totalElements, 999);
});

test("caps at the deep-paging limit", async () => {
  const pages = Array.from({ length: 8 }, (_, i) => mk(8, [`e${i}`]));
  const { urls, fetchImpl } = fake(pages);
  const r = await fetchAllEvents({}, { apiKey: "K", baseUrl: base, fetchImpl, delayMs: 0 });
  assert.equal(urls.length, 5);
  assert.equal(r.capped, true);
  assert.equal(r.pagesRead, 5);
});

test("missing _embedded means no events", async () => {
  const { urls, fetchImpl } = fake([{ page: { totalPages: 0, totalElements: 0 } }]);
  const r = await fetchAllEvents({}, { apiKey: "K", baseUrl: base, fetchImpl, delayMs: 0 });
  assert.deepEqual(r.events, []);
  assert.equal(urls.length, 1);
  assert.equal(r.capped, false);
});

test("throws without leaking the key", async () => {
  const { fetchImpl } = fake([{}], 500);
  await assert.rejects(
    fetchAllEvents({}, { apiKey: "SECRETKEY", baseUrl: base, fetchImpl, delayMs: 0 }),
    (err) => err.message === "TM 500" && !err.message.includes("SECRETKEY"),
  );
});

test("sends apikey, size and sort", async () => {
  const { urls, fetchImpl } = fake([mk(1, ["a"])]);
  await fetchAllEvents({ venueId: "A,B", source: "ticketweb" }, { apiKey: "K", baseUrl: base, fetchImpl, delayMs: 0 });
  const u = urls[0];
  assert.equal(u.pathname, "/discovery/v2/events.json");
  assert.equal(u.searchParams.get("apikey"), "K");
  assert.equal(u.searchParams.get("size"), "200");
  assert.equal(u.searchParams.get("sort"), "date,asc");
  assert.equal(u.searchParams.get("venueId"), "A,B");
  assert.equal(u.searchParams.get("source"), "ticketweb");
});

test("times out a hung request with a key-free error", async () => {
  const signals = [];
  const fetchImpl = (url, init) =>
    new Promise((_, reject) => {
      signals.push(init?.signal);
      init?.signal?.addEventListener("abort", () => reject(init.signal.reason));
    });
  await assert.rejects(
    fetchAllEvents({}, { apiKey: "SECRETKEY", baseUrl: base, fetchImpl, delayMs: 0, timeoutMs: 20 }),
    (err) => /TM timeout/.test(err.message) && !err.message.includes("SECRETKEY") && !err.message.includes("http"),
  );
  assert.equal(signals.length, 1);
  assert.ok(signals[0]);
});
