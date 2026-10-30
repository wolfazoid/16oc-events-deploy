/**
 * Reproduces which events each live widget shows, given raw Ticketmaster
 * Discovery events. Rules are copied from the live code (see legacy/ and
 * bundle/salt-shed/), quirks included: matching what visitors see today is
 * the point, not correctness.
 */

function startTimestamp(event) {
  const start = (event.dates || {}).start;
  if (!start) return null;
  const iso = start.dateTime || (start.localDate && `${start.localDate}T${start.localTime || "00:00:00"}`);
  const ts = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(ts) ? null : ts;
}

function statusCode(event) {
  return ((event.dates || {}).status || {}).code;
}

/**
 * legacy/event-feed-widget.*.js: dedupe by id (first wins), drop status
 * "cancelled" (TicketWeb's spelling; Ticketmaster-hosted events send
 * "canceled" and stay visible), skip urls that are neither ticketmaster nor
 * ticketweb, sort by start.
 */
function selectLegacy(events) {
  const seen = new Set();
  return events
    .filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .filter((e) => statusCode(e) !== "cancelled")
    .filter((e) => {
      const url = e.url || "";
      return url.includes("ticketmaster") || url.includes("ticketweb");
    })
    .map((e, i) => ({ e, i, ts: startTimestamp(e) }))
    .sort((a, b) => {
      if (a.ts === null && b.ts === null) return a.i - b.i;
      if (a.ts === null) return 1;
      if (b.ts === null) return -1;
      return a.ts - b.ts || a.i - b.i;
    })
    .map(({ e }) => e);
}

/**
 * bundle/salt-shed/02-runtime.js applyExclusions(): artist exclusion by
 * case-insensitive substring of the event name or any attraction name.
 * Order is Ticketmaster's (requested with sort=date,asc).
 */
function selectNewWidget(events, { excludedArtists = [] } = {}) {
  const excluded = excludedArtists.filter(Boolean).map((n) => n.toLowerCase());
  return events.filter((e) => {
    const names = [e.name, ...(((e._embedded || {}).attractions) || []).map((a) => a.name)]
      .filter(Boolean)
      .map((n) => n.toLowerCase());
    return !excluded.some((ex) => names.some((n) => n.includes(ex)));
  });
}

function announcedAt(event) {
  const sales = event.sales || {};
  if (sales.public && sales.public.startDateTime) return sales.public.startDateTime;
  const presales = (sales.presales || []).map((p) => p.startDateTime).filter(Boolean).sort();
  return presales[0] || null;
}

/** YYYY-MM-DD of `now` in Chicago, standing in for the visitor's browser date. */
function chicagoDate(now) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(now);
}

/**
 * legacy/recently-announced-widget.*.js getRecentlyAnnounced(). Its
 * isUpcoming() compares local dates only and counts undated events.
 */
function selectRecentlyAnnounced(events, { now = new Date(), limit = 4 } = {}) {
  const today = chicagoDate(now);
  const seen = new Set();
  return events
    .filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .filter((e) => statusCode(e) !== "cancelled")
    .filter((e) => {
      const localDate = (((e.dates || {}).start) || {}).localDate;
      return !localDate || localDate >= today;
    })
    .filter((e) => announcedAt(e))
    .sort((a, b) => Date.parse(announcedAt(b)) - Date.parse(announcedAt(a)))
    .slice(0, limit);
}

function summarize(event) {
  const start = (event.dates || {}).start || {};
  const venue = (((event._embedded || {}).venues) || [])[0] || {};
  return {
    id: event.id,
    name: event.name,
    localDate: start.localDate || null,
    localTime: start.localTime || null,
    status: statusCode(event) || null,
    venueId: venue.id || null,
    venueName: venue.name || null,
    url: event.url || null,
  };
}

module.exports = { selectLegacy, selectNewWidget, selectRecentlyAnnounced, summarize, announcedAt };
