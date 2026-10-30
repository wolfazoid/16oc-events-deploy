/**
 * Selection rules that reproduce what each live widget shows, given raw
 * Ticketmaster Discovery events. These rules are the parity contract the hub
 * must match before any site cuts over.
 *
 * Run: npm test
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  selectLegacy,
  selectNewWidget,
  selectRecentlyAnnounced,
  summarize,
} = require("../baseline/select");

function ev(id, overrides = {}) {
  return {
    id,
    name: `Show ${id}`,
    url: `https://www.ticketmaster.com/event/${id}`,
    dates: {
      start: { localDate: "2026-12-01", localTime: "20:00:00", dateTime: "2026-12-02T02:00:00Z" },
      status: { code: "onsale" },
    },
    _embedded: { venues: [{ id: "V1", name: "Venue One" }], attractions: [] },
    ...overrides,
  };
}

test("selectLegacy dedupes by id, keeping the first occurrence", () => {
  const out = selectLegacy([ev("A"), ev("B"), ev("A", { name: "dupe" })]);
  assert.deepEqual(out.map((e) => e.id), ["A", "B"]);
  assert.equal(out[0].name, "Show A");
});

test("selectLegacy drops TicketWeb's 'cancelled' but keeps Ticketmaster's 'canceled'", () => {
  const out = selectLegacy([
    ev("A", { dates: { ...ev("A").dates, status: { code: "cancelled" } } }),
    ev("B", { dates: { ...ev("B").dates, status: { code: "canceled" } } }),
  ]);
  assert.deepEqual(out.map((e) => e.id), ["B"]);
});

test("selectLegacy drops events whose url is neither ticketmaster nor ticketweb", () => {
  const out = selectLegacy([
    ev("A", { url: "https://www.universe.com/events/x" }),
    ev("B", { url: "https://www.ticketweb.com/event/b" }),
  ]);
  assert.deepEqual(out.map((e) => e.id), ["B"]);
});

test("selectLegacy sorts by start, undated events last", () => {
  const late = ev("L", { dates: { start: { dateTime: "2027-01-01T02:00:00Z" }, status: { code: "onsale" } } });
  const early = ev("E", { dates: { start: { localDate: "2026-11-01", localTime: "19:00:00" }, status: { code: "onsale" } } });
  const undated = ev("U", { dates: { start: {}, status: { code: "onsale" } } });
  assert.deepEqual(selectLegacy([undated, late, early]).map((e) => e.id), ["E", "L", "U"]);
});

test("selectNewWidget excludes artists by case-insensitive substring of event or attraction name", () => {
  const out = selectNewWidget(
    [
      ev("A", { name: "OLIVER TREE: Live" }),
      ev("B", { _embedded: { venues: [], attractions: [{ name: "oliver tree" }] } }),
      ev("C"),
    ],
    { excludedArtists: ["Oliver Tree"] },
  );
  assert.deepEqual(out.map((e) => e.id), ["C"]);
});

test("selectNewWidget preserves Ticketmaster's order and does not dedupe or drop canceled", () => {
  const out = selectNewWidget(
    [ev("B"), ev("A", { dates: { ...ev("A").dates, status: { code: "canceled" } } })],
    { excludedArtists: [] },
  );
  assert.deepEqual(out.map((e) => e.id), ["B", "A"]);
});

test("selectRecentlyAnnounced treats today's and undated events as upcoming (Chicago local date)", () => {
  // 2026-10-30T03:00Z is still Oct 29 in Chicago.
  const now = new Date("2026-10-30T03:00:00Z");
  const sold = { sales: { public: { startDateTime: "2026-10-01T15:00:00Z" } } };
  const events = [
    ev("YESTERDAY", { ...sold, dates: { start: { localDate: "2026-10-28" }, status: { code: "onsale" } } }),
    ev("TODAY", { ...sold, dates: { start: { localDate: "2026-10-29", localTime: "00:30:00" }, status: { code: "onsale" } } }),
    ev("UNDATED", { ...sold, dates: { start: {}, status: { code: "onsale" } } }),
  ];
  assert.deepEqual(selectRecentlyAnnounced(events, { now, limit: 4 }).map((e) => e.id).sort(), ["TODAY", "UNDATED"]);
});

test("selectRecentlyAnnounced ranks upcoming events by public on-sale (else earliest presale), newest first", () => {
  const now = new Date("2026-10-30T00:00:00Z");
  const events = [
    ev("OLD", { sales: { public: { startDateTime: "2026-09-01T15:00:00Z" } } }),
    ev("NEW", { sales: { public: { startDateTime: "2026-10-20T15:00:00Z" } } }),
    ev("PRE", { sales: { presales: [{ startDateTime: "2026-10-25T15:00:00Z" }, { startDateTime: "2026-10-10T15:00:00Z" }] } }),
    ev("NONE"),
    ev("PAST", {
      dates: { start: { localDate: "2026-10-01" }, status: { code: "onsale" } },
      sales: { public: { startDateTime: "2026-10-29T15:00:00Z" } },
    }),
  ];
  assert.deepEqual(selectRecentlyAnnounced(events, { now, limit: 2 }).map((e) => e.id), ["NEW", "PRE"]);
});

test("summarize keeps only the fields used for parity diffs", () => {
  assert.deepEqual(summarize(ev("A")), {
    id: "A",
    name: "Show A",
    localDate: "2026-12-01",
    localTime: "20:00:00",
    status: "onsale",
    venueId: "V1",
    venueName: "Venue One",
    url: "https://www.ticketmaster.com/event/A",
  });
});
