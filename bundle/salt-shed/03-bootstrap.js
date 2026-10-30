  // 3. Bootstrap: set per-element defaults, then init
  var API_KEY = window.SALTSHED_API_KEY;

  // Events to hide on every surface (grid, featured, curated). Two ways to set:
  //   1. On the events grid element in a Squarespace Code Block:
  //        <div data-venue-events data-exclude-events="0400652BB8ACB1CF, 0400643BF736AC2E"></div>
  //   2. In Code Injection, next to the API key:
  //        <script>window.SALTSHED_EXCLUDE_EVENTS = ['https://www.ticketmaster.com/event/0400652BB8ACB1CF'];</script>
  // Entries may be the id from a ticketmaster.com/event/<ID> link, a full
  // ticketmaster.com or ticketweb.com event link, or a Discovery API id.
  // Comma-separated strings and arrays are both accepted; both sources merge.
  function parseExcludeList(value) {
    var list = Array.isArray(value) ? value : String(value || '').split(',');
    return list.map(function (s) { return String(s || '').trim(); }).filter(Boolean);
  }

  function collectExcludeEvents() {
    var list = parseExcludeList(window.SALTSHED_EXCLUDE_EVENTS);
    document.querySelectorAll('[data-venue-events], [data-ve-featured], [data-ve-curated]').forEach(function (el) {
      list = list.concat(parseExcludeList(el.dataset.excludeEvents));
    });
    return list;
  }

  function bootstrap() {
    var venueShortNames = {
      'KovZ917AI5F': 'Shed',
      'rZ7HnEZ17pa4z': 'Shed',
      'KovZ917Amf0': 'Fairgrounds',
      'rZ7HnEZ17qokf': 'Fairgrounds',
      'rZ7HnEZ17_oxd': 'Salt Shed',      // "1357 N Elston Ave" (Elston Skate Club)
      'rZ7HnEZ17qAZK': 'Three Top',      // Move at the Shed
      'rZ7HnEZ17qvqS': 'Rooftop',        // "Premium Rooftop" (Move at the Shed)
      'rZ7HnEZ17qvrd': 'Fairgrounds'     // "Outdoor Fairgrounds Stage" (Move at the Shed)
    };
    var venueShortNamesJson = JSON.stringify(venueShortNames);

    document.querySelectorAll('[data-ve-featured]').forEach(function (el) {
      if (!el.dataset.heading) el.dataset.heading = 'h2';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = venueShortNamesJson;
    });

    document.querySelectorAll('[data-ve-curated]').forEach(function (el) {
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.count) el.dataset.count = '5';
      if (!el.dataset.columns) el.dataset.columns = '3';
      if (!el.dataset.showVenueLabel) el.dataset.showVenueLabel = 'true';
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = venueShortNamesJson;
    });

    document.querySelectorAll('[data-venue-events]').forEach(function (el) {
      el.dataset.columns = '4';
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      el.dataset.showFilters = 'true';
      el.dataset.showVenueFilter = 'true';
      // Dropdown lists Shed + Fairgrounds only; micro-venue events still
      // appear in the grid under "All Venues".
      el.dataset.venueFilterIds = 'KovZ917AI5F,KovZ917Amf0';
      el.dataset.showVenueLabel = 'true';
      el.dataset.showPrice = 'false';
      el.dataset.showPagination = 'false';
      el.dataset.venueShortNames = venueShortNamesJson;
    });

    VenueEvents.init({
      apiKey: API_KEY,
      venues: [
        'KovZ917AI5F',   // The Salt Shed Indoors (Shed)
        'KovZ917Amf0',   // The Salt Shed Outdoors (Fairgrounds)
        'rZ7HnEZ17_oxd', // 1357 N Elston Ave
        'rZ7HnEZ17qAZK', // Three Top (NOT Three Top Lounge rZ7HnEZ17_Skd)
        'rZ7HnEZ17qvqS', // Premium Rooftop
        'rZ7HnEZ17qvrd'  // Outdoor Fairgrounds Stage
      ],
      excludedArtists: ['Oliver Tree'],
      excludeEvents: collectExcludeEvents(),
      tracking: {
        enabled: true,
        utmSource: 'saltshed-website',
        utmMedium: 'widget',
        utmCampaign: 'events'
      },
      modal: {
        sections: ['image', 'info', 'description', 'startTime', 'ageRestriction', 'venue', 'price', 'performers', 'pleaseNote'],
        timeDisplay: 'doors',
        startTimeLabel: 'Doors',
        doorsOffsetMinutes: 60,
        showVenueCity: false
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
