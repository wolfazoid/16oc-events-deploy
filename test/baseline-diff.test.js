/**
 * diffSite compares live-widget rule output against hub output.
 * Run: npm test
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { diffSite } = require("../baseline/diff");

function s(id, overrides = {}) {
  return {
    id,
    name: `Show ${id}`,
    localDate: "2026-12-01",
    localTime: "20:00:00",
    status: "onsale",
    venueId: "V1",
    venueName: "Venue One",
    url: `https://www.ticketmaster.com/event/${id}`,
    ...overrides,
  };
}
const today = "2026-10-30";

test("identical lists match with nothing else", () => {
  const list = [s("a"), s("b")];
  assert.deepEqual(diffSite(list, list, { today }), { matched: 2, expected: [], unexpected: [] });
});

test("legacy-only canceled is expected canceled-hidden", () => {
  const r = diffSite([s("a"), s("c", { status: "canceled" })], [s("a")], { today });
  assert.equal(r.matched, 1);
  assert.deepEqual(r.expected, [{ id: "c", side: "legacy", reason: "canceled-hidden" }]);
  assert.deepEqual(r.unexpected, []);
});

test("legacy-only dated before today is expected past", () => {
  const r = diffSite([s("p", { localDate: "2026-10-29" })], [], { today });
  assert.deepEqual(r.expected, [{ id: "p", side: "legacy", reason: "past" }]);
  assert.deepEqual(r.unexpected, []);
});

test("hub-only event is unexpected on the hub side", () => {
  const r = diffSite([], [s("h")], { today });
  assert.deepEqual(r.unexpected, [{ id: "h", side: "hub", name: "Show h" }]);
});

test("legacy-only onsale today is unexpected on the legacy side", () => {
  const r = diffSite([s("t", { localDate: today })], [], { today });
  assert.deepEqual(r.unexpected, [{ id: "t", side: "legacy", name: "Show t" }]);
  assert.deepEqual(r.expected, []);
});
