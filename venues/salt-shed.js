(function () {
  var VERSION = '1.3.18';
  var CDN = 'https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@' + VERSION + '/dist';
  var PAGES = 'https://wolfazoid.github.io/16oc-events-deploy';
  var API_KEY = window.SALTSHED_API_KEY;

  // Widget base CSS from CDN
  var widgetCss = document.createElement('link');
  widgetCss.rel = 'stylesheet';
  widgetCss.href = CDN + '/ticketmaster-venue-widget.min.css';
  document.head.appendChild(widgetCss);

  // Salt Shed theme CSS from GitHub Pages
  var themeCss = document.createElement('link');
  themeCss.rel = 'stylesheet';
  themeCss.href = PAGES + '/themes/salt-shed.css';
  document.head.appendChild(themeCss);

  // Widget JS — configure elements then init after load
  var script = document.createElement('script');
  script.src = CDN + '/ticketmaster-venue-widget.min.js';
  script.onload = function () {
    // Set defaults on featured hero elements
    var featuredEls = document.querySelectorAll('[data-ve-featured]');
    featuredEls.forEach(function (el) {
      if (!el.dataset.label) el.dataset.label = 'Happening Soon';
      if (!el.dataset.heading) el.dataset.heading = 'h2';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.venueShortNames) {
        el.dataset.venueShortNames = JSON.stringify({
          'KovZ917AI5F': 'Shed',
          'rZ7HnEZ17pa4z': 'Shed',
          'KovZ917Amf0': 'Fairgrounds',
          'rZ7HnEZ17qokf': 'Fairgrounds',
        });
      }
    });

    // Set defaults on curated strip elements
    var curatedEls = document.querySelectorAll('[data-ve-curated]');
    curatedEls.forEach(function (el) {
      if (!el.dataset.label) el.dataset.label = 'Featured Events';
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.count) el.dataset.count = '5';
      if (!el.dataset.columns) el.dataset.columns = '3';
      if (!el.dataset.showVenueLabel) el.dataset.showVenueLabel = 'true';
      if (!el.dataset.venueShortNames) {
        el.dataset.venueShortNames = JSON.stringify({
          'KovZ917AI5F': 'Shed',
          'rZ7HnEZ17pa4z': 'Shed',
          'KovZ917Amf0': 'Fairgrounds',
          'rZ7HnEZ17qokf': 'Fairgrounds',
        });
      }
    });

    // Set element-level display options on all widget divs
    var elements = document.querySelectorAll('[data-venue-events]');
    elements.forEach(function (el) {
      el.dataset.columns = '4';
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      el.dataset.showFilters = 'true';
      el.dataset.showVenueFilter = 'true';
      el.dataset.showVenueLabel = 'true';
      el.dataset.showPrice = 'false';
      el.dataset.showPagination = 'false';
      el.dataset.venueShortNames = JSON.stringify({
        'KovZ917AI5F': 'Shed',
        'rZ7HnEZ17pa4z': 'Shed',
        'KovZ917Amf0': 'Fairgrounds',
        'rZ7HnEZ17qokf': 'Fairgrounds',
      });
    });

    VenueEvents.init({
      apiKey: API_KEY,
      venues: ['KovZ917AI5F', 'KovZ917Amf0'],
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
        showVenueCity: false,
      }
    });

    relocateFilterBar();
  };

  // If a [data-ve-top-filters] mount exists on the page, move each grid's
  // .ve-events__filters into it. The widget's filter listeners are closure-bound
  // to the grid instance, so the bar keeps working at its new location.
  // A MutationObserver re-runs the move on widget refresh()/re-render.
  function relocateFilterBar() {
    var target = document.querySelector('[data-ve-top-filters]');
    if (!target) return;
    document.querySelectorAll('[data-venue-events]').forEach(function (gridEl) {
      moveFilters(gridEl, target);
      new MutationObserver(function () { moveFilters(gridEl, target); })
        .observe(gridEl, { childList: true });
    });
  }

  function moveFilters(gridEl, target) {
    var filters = gridEl.querySelector(':scope > .ve-events__filters');
    if (filters && filters.parentNode !== target) target.appendChild(filters);
  }
  script.onerror = function () {
    console.error('[VenueEvents] Failed to load widget from CDN:', script.src);
  };
  document.head.appendChild(script);
})();
