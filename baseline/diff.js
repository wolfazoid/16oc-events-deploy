/**
 * Compare what the live widget rules show (legacy) against what the hub serves.
 * Both inputs are Summary[] (see select.js summarize). `today` is the
 * America/Chicago date (YYYY-MM-DD). Pure function.
 */
function diffSite(legacy, hub, { today }) {
  const hubIds = new Set(hub.map((e) => e.id));
  const legacyIds = new Set(legacy.map((e) => e.id));
  const expected = [];
  const unexpected = [];
  let matched = 0;

  for (const e of legacy) {
    if (hubIds.has(e.id)) {
      matched++;
    } else if (e.status === "canceled") {
      expected.push({ id: e.id, side: "legacy", reason: "canceled-hidden" });
    } else if (e.localDate && e.localDate < today) {
      expected.push({ id: e.id, side: "legacy", reason: "past" });
    } else {
      unexpected.push({ id: e.id, side: "legacy", name: e.name });
    }
  }
  for (const e of hub) {
    if (!legacyIds.has(e.id)) unexpected.push({ id: e.id, side: "hub", name: e.name });
  }
  return { matched, expected, unexpected };
}

module.exports = { diffSite };
