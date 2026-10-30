/**
 * 16OC Events Proxy — Configuration
 *
 * Edge cache TTLs for the Ticketmaster pass-through.
 */

// Edge cache TTLs in seconds
export const CACHE_TTLS = {
  events: 3600,          // 1 hour
  venues: 86400,         // 24 hours
  classifications: 604800, // 7 days
};

/**
 * Determine cache TTL based on the request pathname.
 */
export function getCacheTtl(pathname) {
  if (pathname.startsWith('/venues/')) return CACHE_TTLS.venues;
  if (pathname === '/classifications.json') return CACHE_TTLS.classifications;
  return CACHE_TTLS.events; // default for /events.json and /events/{id}.json
}
