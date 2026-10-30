/**
 * Pass-through proxy to the Ticketmaster Discovery API.
 * Forwards params, injects the API key server-side, edge-caches 200s.
 */

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
  });
}

/**
 * @param {string} pathname TM path, e.g. /venues/abc.json
 * @param {URLSearchParams} searchParams client params to forward
 * @param {{apiKey: string, baseUrl?: string, fetchImpl?: Function, cache?: Cache, ttl: number, waitUntil?: Function}} opts
 */
export async function proxyToTicketmaster(
  pathname,
  searchParams,
  { apiKey, baseUrl, fetchImpl = globalThis.fetch, cache, ttl, waitUntil },
) {
  // Cache key excludes the API key.
  const cacheKey = new Request(`https://cache.16oc.invalid${pathname}?${searchParams.toString()}`);
  if (cache) {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const response = new Response(hit.body, hit);
      response.headers.set('X-Cache', 'HIT');
      for (const [k, v] of Object.entries(CORS_HEADERS)) response.headers.set(k, v);
      return response;
    }
  }

  const base = baseUrl || 'https://app.ticketmaster.com/discovery/v2';
  const upstream = new URL(`${base}${pathname}`);
  for (const [k, v] of searchParams.entries()) upstream.searchParams.set(k, v);
  upstream.searchParams.set('apikey', apiKey);

  let tm;
  try {
    tm = await fetchImpl(upstream.toString(), { headers: { Accept: 'application/json' } });
  } catch {
    return jsonResponse({ error: 'upstream unavailable' }, 502);
  }
  if (!tm.ok) {
    return jsonResponse({ error: 'Upstream error', status: tm.status }, tm.status);
  }

  let body;
  try {
    body = await tm.text();
  } catch {
    return jsonResponse({ error: 'upstream unavailable' }, 502);
  }
  const cacheControl = `public, max-age=${ttl}`;
  if (cache) {
    const put = cache.put(
      cacheKey,
      new Response(body, { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': cacheControl } }),
    );
    if (waitUntil) waitUntil(put);
    else await put;
  }
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cacheControl, 'X-Cache': 'MISS', ...CORS_HEADERS },
  });
}
