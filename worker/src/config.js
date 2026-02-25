/**
 * 16OC Events Proxy — Configuration
 *
 * Maps venue IDs to Cloudflare Worker secret binding names,
 * defines allowed endpoints, and sets cache TTLs.
 */

// Each venue group shares one TM API key, stored as a CF Worker secret.
// First venueId in a comma-separated query param wins the lookup.
export const VENUE_KEY_MAP = {
  // Thalia Hall
  'rZ7HnEZ17aJq7': 'TM_KEY_THALIA',
  'rZ7HnEZ17aJq0': 'TM_KEY_THALIA',
  'KovZpZAktlaA':  'TM_KEY_THALIA',

  // Space
  'KovZpakJQe':    'TM_KEY_SPACE',
  'rZ7HnEZ173FQ4': 'TM_KEY_SPACE',
  'rZ7HnEZ17fSA4': 'TM_KEY_SPACE',

  // Salt Shed + Fairgrounds + Three Top Lounge
  'KovZ917AI5F':   'TM_KEY_SALTSHED',
  'KovZ917Amf0':   'TM_KEY_SALTSHED',
  'rZ7HnEZ17_Skd': 'TM_KEY_SALTSHED',

  // Empty Bottle (13 venue IDs — includes affiliated venues)
  'KovZpZAId16A':  'TM_KEY_EMPTYBOTTLE',
  'rZ7HnEZ178O8A': 'TM_KEY_EMPTYBOTTLE',
  'rZ7HnEZ17a4Af': 'TM_KEY_EMPTYBOTTLE',
  'KovZ917AEIJ':   'TM_KEY_EMPTYBOTTLE',
  'KovZ917AEEX':   'TM_KEY_EMPTYBOTTLE',
  'KovZpZAFJ1EA':  'TM_KEY_EMPTYBOTTLE',
  'KovZpZAFEFAA':  'TM_KEY_EMPTYBOTTLE',
  'KovZpaptBe':    'TM_KEY_EMPTYBOTTLE',
  'KovZpaptYe':    'TM_KEY_EMPTYBOTTLE',
  'KovZpZAkt67A':  'TM_KEY_EMPTYBOTTLE',
  'rZ7HnEZaeir':   'TM_KEY_EMPTYBOTTLE',
  'rZ7HnEZ178gfg': 'TM_KEY_EMPTYBOTTLE',
  'rZ7HnEZ17bbPI': 'TM_KEY_EMPTYBOTTLE',

  // Promontory
  'rZ7HnEZ178Zp4': 'TM_KEY_PROMONTORY',
};

// Used for /classifications.json (no venue context needed)
export const DEFAULT_KEY_BINDING = 'TM_KEY_DEFAULT';

// Only these TM Discovery API endpoints are proxied
export const ALLOWED_ENDPOINTS = [
  /^\/events\.json$/,
  /^\/events\/[A-Za-z0-9_-]+\.json$/,
  /^\/venues\/[A-Za-z0-9_-]+\.json$/,
  /^\/classifications\.json$/,
];

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
