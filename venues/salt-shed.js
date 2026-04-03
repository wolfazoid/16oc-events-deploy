(function () {
  var VERSION = '1.1.0';
  var CDN = 'https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@' + VERSION + '/dist';
  var PAGES = 'https://wolfazoid.github.io/16oc-events-deploy';
  var PROXY = 'https://16oc-events-proxy.<YOUR_SUBDOMAIN>.workers.dev';

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

  // Widget JS — init after load
  var script = document.createElement('script');
  script.src = CDN + '/ticketmaster-venue-widget.min.js';
  script.onload = function () {
    VenueEvents.init({
      proxyUrl: PROXY,
      venues: 'KovZ917AI5F,KovZ917Amf0,rZ7HnEZ17_Skd',
      subVenues: {
        'KovZ917Amf0': 'Fairgrounds',
        'rZ7HnEZ17_Skd': 'Three Top Lounge'
      },
      tracking: {
        utmSource: 'saltshed-website',
        utmMedium: 'widget',
        utmCampaign: 'events'
      }
    });
  };
  document.head.appendChild(script);
})();
