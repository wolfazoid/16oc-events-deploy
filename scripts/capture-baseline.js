#!/usr/bin/env node
/**
 * Capture what each live touchpoint shows right now, by replaying its exact
 * Ticketmaster queries (baseline/profiles.js) through its selection rules
 * (baseline/select.js). Output is the parity fixture the hub is diffed against.
 *
 * Usage:  TM_API_KEY=... node scripts/capture-baseline.js [site ...]
 * Writes: test/fixtures/baseline/<site>.json
 */
const fs = require("fs");
const path = require("path");
const profiles = require("../baseline/profiles");
const { selectLegacy, selectNewWidget, selectRecentlyAnnounced, summarize } = require("../baseline/select");

const BASE = "https://app.ticketmaster.com/discovery/v2/events.json";
const OUT_DIR = path.join(__dirname, "..", "test", "fixtures", "baseline");
const KEY = process.env.TM_API_KEY;
const DELAY_MS = 250; // Discovery API allows 5 req/s

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chicagoDate = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);

async function fetchPage(params) {
  const url = new URL(BASE);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("apikey", KEY);
  await sleep(DELAY_MS);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TM ${res.status} for ${JSON.stringify(params)}`);
  return res.json();
}

async function runRequest({ params, allPages }, now) {
  const resolved = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, v === "@today" ? `${chicagoDate(now)}T00:00:00` : v]),
  );
  const first = await fetchPage(resolved);
  const pages = [first];
  const totalPages = (first.page || {}).totalPages || 1;
  if (allPages) {
    for (let p = 1; p < totalPages; p++) pages.push(await fetchPage({ ...resolved, page: String(p) }));
  }
  const events = pages.flatMap((r) => ((r._embedded || {}).events) || []);
  return {
    events,
    meta: {
      params: resolved,
      totalElements: (first.page || {}).totalElements || 0,
      pagesRead: pages.length,
      truncated: !allPages && totalPages > 1,
    },
  };
}

async function runAll(requests, now) {
  const results = [];
  for (const r of requests) results.push(await runRequest(r, now));
  return { events: results.flatMap((r) => r.events), requests: results.map((r) => r.meta) };
}

async function capture(site, now) {
  const profile = profiles[site];
  const grid = await runAll(profile.requests, now);
  const shown = profile.selector === "newWidget"
    ? selectNewWidget(grid.events, { excludedArtists: profile.excludedArtists })
    : selectLegacy(grid.events);

  const out = {
    site,
    capturedAt: now.toISOString(),
    page: profile.page,
    code: profile.code,
    requests: grid.requests,
    listHasDescription: grid.events.filter((e) => e.description).length,
    listEventCount: grid.events.length,
    events: shown.map(summarize),
  };

  if (profile.recentlyAnnounced) {
    const recent = await runAll(profile.recentlyAnnounced, now);
    out.recentlyAnnounced = selectRecentlyAnnounced(recent.events, { now, limit: 4 }).map(summarize);
  }
  return out;
}

async function main() {
  if (!KEY) {
    console.error("Set TM_API_KEY");
    process.exit(1);
  }
  const sites = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(profiles);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const now = new Date();
  for (const site of sites) {
    const result = await capture(site, now);
    fs.writeFileSync(path.join(OUT_DIR, `${site}.json`), JSON.stringify(result, null, 2) + "\n");
    const truncated = result.requests.filter((r) => r.truncated).length;
    console.log(
      `${site.padEnd(12)} shown=${String(result.events.length).padStart(3)}` +
      ` recent=${result.recentlyAnnounced ? result.recentlyAnnounced.length : "-"}` +
      ` descInList=${result.listHasDescription}/${result.listEventCount}` +
      (truncated ? ` TRUNCATED(${truncated} req)` : ""),
    );
  }
}

module.exports = { capture };

if (require.main === module) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
