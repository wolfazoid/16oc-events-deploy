// Ticketmaster-compatible query over a snapshot of raw Discovery events.
// Answers the params the Salt Shed widget sends; anything else is ignored.

const list = (v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : []);
const lc = (s) => String(s ?? "").toLowerCase();

function localStart(e) {
  const s = e?.dates?.start;
  if (!s?.localDate) return null;
  return `${s.localDate}T${s.localTime || "00:00:00"}`;
}

const onSale = (e) => e?.sales?.public?.startDateTime || null;

function venueIds(e) {
  return (e?._embedded?.venues || []).map((v) => v.id);
}

function promoterIds(e) {
  return [e?.promoter?.id, ...(e?.promoters || []).map((p) => p.id)].filter(Boolean);
}

function classNames(e) {
  const out = [];
  for (const c of e?.classifications || []) {
    for (const k of ["segment", "genre", "subGenre"]) if (c?.[k]?.name) out.push(lc(c[k].name));
  }
  return out;
}

// Ascending by key, missing keys last; stable. dir = 1 or -1 applies to present keys only.
function sortBy(events, key, dir) {
  return events
    .map((e, i) => ({ e, i, k: key(e) }))
    .sort((a, b) => {
      if (a.k === null && b.k === null) return a.i - b.i;
      if (a.k === null) return 1;
      if (b.k === null) return -1;
      if (a.k === b.k) return a.i - b.i;
      return (a.k < b.k ? -1 : 1) * dir;
    })
    .map((x) => x.e);
}

export function queryEvents(events, params) {
  let out = events;

  const idSet = list(params.get("id"));
  if (idSet.length) out = out.filter((e) => idSet.includes(e.id));

  const venues = list(params.get("venueId"));
  if (venues.length) out = out.filter((e) => venueIds(e).some((v) => venues.includes(v)));

  const promoters = list(params.get("promoterId"));
  if (promoters.length) out = out.filter((e) => promoterIds(e).some((p) => promoters.includes(p)));

  const keyword = lc(params.get("keyword"));
  if (keyword) {
    out = out.filter(
      (e) =>
        lc(e.name).includes(keyword) ||
        (e?._embedded?.attractions || []).some((a) => lc(a.name).includes(keyword)),
    );
  }

  const cls = lc(params.get("classificationName"));
  if (cls) out = out.filter((e) => classNames(e).includes(cls));

  const from = params.get("localStartDateTime");
  const to = params.get("localEndDateTime");
  if (from || to) {
    out = out.filter((e) => {
      const s = localStart(e);
      if (s === null) return false;
      if (from && s < from) return false;
      if (to && s > to) return false;
      return true;
    });
  }

  const sort = lc(params.get("sort") || "date,asc");
  if (sort === "onsalestartdate,asc") out = sortBy(out, onSale, 1);
  else if (sort === "onsalestartdatetime,desc") out = sortBy(out, onSale, -1);
  else out = sortBy(out, localStart, 1);

  const rawSize = parseInt(params.get("size"), 10);
  const size = Math.min(200, Math.max(1, Number.isFinite(rawSize) ? rawSize : 20));
  const rawPage = parseInt(params.get("page"), 10);
  const number = Math.max(0, Number.isFinite(rawPage) ? rawPage : 0);
  const totalElements = out.length;
  const pageEvents = out.slice(number * size, number * size + size);

  const res = {};
  if (pageEvents.length) res._embedded = { events: pageEvents };
  res.page = { size, totalElements, totalPages: Math.ceil(totalElements / size), number };
  return res;
}

export function findEvent(events, id) {
  return events.find((e) => e.id === id) || null;
}
