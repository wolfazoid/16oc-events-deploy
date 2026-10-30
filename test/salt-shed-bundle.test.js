/**
 * Loads the built sites/salt-shed.js in a fake browser and checks that the
 * bootstrap wires data-exclude-events / window.SALTSHED_EXCLUDE_EVENTS into
 * the widget, and that both exclusion mechanisms filter API results.
 *
 * Run: node --test test/   (build first: node scripts/build-salt-shed-bundle.js)
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const BUNDLE = path.join(__dirname, "..", "sites", "salt-shed.js");

function makeStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
}

function fakeEl(dataset) {
  return { dataset: { ...dataset }, style: {}, classList: { add() {}, remove() {} }, appendChild() {}, querySelector: () => null };
}

/**
 * Load the bundle with document.readyState === "loading" so both the widget's
 * own autoInit and the bundle's bootstrap defer to DOMContentLoaded. Firing
 * that event runs bootstrap (which calls VenueEvents.init); init then defers
 * component rendering to a second DOMContentLoaded that never fires, so we can
 * inspect config and call the API layer without a real DOM.
 */
function loadBundle({ gridDataset = {}, windowExcludes } = {}) {
  const listeners = [];
  const grid = fakeEl(gridDataset);
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
    localStorage: makeStorage(),
    location: { href: "http://localhost/" },
    addEventListener() {},
    dataLayer: [],
    SALTSHED_API_KEY: "test-key",
  };
  if (windowExcludes !== undefined) window.SALTSHED_EXCLUDE_EVENTS = windowExcludes;
  // As in a browser, `window` must BE the global object: the bundle's bootstrap
  // references `VenueEvents` as a bare global that the runtime sets on window.
  Object.assign(window, { window, console, setTimeout, clearTimeout, URLSearchParams, URL });
  const ctx = vm.createContext(window);
  vm.runInContext(fs.readFileSync(BUNDLE, "utf8"), ctx, { filename: "sites/salt-shed.js" });
  listeners.forEach((fn) => fn());
  return window.VenueEvents;
}

function rawEvent(id, legacyId, name, attractions = []) {
  return {
    id, name,
    url: `https://www.ticketmaster.com/${name.toLowerCase().replace(/\s+/g, "-")}-chicago/event/${legacyId}`,
    dates: { start: { localDate: "2026-10-01", localTime: "20:00:00" } },
    _embedded: { venues: [{ id: "KovZ917AI5F", name: "Salt Shed" }], attractions: attractions.map((n, i) => ({ id: `att${i}`, name: n })) },
  };
}

function stubApi(VenueEvents) {
  VenueEvents.api.request = async () => ({
    _embedded: { events: [
      rawEvent("D1", "0400652BB8ACB1CF", "Target Show", ["Some Band"]),
      rawEvent("D2", "0400643BF736AC2E", "Yacht Rock Revue", ["Yacht Rock Revue"]),
      rawEvent("D3", "0400600000000001", "Oliver Tree Live", ["Oliver Tree"]),
    ] },
    page: { size: 3, totalElements: 3, totalPages: 1, number: 0 },
  });
}
const names = (r) => Array.from(r.events, (e) => e.name);

test("bootstrap keeps the live config (venues, artist exclusion) and defaults excludeEvents to empty", async () => {
  const VE = loadBundle();
  assert.equal(VE.config.apiKey, "test-key");
  assert.deepEqual(Array.from(VE.config.venues), ["KovZ917AI5F", "KovZ917Amf0", "rZ7HnEZ17_oxd", "rZ7HnEZ17qAZK", "rZ7HnEZ17qvqS", "rZ7HnEZ17qvrd"]);
  assert.deepEqual(Array.from(VE.config.excludedArtists), ["Oliver Tree"]);
  assert.deepEqual(Array.from(VE.config.excludeEvents), []);
  stubApi(VE);
  assert.deepEqual(names(await VE.api.getEvents()), ["Target Show", "Yacht Rock Revue"]);
});

test("data-exclude-events on the grid element hides those events (comma-separated ids)", async () => {
  const VE = loadBundle({ gridDataset: { excludeEvents: " 0400652BB8ACB1CF , 0400643bf736ac2e " } });
  assert.deepEqual(Array.from(VE.config.excludeEvents), ["0400652BB8ACB1CF", "0400643bf736ac2e"]);
  stubApi(VE);
  assert.deepEqual(names(await VE.api.getEvents()), []);
});

test("window.SALTSHED_EXCLUDE_EVENTS works with a full link and merges with the data attribute", async () => {
  const VE = loadBundle({
    windowExcludes: ["https://www.ticketmaster.com/event/0400652BB8ACB1CF"],
    gridDataset: { excludeEvents: "D2" },
  });
  stubApi(VE);
  assert.deepEqual(names(await VE.api.getEvents()), []);
});

test("exclusion applies to cached responses", async () => {
  const VE = loadBundle();
  stubApi(VE);
  await VE.api.getEvents();
  VE.api.request = async () => { throw new Error("should be served from cache"); };
  VE.init({ ...VE.config, excludeEvents: ["0400652BB8ACB1CF"] });
  assert.deepEqual(names(await VE.api.getEvents()), ["Yacht Rock Revue"]);
});
