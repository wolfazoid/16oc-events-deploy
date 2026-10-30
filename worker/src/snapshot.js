import { SITES } from "./sites.js";
import { selectSiteEvents, chicagoDate } from "./select.js";
import { fetchAllEvents } from "./tm.js";

const DROP_GUARD_MIN_PREVIOUS = 10;
const DROP_GUARD_RATIO = 0.5;

export async function buildSnapshot(
  site,
  { apiKey, baseUrl, fetchImpl = globalThis.fetch, now = new Date(), delayMs = 250, timeoutMs = 15000 },
) {
  const all = [];
  const requests = [];
  for (const { params } of site.requests) {
    const r = await fetchAllEvents(params, { apiKey, baseUrl, fetchImpl, delayMs, timeoutMs });
    all.push(...r.events);
    requests.push({ params, totalElements: r.totalElements, pagesRead: r.pagesRead, capped: r.capped });
  }
  const events = selectSiteEvents(all, site.rules, { today: chicagoDate(now) });
  return { site: site.id, builtAt: now.toISOString(), events, requests };
}

export async function loadSnapshot(kv, siteId) {
  return kv.get(`snapshot:${siteId}`, "json");
}

function paramsKey(params) {
  return JSON.stringify(Object.keys(params ?? {}).sort().map((k) => [k, params[k]]));
}

/** Returns null when the save is safe, else { saved: false, reason, detail? }. */
function dropGuard(prev, snapshot) {
  const prevCount = prev?.events?.length ?? 0;
  const count = snapshot.events.length;
  if (prevCount >= DROP_GUARD_MIN_PREVIOUS && count < prevCount * DROP_GUARD_RATIO) {
    return { saved: false, reason: "drop-guard" };
  }
  if (prevCount >= 1 && count === 0) {
    return { saved: false, reason: "drop-guard", detail: "snapshot would be empty" };
  }
  const prevTotals = new Map((prev?.requests ?? []).map((r) => [paramsKey(r.params), r.totalElements]));
  for (const r of snapshot.requests ?? []) {
    const before = prevTotals.get(paramsKey(r.params));
    if (before > 0 && r.totalElements === 0) {
      return {
        saved: false,
        reason: "drop-guard",
        detail: `request ${new URLSearchParams(r.params)} returned 0, previously ${before}`,
      };
    }
  }
  return null;
}

export async function saveSnapshot(kv, snapshot, { force = false } = {}) {
  if (!force) {
    const refused = dropGuard(await loadSnapshot(kv, snapshot.site), snapshot);
    if (refused) return refused;
  }
  await kv.put(`snapshot:${snapshot.site}`, JSON.stringify(snapshot));
  return { saved: true };
}

function errorMessage(err, apiKey) {
  let msg = String(err?.message ?? err);
  if (apiKey) msg = msg.split(apiKey).join("[redacted]");
  return msg;
}

export async function refreshAll(
  env,
  {
    fetchImpl = globalThis.fetch,
    now = new Date(),
    delayMs = 250,
    timeoutMs = 15000,
    force = false,
    siteIds = Object.keys(SITES),
  } = {},
) {
  const kv = env.SNAPSHOTS;
  const results = [];
  for (const id of siteIds) {
    const site = SITES[id];
    const attemptAt = now.toISOString();
    let prevMeta = null;
    const apiKey = site ? env[site.keyBinding] : undefined;
    let outcome;
    let capped = false;
    let lastError = null;
    try {
      prevMeta = (await kv.get(`meta:${id}`, "json")) ?? {};
      capped = prevMeta.capped ?? false;
      if (!site) throw new Error(`unknown site ${id}`);
      if (!apiKey) throw new Error(`missing key binding ${site.keyBinding}`);
      const snapshot = await buildSnapshot(site, { apiKey, baseUrl: env.UPSTREAM_BASE, fetchImpl, now, delayMs, timeoutMs });
      const prevCount = (await loadSnapshot(kv, id))?.events?.length ?? 0;
      const saved = await saveSnapshot(kv, snapshot, { force });
      capped = snapshot.requests.some((r) => r.capped);
      if (saved.saved) {
        outcome = { site: id, saved: true, kept: false };
      } else {
        lastError = `${saved.reason}: kept ${prevCount} events, refused ${snapshot.events.length}`;
        if (saved.detail) lastError += ` (${saved.detail})`;
        outcome = { site: id, saved: false, kept: true, reason: saved.reason };
      }
    } catch (err) {
      lastError = errorMessage(err, apiKey);
      outcome = { site: id, saved: false, kept: true, error: lastError };
    }
    const succeeded = !lastError;
    if (!prevMeta) {
      // Meta unreadable: do not overwrite it with a guess.
      results.push(outcome);
      continue;
    }
    try {
      await kv.put(
        `meta:${id}`,
        JSON.stringify({
          lastAttemptAt: attemptAt,
          lastSuccessAt: succeeded ? attemptAt : (prevMeta.lastSuccessAt ?? null),
          lastError,
          kept: outcome.kept,
          capped,
        }),
      );
    } catch (err) {
      outcome.error = outcome.error ?? errorMessage(err, apiKey);
    }
    results.push(outcome);
  }
  return results;
}
