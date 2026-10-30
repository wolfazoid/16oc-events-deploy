import { test } from "node:test";
import assert from "node:assert/strict";
import { selectSiteEvents, chicagoDate } from "../../worker/src/select.js";

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

const rules = { requireTicketUrl: false, excludedArtists: [], excludeEvents: [] };
const today = "2026-10-30";
const withStatus = (code) => ({ dates: { start: { localDate: "2026-12-01" }, status: { code } } });
const ids = (events) => events.map((e) => e.id);

test("drops both canceled spellings", () => {
  const out = selectSiteEvents(
    [ev("A", withStatus("canceled")), ev("B", withStatus("cancelled")), ev("C", withStatus("onsale"))],
    rules,
    { today },
  );
  assert.deepEqual(ids(out), ["C"]);
});

test("dedupes first-wins", () => {
  const out = selectSiteEvents([ev("A"), ev("B"), ev("A", { name: "dupe" })], rules, { today });
  assert.deepEqual(ids(out), ["A", "B"]);
  assert.equal(out[0].name, "Show A");
});

test("requireTicketUrl only when set", () => {
  const events = [ev("A", { url: "https://www.universe.com/events/a" })];
  assert.deepEqual(ids(selectSiteEvents(events, { ...rules, requireTicketUrl: false }, { today })), ["A"]);
  assert.deepEqual(ids(selectSiteEvents(events, { ...rules, requireTicketUrl: true }, { today })), []);
});

test("drops past events by Chicago date, keeps today and undated", () => {
  const now = new Date("2026-10-30T03:00:00Z");
  const t = chicagoDate(now);
  assert.equal(t, "2026-10-29");
  const dated = (d) => ({ dates: { start: { localDate: d }, status: { code: "onsale" } } });
  const out = selectSiteEvents(
    [
      ev("P", dated("2026-10-28")),
      ev("T", dated("2026-10-29")),
      ev("U", { dates: { start: {}, status: { code: "onsale" } } }),
    ],
    rules,
    { today: t },
  );
  assert.deepEqual(ids(out), ["T", "U"]);
});

test("excludes artists and events", () => {
  const out = selectSiteEvents(
    [
      ev("A", { name: "OLIVER TREE Live" }),
      ev("B", { url: "https://www.ticketmaster.com/event/0400652BB8ACB1CF" }),
      ev("0400652BB8ACB1CF"),
      ev("KEEP"),
    ],
    { ...rules, excludedArtists: ["oliver tree"], excludeEvents: ["0400652bb8acb1cf"] },
    { today },
  );
  assert.deepEqual(ids(out), ["KEEP"]);
});

test("sorts by start, undated last, stable", () => {
  const late = ev("L", { dates: { start: { dateTime: "2027-01-01T02:00:00Z" }, status: { code: "onsale" } } });
  const early = ev("E", { dates: { start: { localDate: "2026-11-01", localTime: "19:00:00" }, status: { code: "onsale" } } });
  const undated = ev("U", { dates: { start: {}, status: { code: "onsale" } } });
  assert.deepEqual(ids(selectSiteEvents([undated, late, early], rules, { today })), ["E", "L", "U"]);
});
