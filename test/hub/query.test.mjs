import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { queryEvents, findEvent } from "../../worker/src/query.js";

function ev(id, overrides = {}) {
  return {
    id,
    name: `Show ${id}`,
    dates: { start: { localDate: "2026-12-01", localTime: "20:00:00" }, status: { code: "onsale" } },
    _embedded: { venues: [{ id: "V1", name: "Venue One" }], attractions: [] },
    ...overrides,
  };
}
const at = (localDate, localTime) => ({ dates: { start: { localDate, localTime } } });
const q = (events, qs) => queryEvents(events, new URLSearchParams(qs));
const ids = (res) => (res._embedded ? res._embedded.events.map((e) => e.id) : []);

test("id keeps events in the comma list", () => {
  assert.deepEqual(ids(q([ev("A"), ev("B"), ev("C")], "id=A,C")), ["A", "C"]);
});

test("venueId matches any venue in a comma list", () => {
  const events = [ev("A"), ev("B", { _embedded: { venues: [{ id: "V2" }] } })];
  assert.deepEqual(ids(q(events, "venueId=V2,V9")), ["B"]);
});

test("multi-venue event matches on its second venue", () => {
  const e = ev("A", { _embedded: { venues: [{ id: "V1" }, { id: "V2" }] } });
  assert.deepEqual(ids(q([e], "venueId=V2")), ["A"]);
});

test("promoterId matches promoter or promoters[]", () => {
  const events = [ev("A", { promoter: { id: "P1" } }), ev("B", { promoters: [{ id: "P0" }, { id: "P2" }] }), ev("C")];
  assert.deepEqual(ids(q(events, "promoterId=P1")), ["A"]);
  assert.deepEqual(ids(q(events, "promoterId=P2")), ["B"]);
});

test("keyword matches event name or attraction name, case-insensitive, no regex", () => {
  const events = [
    ev("A", { name: "The BAND Night" }),
    ev("B", { _embedded: { venues: [], attractions: [{ name: "Cool Band" }] } }),
    ev("C", { name: "Other" }),
  ];
  assert.deepEqual(ids(q(events, "keyword=band")), ["A", "B"]);
  assert.deepEqual(ids(q(events, "keyword=.*")), []);
});

test("classificationName matches segment/genre/subGenre equality, case-insensitive", () => {
  const events = [
    ev("A", { classifications: [{ segment: { name: "Music" }, genre: { name: "Rock" }, subGenre: { name: "Indie" } }] }),
    ev("B", { classifications: [{ segment: { name: "Sports" } }] }),
    ev("C"),
  ];
  assert.deepEqual(ids(q(events, "classificationName=music")), ["A"]);
  assert.deepEqual(ids(q(events, "classificationName=INDIE")), ["A"]);
  assert.deepEqual(ids(q(events, "classificationName=Mus")), []);
});

test("local start/end bounds are inclusive and exclude undated events", () => {
  const events = [
    ev("A", at("2026-12-01", "19:00:00")),
    ev("B", at("2026-12-02", "20:00:00")),
    ev("C", at("2026-12-03")),
    ev("U", { dates: {} }),
  ];
  assert.deepEqual(ids(q(events, "localStartDateTime=2026-12-02T20:00:00")), ["B", "C"]);
  assert.deepEqual(ids(q(events, "localEndDateTime=2026-12-02T20:00:00")), ["A", "B"]);
  assert.deepEqual(ids(q(events, "localStartDateTime=2026-12-03T00:00:00&localEndDateTime=2026-12-03T00:00:00")), ["C"]);
  assert.deepEqual(ids(q(events, "")), ["A", "B", "C", "U"]);
});

test("sort date,asc is default, undated last", () => {
  const events = [ev("U", { dates: {} }), ev("B", at("2026-12-02", "20:00:00")), ev("A", at("2026-12-01", "20:00:00"))];
  assert.deepEqual(ids(q(events, "")), ["A", "B", "U"]);
  assert.deepEqual(ids(q(events, "sort=date,asc")), ["A", "B", "U"]);
});

test("sort by on-sale date asc and desc, missing last", () => {
  const sale = (d) => ({ sales: { public: { startDateTime: d } } });
  const events = [ev("N"), ev("A", sale("2026-01-02T00:00:00Z")), ev("B", sale("2026-01-01T00:00:00Z")), ev("C", sale("2026-01-03T00:00:00Z"))];
  assert.deepEqual(ids(q(events, "sort=onSaleStartDate,asc")), ["B", "A", "C", "N"]);
  assert.deepEqual(ids(q(events, "sort=onsaleStartDateTime,desc")), ["C", "A", "B", "N"]);
});

