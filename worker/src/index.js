/**
 * 16OC Events Hub — Cloudflare Worker
 *
 * Serves per-site event snapshots (refreshed by cron) and a small
 * Ticketmaster pass-through for venue and classification lookups.
 */

import { getSite, SITES } from './sites.js';
import { loadSnapshot, refreshAll } from './snapshot.js';
import { queryEvents, findEvent } from './query.js';
import { getCacheTtl } from './config.js';
import { CORS_HEADERS, jsonResponse, proxyToTicketmaster } from './passthrough.js';

const STALE_MS = 30 * 60 * 1000;

function tokenMatches(header, token) {
  if (!token) return false;
  const expected = `Bearer ${token}`;
  const given = header || '';
  if (given.length !== expected.length) return false;
  const enc = new TextEncoder();
  const a = enc.encode(given);
  const b = enc.encode(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function health(env) {
  const sites = {};
  let degraded = false;
  const now = Date.now();
  for (const id of Object.keys(SITES)) {
    const meta = (await env.SNAPSHOTS.get(`meta:${id}`, 'json')) ?? null;
    sites[id] = meta;
    const last = meta?.lastSuccessAt ? Date.parse(meta.lastSuccessAt) : NaN;
    if (!(now - last <= STALE_MS) || meta.capped) degraded = true;
  }
  return jsonResponse({ status: degraded ? 'degraded' : 'ok', sites }, degraded ? 503 : 200);
}

async function adminRefresh(request, url, env) {
  if (!tokenMatches(request.headers.get('Authorization'), env.ADMIN_TOKEN)) {
    return jsonResponse({ error: 'Unauthorized' }, 401);
  }
  const siteId = url.searchParams.get('site');
  if (siteId && !getSite(siteId)) return jsonResponse({ error: 'Not found' }, 404);
  const results = await refreshAll(env, siteId ? { siteIds: [siteId] } : {});
  return jsonResponse(results);
}

async function siteRoute(url, env, ctx) {
  const m = url.pathname.match(/^\/v1\/([^/]+)\/(.+)$/);
  if (!m) return null;
  const site = getSite(m[1]);
  if (!site) return jsonResponse({ error: 'Not found' }, 404);
  const rest = m[2];

  if (rest === 'events.json') {
    const snapshot = await loadSnapshot(env.SNAPSHOTS, site.id);
    if (!snapshot) return jsonResponse({ error: 'snapshot unavailable' }, 503);
    return jsonResponse(queryEvents(snapshot.events, url.searchParams), 200, {
      'Cache-Control': 'public, max-age=300',
    });
  }

  const detail = rest.match(/^events\/([A-Za-z0-9_-]+)\.json$/);
  if (detail) {
    const snapshot = await loadSnapshot(env.SNAPSHOTS, site.id);
    if (!snapshot) return jsonResponse({ error: 'snapshot unavailable' }, 503);
    const event = findEvent(snapshot.events, detail[1]);
    if (!event) return jsonResponse({ error: 'not found' }, 404);
    return jsonResponse(event, 200, { 'Cache-Control': 'public, max-age=300' });
  }

  const venue = rest.match(/^venues\/([A-Za-z0-9_-]+)\.json$/);
  if (venue || rest === 'classifications.json') {
    const apiKey = env[site.keyBinding];
    if (!apiKey) return jsonResponse({ error: 'Server misconfiguration' }, 500);
    const pathname = venue ? `/venues/${venue[1]}.json` : '/classifications.json';
    return proxyToTicketmaster(pathname, url.searchParams, {
      apiKey,
      baseUrl: env.UPSTREAM_BASE,
      cache: globalThis.caches?.default,
      ttl: getCacheTtl(pathname),
      waitUntil: ctx?.waitUntil?.bind(ctx),
    });
  }
  return null;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method === 'POST' && url.pathname === '/admin/refresh') {
      return adminRefresh(request, url, env);
    }
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }
    if (url.pathname === '/health') return health(env);

    const res = await siteRoute(url, env, ctx);
    return res ?? jsonResponse({ error: 'Not found' }, 404);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(refreshAll(env, {}));
  },
};
