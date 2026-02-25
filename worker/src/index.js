/**
 * 16OC Events Proxy — Cloudflare Worker
 *
 * Pass-through proxy to the Ticketmaster Discovery API.
 * Hides API keys server-side, adds edge caching and CORS.
 */

import {
  VENUE_KEY_MAP,
  DEFAULT_KEY_BINDING,
  ALLOWED_ENDPOINTS,
  getCacheTtl,
} from './config.js';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

/**
 * Resolve the correct TM API key binding name for a request.
 * Returns { key, error } — key is the actual secret value, error is a Response.
 */
function resolveApiKey(url, env, pathname) {
  // /classifications.json needs no venue context — use default key
  if (pathname === '/classifications.json') {
    const key = env[DEFAULT_KEY_BINDING];
    if (!key) {
      return { key: null, error: jsonResponse({ error: 'Server misconfiguration: default key not set' }, 500) };
    }
    return { key, error: null };
  }

  // All other endpoints require a venueId
  const venueIdParam = url.searchParams.get('venueId');
  if (!venueIdParam) {
    return {
      key: null,
      error: jsonResponse({ error: 'Unknown or missing venueId', venueId: null }, 400),
    };
  }

  // First venue ID in a comma-separated list wins
  const firstVenueId = venueIdParam.split(',')[0].trim();
  const bindingName = VENUE_KEY_MAP[firstVenueId];

  if (!bindingName) {
    return {
      key: null,
      error: jsonResponse({ error: 'Unknown or missing venueId', venueId: firstVenueId }, 400),
    };
  }

  const key = env[bindingName];
  if (!key) {
    return {
      key: null,
      error: jsonResponse({ error: `Server misconfiguration: key binding ${bindingName} not set` }, 500),
    };
  }

  return { key, error: null };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- CORS preflight ---
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // --- Health check ---
    if (pathname === '/health') {
      return jsonResponse({
        status: 'ok',
        timestamp: new Date().toISOString(),
        worker: '16oc-events-proxy',
      });
    }

    // --- Only GET allowed ---
    if (request.method !== 'GET') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    // --- Endpoint allowlist ---
    const allowed = ALLOWED_ENDPOINTS.some((re) => re.test(pathname));
    if (!allowed) {
      return jsonResponse({ error: 'Not found' }, 404);
    }

    // --- CF Cache API: check for cached response ---
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), request);
    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const response = new Response(cachedResponse.body, cachedResponse);
      response.headers.set('X-Cache', 'HIT');
      // Ensure CORS headers on cached responses
      for (const [k, v] of Object.entries(CORS_HEADERS)) {
        response.headers.set(k, v);
      }
      return response;
    }

    // --- Resolve API key ---
    const { key: apiKey, error: keyError } = resolveApiKey(url, env, pathname);
    if (keyError) return keyError;

    // --- Build upstream TM URL ---
    const upstreamBase = env.UPSTREAM_BASE || 'https://app.ticketmaster.com/discovery/v2';
    const upstreamUrl = new URL(`${upstreamBase}${pathname}`);

    // Forward all query params from the original request
    for (const [k, v] of url.searchParams.entries()) {
      upstreamUrl.searchParams.set(k, v);
    }
    // Inject the API key
    upstreamUrl.searchParams.set('apikey', apiKey);

    // --- Fetch from TM ---
    const tmResponse = await fetch(upstreamUrl.toString(), {
      headers: { 'Accept': 'application/json' },
    });

    if (!tmResponse.ok) {
      return jsonResponse(
        { error: 'Upstream error', status: tmResponse.status },
        tmResponse.status,
      );
    }

    // --- Build response with cache headers ---
    const ttl = getCacheTtl(pathname);
    const responseBody = await tmResponse.text();

    const response = new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttl}`,
        'X-Cache': 'MISS',
        ...CORS_HEADERS,
      },
    });

    // Store in CF edge cache (non-blocking)
    const cacheResponse = new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${ttl}`,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, cacheResponse));

    return response;
  },
};
