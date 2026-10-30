(function () {
  var VERSION = '1.3.18';
  var CDN = 'https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@' + VERSION + '/dist';
  var PAGES = 'https://wolfazoid.github.io/16oc-events-deploy';
  var API_KEY = window.SALTSHED_API_KEY;
  var VENUE_IDS = ['KovZ917AI5F', 'KovZ917Amf0'];

  // Presale layer config. Auto-detects events whose Ticketmaster sales data
  // shows an upcoming presale window AND a public on-sale that hasn't started.
  // Paste the Hive signup form action URL into hiveFormAction to wire up the form.
  var PRESALE = {
    label: 'Presale',
    sectionTitle: 'On Presale Soon',
    sectionCopy: 'Sign up to be the first to get access when this presale opens.',
    dateLabel: 'Presale opens',
    hiveFormAction: '',
    hiveListField: 'list_id',
    hiveListValue: '',
    successMessage: "You're on the list — check your inbox.",
    errorMessage: 'Something went wrong. Please try again.'
  };

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

  var SHORT_NAMES = {
    'KovZ917AI5F': 'Shed',
    'rZ7HnEZ17pa4z': 'Shed',
    'KovZ917Amf0': 'Fairgrounds',
    'rZ7HnEZ17qokf': 'Fairgrounds'
  };

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
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = JSON.stringify(SHORT_NAMES);
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
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = JSON.stringify(SHORT_NAMES);
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
      el.dataset.venueShortNames = JSON.stringify(SHORT_NAMES);
    });

    VenueEvents.init({
      apiKey: API_KEY,
      venues: VENUE_IDS,
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

    initPresaleLayer();
  };
  script.onerror = function () {
    console.error('[VenueEvents] Failed to load widget from CDN:', script.src);
  };
  document.head.appendChild(script);

  // ---- Presale layer ---------------------------------------------------
  // The widget exposes no per-event hook for label or modal-section overrides,
  // so this layer fetches sales data once, watches for cards/modals via
  // MutationObserver, and rewrites the venue label + injects a modal section.

  var presaleMap = new Map();
  var pendingModalEventId = null;

  function initPresaleLayer() {
    fetchPresaleEvents().then(function (map) {
      presaleMap = map;
      observeCards('[data-venue-events]');
      observeCards('[data-ve-curated]');
    });
    observeModalOpen();
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.ve-events__card[data-event-id]');
      if (card) pendingModalEventId = card.dataset.eventId;
    }, true);
  }

  function fetchPresaleEvents() {
    if (!API_KEY) return Promise.resolve(new Map());
    var url = 'https://app.ticketmaster.com/discovery/v2/events.json'
      + '?apikey=' + encodeURIComponent(API_KEY)
      + '&venueId=' + VENUE_IDS.join(',')
      + '&size=200&sort=date,asc';
    return fetch(url)
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var map = new Map();
        var now = Date.now();
        var events = (data && data._embedded && data._embedded.events) || [];
        events.forEach(function (ev) {
          var start = detectPresaleStart(ev, now);
          if (start !== null) map.set(ev.id, { presaleStartMs: start });
        });
        return map;
      })
      .catch(function () { return new Map(); });
    }

  function detectPresaleStart(ev, now) {
    if (!ev.sales) return null;
    var publicStart = ev.sales.public && ev.sales.public.startDateTime;
    // If public sale is already open, treat as not-presale.
    if (publicStart && Date.parse(publicStart) <= now) return null;
    var presales = ev.sales.presales || [];
    var earliest = null;
    for (var i = 0; i < presales.length; i++) {
      var p = presales[i];
      var startMs = p.startDateTime ? Date.parse(p.startDateTime) : null;
      var endMs = p.endDateTime ? Date.parse(p.endDateTime) : null;
      var upcoming = startMs && startMs > now;
      var active = startMs && endMs && startMs <= now && endMs >= now;
      if (upcoming || active) {
        if (earliest === null || startMs < earliest) earliest = startMs;
      }
    }
    return earliest;
  }

  function observeCards(rootSelector) {
    var roots = document.querySelectorAll(rootSelector);
    roots.forEach(function (root) {
      processCards(root);
      var obs = new MutationObserver(function () { processCards(root); });
      obs.observe(root, { childList: true, subtree: true });
    });
  }

  function processCards(root) {
    var cards = root.querySelectorAll('.ve-events__card[data-event-id]');
    cards.forEach(function (card) {
      if (card.dataset.presaleProcessed === '1') return;
      var info = presaleMap.get(card.dataset.eventId);
      if (info) {
        var label = card.querySelector('.ve-events__card-venue-label');
        if (label) {
          label.textContent = PRESALE.label;
          label.classList.add('ve-events__card-venue-label--presale');
        }
        card.dataset.presale = '1';
        card.dataset.presaleStart = String(info.presaleStartMs);
      }
      card.dataset.presaleProcessed = '1';
    });
  }

  function observeModalOpen() {
    var obs = new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (!node.classList || !node.classList.contains('ve-events__modal-overlay')) return;
          var eventId = pendingModalEventId;
          pendingModalEventId = null;
          if (!eventId) return;
          var info = presaleMap.get(eventId);
          if (info) injectPresaleSection(node, info);
        });
      });
    });
    obs.observe(document.body, { childList: true });
  }

  function injectPresaleSection(overlay, info) {
    var body = overlay.querySelector('.ve-events__modal-body');
    if (!body) return;
    var section = document.createElement('div');
    section.className = 've-events__modal-section ve-events__modal-section--presale';

    var title = document.createElement('h4');
    title.className = 've-events__modal-section-title';
    title.textContent = PRESALE.sectionTitle;
    section.appendChild(title);

    var copy = document.createElement('p');
    copy.className = 've-events__modal-section-text';
    copy.textContent = PRESALE.sectionCopy;
    section.appendChild(copy);

    var dateLine = document.createElement('p');
    dateLine.className = 've-events__modal-section-text ve-events__modal-presale-date';
    dateLine.textContent = PRESALE.dateLabel + ': ' + formatPresaleDate(info.presaleStartMs);
    section.appendChild(dateLine);

    section.appendChild(buildSignupForm());

    var firstSection = body.querySelector('.ve-events__modal-section');
    if (firstSection) body.insertBefore(section, firstSection);
    else body.appendChild(section);
  }

  function formatPresaleDate(ms) {
    var d = new Date(ms);
    try {
      return d.toLocaleString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit'
      });
    } catch (_) {
      return d.toString();
    }
  }

  function buildSignupForm() {
    var form = document.createElement('form');
    form.className = 've-events__presale-form';
    form.noValidate = true;

    var input = document.createElement('input');
    input.type = 'email';
    input.required = true;
    input.placeholder = 'you@example.com';
    input.className = 've-events__presale-input';
    input.name = 'email';
    input.setAttribute('aria-label', 'Email address');
    form.appendChild(input);

    var btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 've-events__presale-submit';
    btn.textContent = 'Sign Up';
    form.appendChild(btn);

    var status = document.createElement('p');
    status.className = 've-events__presale-status';
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value) {
        status.textContent = 'Please enter your email.';
        return;
      }
      if (!PRESALE.hiveFormAction) {
        status.textContent = '(Signup endpoint not configured.)';
        return;
      }
      btn.disabled = true;
      status.textContent = '';
      var fd = new FormData();
      fd.append('email', input.value);
      if (PRESALE.hiveListValue) fd.append(PRESALE.hiveListField, PRESALE.hiveListValue);
      fetch(PRESALE.hiveFormAction, { method: 'POST', mode: 'no-cors', body: fd })
        .then(function () {
          status.textContent = PRESALE.successMessage;
          input.value = '';
        })
        .catch(function () {
          status.textContent = PRESALE.errorMessage;
        })
        .then(function () { btn.disabled = false; });
    });

    return form;
  }
})();
