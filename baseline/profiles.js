/**
 * The exact Ticketmaster queries each live touchpoint makes today, copied from
 * the live code on 2026-10-30. The hub's site profiles must reproduce the
 * event sets these produce.
 *
 * request: { params, allPages } — params go to /discovery/v2/events.json
 * (apikey added at capture time). allPages follows page.totalPages; otherwise
 * only page 0 is read, as the live code does.
 * "@today" becomes today's Chicago date at T00:00:00.
 */

const LEGACY = "legacy/event-feed-widget.venues.live-2026-10-30.js";
const RECENT = "legacy/recently-announced-widget.live-2026-10-30.js";

// legacy venueIdMap / allVenueSourceConfig (used by the 16OC "all" page).
// Duplicate KovZ917AEIJ is in the live map; kept for fidelity.
const ALL_VENUE_SOURCES = {
  "empty-bottle": {
    promoterIds: ["6084"],
    venueIds: [
      "KovZpZAId16A", "rZ7HnEZ178O8A", "rZ7HnEZ17a4Af", "KovZ917AEIJ", "KovZ917AEEX",
      "KovZpZAFJ1EA", "KovZpZAFEFAA", "KovZpaptBe", "KovZpaptYe", "KovZpZAkt67A",
      "KovZ917AEIJ", "rZ7HnEZaeir", "rZ7HnEZ178gfg", "rZ7HnEZ17bbPI",
    ],
  },
  "salt-shed": { promoterIds: [], venueIds: ["KovZ917AI5F", "KovZ917Amf0", "rZ7HnEZ17_Skd"] },
  space: { promoterIds: ["6085"], venueIds: ["KovZpakJQe", "rZ7HnEZ173FQ4", "rZ7HnEZ17fSA4", "KovZ917At8O"] },
  thalia: { promoterIds: [], venueIds: ["rZ7HnEZ17aJq7", "rZ7HnEZ17aJq0", "KovZpZAktlaA"] },
};

function allVenueRequests() {
  const requests = [];
  for (const source of Object.values(ALL_VENUE_SOURCES)) {
    const base = { size: "200", sort: "date,asc" };
    requests.push({ params: { ...base, venueId: source.venueIds.join(",") }, allPages: true });
    for (const promoterId of source.promoterIds) {
      requests.push({ params: { ...base, promoterId }, allPages: true });
    }
  }
  return requests;
}

const THALIA_IDS = "rZ7HnEZ17aJq7,rZ7HnEZ17aJq0,KovZpZAktlaA";
const SPACE_IDS = "KovZpakJQe,KovZ917At8O";

module.exports = {
  saltshed: {
    page: "https://www.saltshedchicago.com/home",
    code: "bundle/salt-shed/ (data-venue-events grid)",
    selector: "newWidget",
    excludedArtists: ["Oliver Tree"],
    requests: [
      {
        params: {
          venueId: "KovZ917AI5F,KovZ917Amf0,rZ7HnEZ17_oxd,rZ7HnEZ17qAZK,rZ7HnEZ17qvqS,rZ7HnEZ17qvrd",
          size: "200",
          sort: "date,asc",
          page: "0",
          localStartDateTime: "@today",
        },
        allPages: false,
      },
    ],
  },
  thalia: {
    page: "https://www.thaliahallchicago.com/home",
    code: `${LEGACY} (venue 'thalia') + ${RECENT} (feed 'thalia')`,
    selector: "legacy",
    requests: [{ params: { size: "200", venueId: THALIA_IDS, source: "ticketweb" }, allPages: false }],
    recentlyAnnounced: [
      { params: { size: "200", venueId: THALIA_IDS, source: "ticketweb", sort: "onSaleStartDate,asc" }, allPages: false },
    ],
  },
  emptybottle: {
    page: "https://www.emptybottle.com/home",
    code: `${LEGACY} (venue 'empty-bottle')`,
    selector: "legacy",
    requests: [
      {
        params: { size: "200", venueId: "rZ7HnEZ178gfg,KovZpZAId16A,rZ7HnEZ17aJ47", source: "ticketmaster,ticketweb" },
        allPages: false,
      },
      // Live code omits size here, so Ticketmaster's default of 20 applies.
      { params: { promoterId: "6084" }, allPages: false },
    ],
  },
  space: {
    page: "https://evanstonspace.com/all-shows",
    code: `${LEGACY} (venue 'space') + ${RECENT} (feed 'space')`,
    selector: "legacy",
    requests: [
      { params: { size: "200", venueId: SPACE_IDS }, allPages: false },
      { params: { size: "200", promoterId: "6085" }, allPages: false },
    ],
    recentlyAnnounced: [
      { params: { size: "200", venueId: SPACE_IDS, sort: "onSaleStartDate,asc" }, allPages: false },
      { params: { size: "200", promoterId: "6085", sort: "onSaleStartDate,asc" }, allPages: false },
    ],
  },
  cahn: {
    page: "https://evanstonspace.com/cahn",
    code: `${LEGACY} (venue 'cahn')`,
    selector: "legacy",
    requests: [{ params: { size: "200", venueId: "KovZ917At8O" }, allPages: false }],
  },
  sixteenoc: {
    page: "https://www.16oncenterchicago.com/",
    code: "legacy/event-feed-widget.16oc.live-2026-10-30.js (venue 'all', no filters selected)",
    selector: "legacy",
    requests: allVenueRequests(),
  },
};