test("unknown params are ignored", () => {
  assert.deepEqual(ids(q([ev("A")], "source=ticketmaster&apikey=x&countryCode=US")), ["A"]);
});

test("size is clamped to 1..200", () => {
  const events = Array.from({ length: 5 }, (_, i) => ev(`E${i}`));
  assert.equal(q(events, "size=0").page.size, 1);
  assert.equal(q(events, "size=999").page.size, 200);
  assert.equal(q(events, "size=2").page.totalPages, 3);
});

test("empty result omits _embedded", () => {
  const res = q([ev("A")], "id=nope");
  assert.equal(res._embedded, undefined);
  assert.equal(res.page.totalElements, 0);
});

test("paging", () => {
  const events = Array.from({ length: 45 }, (_, i) => ev(`E${String(i).padStart(2, "0")}`, at("2026-12-01", `10:${String(i).padStart(2, "0")}:00`)));
  const res = q(events, "size=20&page=2");
  assert.equal(res._embedded.events.length, 5);
  assert.deepEqual(res.page, { size: 20, totalElements: 45, totalPages: 3, number: 2 });
  const beyond = q(events, "size=20&page=9");
  assert.equal(beyond._embedded, undefined);
  assert.deepEqual(beyond.page, { size: 20, totalElements: 45, totalPages: 3, number: 9 });
});

test("findEvent returns the event or null", () => {
  const events = [ev("A"), ev("B")];
  assert.equal(findEvent(events, "B").id, "B");
  assert.equal(findEvent(events, "Z"), null);
});

// ---- widget round-trip ----
const BUNDLE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "sites", "salt-shed.js");

function loadBundle() {
  const listeners = [];
  const store = new Map();
  const grid = { dataset: {}, style: {}, classList: { add() {}, remove() {} }, appendChild() {}, querySelector: () => null };
  const document = {
    readyState: "loading",
    addEventListener: (type, fn) => { if (type === "DOMContentLoaded") listeners.push(fn); },
    querySelector: (sel) => (sel.includes("data-venue-events") ? grid : null),
    querySelectorAll: (sel) => (sel.includes("data-venue-events") ? [grid] : []),
    createElement: () => ({ style: {}, textContent: "", classList: { add() {} }, setAttribute() {} }),
    head: { appendChild() {} },
    body: { appendChild() {} },
  };
  const window = {
    document,
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      key: (i) => Array.from(store.keys())[i] ?? null,
      get length() { return store.size; },
    },
    location: { href: "http://localhost/" },
    addEventListener() {},
    dataLayer: [],
    SALTSHED_API_KEY: "test-key",
  };
  Object.assign(window, { window, console, setTimeout, clearTimeout, URLSearchParams, URL });
  const ctx = vm.createContext(window);
  vm.runInContext(fs.readFileSync(BUNDLE, "utf8"), ctx, { filename: "sites/salt-shed.js" });
  listeners.forEach((fn) => fn());
  return window.VenueEvents;
}

test("widget round-trip: bundle normalizes the hub response", async () => {
  const venue = [{ id: "KovZ917AI5F", name: "Salt Shed" }];
  const events = [
    ev("D1", { name: "Big Band Night", url: "https://www.ticketmaster.com/big-band/event/0400AAAA", ...at("2026-10-01", "20:00:00"), _embedded: { venues: venue, attractions: [] } }),
    ev("D2", { name: "Solo Act", url: "https://www.ticketmaster.com/solo/event/0400BBBB", ...at("2026-10-02", "20:00:00"), _embedded: { venues: venue, attractions: [] } }),
    ev("D3", { name: "Late Show", url: "https://www.ticketmaster.com/late/event/0400CCCC", ...at("2026-10-03", "20:00:00"), _embedded: { venues: venue, attractions: [{ id: "a", name: "Garage Band" }] } }),
  ];
  const VE = loadBundle();
  let seen;
  VE.api.request = async (url) => {
    seen = new URL(url);
    return queryEvents(events, seen.searchParams);
  };
  const res = await VE.api.getEvents({ keyword: "band" });
  assert.equal(seen.searchParams.get("keyword"), "band");
  assert.deepEqual(Array.from(res.events, (e) => e.name), ["Big Band Night", "Late Show"]);
});
