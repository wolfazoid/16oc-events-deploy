const statusCode = (e) => (((e.dates || {}).status) || {}).code;

function startTimestamp(e) {
  const start = (e.dates || {}).start;
  if (!start) return null;
  const iso = start.dateTime || (start.localDate && `${start.localDate}T${start.localTime || "00:00:00"}`);
  const ts = iso ? Date.parse(iso) : NaN;
  return Number.isNaN(ts) ? null : ts;
}

/** YYYY-MM-DD of `now` in Chicago. */
export function chicagoDate(now) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(now);
}

function lastSegment(url) {
  return (url || "").split(/[?#]/)[0].split("/").filter(Boolean).pop() || "";
}

export function selectSiteEvents(events, rules, { today }) {
  const excludedArtists = (rules.excludedArtists || []).filter(Boolean).map((n) => n.toLowerCase());
  const excludeEvents = (rules.excludeEvents || []).filter(Boolean).map((n) => n.toLowerCase());
  const seen = new Set();
  return events
    .filter((e) => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .filter((e) => {
      const code = statusCode(e);
      return code !== "canceled" && code !== "cancelled";
    })
    .filter((e) => {
      if (!rules.requireTicketUrl) return true;
      const url = e.url || "";
      return url.includes("ticketmaster") || url.includes("ticketweb");
    })
    .filter((e) => {
      const localDate = (((e.dates || {}).start) || {}).localDate;
      return !localDate || localDate >= today;
    })
    .filter((e) => {
      const names = [e.name, ...(((e._embedded || {}).attractions) || []).map((a) => a.name)]
        .filter(Boolean)
        .map((n) => n.toLowerCase());
      return !excludedArtists.some((ex) => names.some((n) => n.includes(ex)));
    })
    .filter((e) => {
      const keys = [e.id, lastSegment(e.url)].filter(Boolean).map((k) => String(k).toLowerCase());
      return !keys.some((k) => excludeEvents.includes(k));
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
