(function () {
  var VERSION = '1.1.0';
  var CDN = 'https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@' + VERSION + '/dist';
  var PAGES = 'https://wolfazoid.github.io/16oc-events-deploy';
  var API_KEY = 'VlcOb6C2Y4W0iGius6pFX1Gh7a9GnKyg';

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
    // Set element-level display options on all widget divs
    var elements = document.querySelectorAll('[data-venue-events]');
    elements.forEach(function (el) {
      el.dataset.columns = '4';
      el.dataset.showFilters = 'true';
      el.dataset.showVenueFilter = 'true';
      el.dataset.showVenueLabel = 'true';
      el.dataset.showPrice = 'false';
    });

    VenueEvents.init({
      apiKey: API_KEY,
      venues: ['KovZ917AI5F', 'KovZ917Amf0'],
      subVenues: {
        'KovZ917Amf0': 'Fairgrounds',
      },
      tracking: {
        enabled: true,
        utmSource: 'saltshed-website',
        utmMedium: 'widget',
        utmCampaign: 'events'
      },
      modal: {
        sections: ['image', 'info', 'startTime', 'ageRestriction', 'venue', 'price', 'performers'],
        timeDisplay: 'doors',
        startTimeLabel: 'Doors',
        doorsOffsetMinutes: 60,
        showVenueCity: false,
      }
    });
  };
  script.onerror = function () {
    console.error('[VenueEvents] Failed to load widget from CDN:', script.src);
  };
  document.head.appendChild(script);
})();
