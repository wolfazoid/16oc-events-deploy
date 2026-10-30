import { SITES } from "./sites.js";
import { selectSiteEvents, chicagoDate } from "./select.js";
import { fetchAllEvents } from "./tm.js";

const DROP_GUARD_MIN_PREVIOUS = 10;
const DROP_GUARD_RATIO = 0.5;

export async function buildSnapshot(
  site,
  { apiKey, baseUrl, fetchImpl = globalThis.fetch, now = new Date(), delayMs = 250 },
) {
  const all = [];
  const requests = [];
  for (const { params } of site.requests) {
    const r = await fetchAllEvents(params, { apiKey, baseUrl, fetchImpl, delayMs });
    all.push(...r.events);
    requests.push({ params, totalElements: r.totalElements, pagesRead: r.pagesRead, capped: r.capped });
  }
  const events = selectSiteEvents(all, site.rules, { today: chicagoDate(now) });
  return { site: site.id, builtAt: now.toISOString(), events, requests };
}

export async function loadSnapshot(kv, siteId) {
  return kv.get(`snapshot:${siteId}`, "json");
}

export async function saveSnapshot(kv, snapshot) {
  const prev = await loadSnapshot(kv, snapshot.site);
  const prevCount = prev?.events?.length ?? 0;
  if (prevCount >= DROP_GUARD_MIN_PREVIOUS && snapshot.events.length < prevCount * DROP_GUARD_RATIO) {
    return { saved: false, reason: "drop-guard" };
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
  { fetchImpl = globalThis.fetch, now = new Date(), delayMs = 250, siteIds = Object.keys(SITES) } = {},
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
      const snapshot = await buildSnapshot(site, { apiKey, baseUrl: env.UPSTREAM_BASE, fetchImpl, now, delayMs });
      const prevCount = (await loadSnapshot(kv, id))?.events?.length ?? 0;
      const saved = await saveSnapshot(kv, snapshot);
      capped = snapshot.requests.some((r) => r.capped);
      if (saved.saved) {
        outcome = { site: id, saved: true, kept: false };
      } else {
        lastError = `${saved.reason}: kept ${prevCount} events, refused ${snapshot.events.length}`;
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
