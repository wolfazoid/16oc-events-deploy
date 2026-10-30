#!/usr/bin/env node
/**
 * Daily shadow diff: live widget rules vs the hub.
 *
 * Usage:  HUB_URL=... TM_API_KEY=... npm run shadow [site ...]
 * Exits 1 if any site has unexpected differences.
 */
const profiles = require("../baseline/profiles");
const { summarize } = require("../baseline/select");
const { diffSite } = require("../baseline/diff");
const { capture } = require("./capture-baseline");

const chicagoDate = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(d);

async function fetchHub(hubUrl, site, today) {
  const events = [];
  let totalPages = 1;
  for (let page = 0; page < totalPages; page++) {
    const url = new URL(`${hubUrl.replace(/\/+$/, "")}/v1/${site}/events.json`);
    url.searchParams.set("size", "200");
    url.searchParams.set("page", String(page));
    if (site === "saltshed") url.searchParams.set("localStartDateTime", `${today}T00:00:00`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`hub ${res.status} for ${url}`);
    const body = await res.json();
    totalPages = (body.page || {}).totalPages || 1;
    events.push(...(((body._embedded || {}).events) || []).map(summarize));
  }
  return events;
}

async function main() {
  const hubUrl = process.env.HUB_URL;
  if (!hubUrl || !process.env.TM_API_KEY) {
    console.error("Usage: HUB_URL=... TM_API_KEY=... npm run shadow [site ...]");
    process.exit(1);
  }
  const sites = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(profiles);
  const now = new Date();
  const today = chicagoDate(now);
  let bad = 0;
  for (const site of sites) {
    const legacy = (await capture(site, now)).events;
    const hub = await fetchHub(hubUrl, site, today);
    const r = diffSite(legacy, hub, { today });
    console.log(`${site.padEnd(12)} matched=${r.matched} expected=${r.expected.length} unexpected=${r.unexpected.length}`);
    for (const u of r.unexpected) console.log(`  ${u.side.padEnd(6)} ${u.id}  ${u.name}`);
    bad += r.unexpected.length;
  }
  if (bad) process.exit(1);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
