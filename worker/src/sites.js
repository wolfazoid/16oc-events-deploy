// Site profiles: the Ticketmaster queries each in-scope venue website makes.
// Mirrors baseline/profiles.js. Every request is fetched with all pages,
// size "200", sort "date,asc"; those are not repeated in params.

const THALIA_IDS = "rZ7HnEZ17aJq7,rZ7HnEZ17aJq0,KovZpZAktlaA";
const SPACE_IDS = "KovZpakJQe,KovZ917At8O";

// Venue/promoter sources for the 16OC "all" page.
const ALL_VENUE_SOURCES = {
  "empty-bottle": {
    promoterIds: ["6084"],
    venueIds: [
      "KovZpZAId16A", "rZ7HnEZ178O8A", "rZ7HnEZ17a4Af", "KovZ917AEIJ", "KovZ917AEEX",
      "KovZpZAFJ1EA", "KovZpZAFEFAA", "KovZpaptBe", "KovZpaptYe", "KovZpZAkt67A",
      "rZ7HnEZaeir", "rZ7HnEZ178gfg", "rZ7HnEZ17bbPI",
    ],
  },
  "salt-shed": { promoterIds: [], venueIds: ["KovZ917AI5F", "KovZ917Amf0", "rZ7HnEZ17_Skd"] },
  space: { promoterIds: ["6085"], venueIds: ["KovZpakJQe", "rZ7HnEZ173FQ4", "rZ7HnEZ17fSA4", "KovZ917At8O"] },
  thalia: { promoterIds: [], venueIds: ["rZ7HnEZ17aJq7", "rZ7HnEZ17aJq0", "KovZpZAktlaA"] },
};

function allVenueRequests() {
  const requests = [];
  for (const source of Object.values(ALL_VENUE_SOURCES)) {
    requests.push({ params: { venueId: source.venueIds.join(",") } });
    for (const promoterId of source.promoterIds) requests.push({ params: { promoterId } });
  }
  return requests;
}

const rules = (overrides = {}) => ({
  requireTicketUrl: true,
  excludedArtists: [],
  excludeEvents: [],
  ...overrides,
});

export const SITES = {
  saltshed: {
    id: "saltshed",
    keyBinding: "TM_KEY_SALTSHED",
    requests: [
      {
        params: {
          venueId: "KovZ917AI5F,KovZ917Amf0,rZ7HnEZ17_oxd,rZ7HnEZ17qAZK,rZ7HnEZ17qvqS,rZ7HnEZ17qvrd",
        },
      },
    ],
    rules: rules({ requireTicketUrl: false, excludedArtists: ["Oliver Tree"] }),
  },
  thalia: {
    id: "thalia",
    keyBinding: "TM_KEY_THALIA",
    requests: [{ params: { venueId: THALIA_IDS, source: "ticketweb" } }],
    rules: rules(),
  },
  emptybottle: {
    id: "emptybottle",
    keyBinding: "TM_KEY_EMPTYBOTTLE",
    requests: [
      { params: { venueId: "rZ7HnEZ178gfg,KovZpZAId16A,rZ7HnEZ17aJ47", source: "ticketmaster,ticketweb" } },
      { params: { promoterId: "6084" } },
    ],
    rules: rules(),
  },
  space: {
    id: "space",
    keyBinding: "TM_KEY_SPACE",
    requests: [{ params: { venueId: SPACE_IDS } }, { params: { promoterId: "6085" } }],
    rules: rules(),
  },
  cahn: {
    id: "cahn",
    keyBinding: "TM_KEY_SPACE",
    requests: [{ params: { venueId: "KovZ917At8O" } }],
    rules: rules(),
  },
  sixteenoc: {
    id: "sixteenoc",
    keyBinding: "TM_KEY_DEFAULT",
    requests: allVenueRequests(),
    rules: rules(),
  },
};

export function getSite(id) {
  return Object.hasOwn(SITES, id) ? SITES[id] : null;
}
