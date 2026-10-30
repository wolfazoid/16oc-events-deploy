# 16oc-events-deploy

Deployment layer for the [ticketmaster-venue-widget](https://github.com/wolfazoid/ticketmaster-venue-widget) across the 16 On Center venue network. This repo contains per-venue loader scripts, brand themes, a Cloudflare Worker proxy (optional), and embed snippets for Squarespace.

**What lives where:**

- **Widget source code** → `wolfazoid/ticketmaster-venue-widget` (sibling repo, published to npm, served via jsDelivr CDN)
- **Per-venue configuration + theming** → this repo, served via GitHub Pages
- **Squarespace site** → loads the per-venue loader from GitHub Pages, which in turn loads the widget from jsDelivr

Changes to theme CSS or loader config in this repo auto-deploy via GitHub Pages on `git push`. No Squarespace changes are needed to update a live site — the embedded `<script>` tag points at a stable URL here.

## Architecture

```
┌────────────────────────────┐     ┌─────────────────────────────┐
│ ticketmaster-venue-widget  │     │    16oc-events-deploy       │
│ (widget source)            │     │    (this repo)              │
│                            │     │                             │
│ src/index.js   ───────┐    │     │  venues/salt-shed.js        │
│ src/styles.css ───────┤    │     │  themes/salt-shed.css       │
│                       │    │     │                             │
│        ▼              │    │     │         │                   │
│  npm publish          │    │     │  git push                   │
│        │              │    │     │         │                   │
│        ▼              │    │     │         ▼                   │
│  jsDelivr CDN         │    │     │  GitHub Pages               │
│  (versioned releases) │    │     │  (wolfazoid.github.io/...)  │
└───────┬───────────────┘    │     └──────────┬──────────────────┘
        │                    │                │
        │ ticketmaster-venue-widget@X.Y.Z/dist│
        │                                     │
        └──────────────┐       ┌──────────────┘
                       ▼       ▼
              ┌───────────────────────────┐
              │  Squarespace page         │
              │                           │
              │  <script src=".../        │
              │    venues/salt-shed.js"   │
              │                           │
              │  <div data-venue-events>  │
              └───────────────────────────┘
```

## How the Squarespace embed works

Two pieces live in Squarespace. Once set, they never change — all future updates happen in this repo.

**1. Code Injection → Footer** (Settings → Advanced → Code Injection):

```html
<script>window.SALTSHED_API_KEY = 'YOUR_TICKETMASTER_KEY';</script>
<script src="https://wolfazoid.github.io/16oc-events-deploy/venues/salt-shed.js"></script>
```

**2. Code Block on the events page:**

```html
<div data-venue-events></div>
```

Optionally, add a featured hero and/or a curated strip to the same page:

```html
<div data-ve-featured></div>
<div data-ve-curated data-label="Recently Announced" data-option="recently-added"></div>
<div data-venue-events></div>
```

To pull the search/filter bar out of the events grid and place it at the top of the page, add a `data-ve-top-filters` mount above the other widget elements:

```html
<div data-ve-top-filters></div>
<div data-ve-featured></div>
<div data-ve-curated data-label="Recently Announced" data-option="recently-added"></div>
<div data-venue-events></div>
```

The loader detects this mount after the widget renders and moves `[data-venue-events]`'s built-in filter bar into it (listeners stay attached). Without the mount, the filter bar stays inside the events grid as before.

The loader (`venues/salt-shed.js`) applies defaults to each of these elements, then calls `VenueEvents.init({...})` to pull events from Ticketmaster and render them. See [`sites/saltshed.html`](sites/saltshed.html) for the canonical snippet.

## Repo layout

| Path | Purpose |
|---|---|
| `venues/salt-shed.js` | Salt Shed loader — pins widget version, sets short-name maps, modal sections, tracking, theme CSS link |
| `themes/salt-shed.css` | Salt Shed brand overrides (colors, fonts, radii, badge styling) |
| `sites/saltshed.html` | The exact snippet pasted into Squarespace (documentation only; not served) |
| `demos/saltshed.html` | Full-page local demo with the Salt Shed chrome (nav, hero, footer) for design iteration |
| `demos/lib/` | Local copies of the widget JS+CSS for offline demo use |
| `worker/src/` | Cloudflare Worker proxy — hides TM API keys server-side (optional; not currently in the Salt Shed loader path) |
| `wrangler.toml` | Cloudflare Worker config |
| `event-feed-widget-original.js` | Archived copy of the legacy 16 On Center widget — reference only |

## Common maintenance tasks

All of these are edits to files in this repo; commit and push, and GitHub Pages serves the update within a minute.

### Upgrade to a new widget version

The widget publishes to npm with semver tags. To pick up a new release:

1. Edit `venues/salt-shed.js`, update the `VERSION` string near the top:
   ```javascript
   var VERSION = '1.3.18';   // bump to newer version
   ```
2. Commit and push.

The loader constructs its CDN URL from `VERSION`: `https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@<VERSION>/dist/...`. jsDelivr serves tagged npm releases directly — no extra build step.

### Tweak theme colors / fonts

Edit `themes/salt-shed.css`. Selectors target CSS variables on the widget root (`[data-venue-events]`, `[data-ve-featured]`, `[data-ve-curated]`) or specific element classes (`.ve-events__card-title`, `.ve-events__modal`, etc.). The widget README has the full list of CSS variables under "Theming."

### Add or rename a venue short name

The info-side button on each event card shows a short venue label ("Shed", "Fairgrounds"). The map lives in **three** places in `venues/salt-shed.js` — one per element type (featured, curated, grid). Example:

```javascript
el.dataset.venueShortNames = JSON.stringify({
  'KovZ917AI5F': 'Shed',
  'rZ7HnEZ17pa4z': 'Shed',
  'KovZ917Amf0': 'Fairgrounds',
  'rZ7HnEZ17qokf': 'Fairgrounds',
});
```

When a new sub-venue shows up (e.g., SummerSalt Market on an alt ID), look up its venue ID via:

```bash
curl "https://app.ticketmaster.com/discovery/v2/events.json?apikey=$KEY&keyword=SummerSalt"
```

…then add the ID to all three maps with the desired label.

### Change modal sections / order

The modal's sections array lives in the `VenueEvents.init({ modal: { sections: [...] } })` call in `venues/salt-shed.js`:

```javascript
sections: ['image', 'info', 'description', 'startTime', 'ageRestriction', 'venue', 'price', 'performers', 'pleaseNote']
```

Order matches render order. Available section names are documented in the widget README. Omit any section to hide it.

### Change the curated strip count, label, or option

The curated strip defaults (label, heading level, event option, column count) are set inside the `curatedEls.forEach(...)` block in the loader. The widget looks at the `[data-ve-curated]` element's dataset, so either:

- Override defaults on a specific element: `<div data-ve-curated data-label="Just Announced" data-count="8">`
- Or change the loader defaults so every `[data-ve-curated]` on the site picks them up.

### Reactivate "Presale" / "Rescheduled" badges

Badges are off by default as of widget 1.3.18. To turn them back on for a specific widget, add `data-show-status-badges="true"` to the element. The theme CSS for the badges (in `themes/salt-shed.css`) is still in place.

## Local testing

`demos/saltshed.html` is a full-page Salt Shed demo (nav, hero, events grid, footer) that mounts the widget against a local build. It's useful for design iteration before publishing a new widget version.

```bash
# From the widget repo, build and copy the latest dist/ files into demos/lib/
cd ../ticketmaster-venue-widget
npm run build
cp dist/ticketmaster-venue-widget.min.{js,css} ../16oc-events-deploy/demos/lib/

# Then open demos/saltshed.html in a browser
open /Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy/demos/saltshed.html
```

The demo file uses the TM Discovery API key directly in a data attribute (no proxy). Replace with a real key value for local tests; don't commit a real key.

## Cloudflare Worker (optional proxy)

The `worker/` directory contains a Cloudflare Worker that proxies Ticketmaster Discovery API requests with server-side API keys. This lets venues embed the widget without exposing their API key in the client.

**Current status:** the Salt Shed loader does **not** use the worker — it passes `window.SALTSHED_API_KEY` directly to `VenueEvents.init()`. The worker is fully built and ready to wire up if the client-side key becomes a concern.

### Deployment

```bash
npm install                    # installs wrangler
npx wrangler login             # first time only
npx wrangler deploy            # deploys to Cloudflare
```

### Setting secrets

Each venue group uses its own key. Store them as Worker secrets:

```bash
npx wrangler secret put TM_KEY_SALTSHED
npx wrangler secret put TM_KEY_THALIA
npx wrangler secret put TM_KEY_SPACE
npx wrangler secret put TM_KEY_EMPTYBOTTLE
npx wrangler secret put TM_KEY_PROMONTORY
npx wrangler secret put TM_KEY_DEFAULT
```

### Wiring the loader to use the worker

In `venues/salt-shed.js`, add `proxyUrl` to the init call and remove (or ignore) the `apiKey`:

```javascript
VenueEvents.init({
  proxyUrl: 'https://16oc-events-proxy.<your-account>.workers.dev',
  apiKey: 'placeholder',  // still required by the guard, not sent to TM
  venues: ['KovZ917AI5F', 'KovZ917Amf0'],
  // ...
});
```

The worker routes requests to the correct secret by the `venueId` query parameter (see `worker/src/config.js` for the venue → secret map).

## Salt Shed venue ID reference

| Venue ID | Display name | Short name |
|---|---|---|
| `KovZ917AI5F` | The Salt Shed Indoors (Shed) | Shed |
| `rZ7HnEZ17pa4z` | The Salt Shed Indoors (Shed) *(alt ID for Open House)* | Shed |
| `KovZ917Amf0` | Salt Shed Fairgrounds | Fairgrounds |
| `rZ7HnEZ17qokf` | The Salt Shed Outdoors (Fairgrounds) *(alt ID for SummerSalt Market)* | Fairgrounds |
| `rZ7HnEZ17_Skd` | Three Top Lounge | Three Top |

New alt IDs tend to appear when a special event series is scheduled — Ticketmaster sometimes assigns a sub-venue its own ID. If you see a card with the full venue name instead of the short label, that event's venue ID needs to be added to the short-name map.

## Deployment

Both deployment surfaces are push-based.

| Artifact | Where it's served | How to deploy |
|---|---|---|
| Loader + theme (this repo) | `https://wolfazoid.github.io/16oc-events-deploy/...` | Push to `main` — GitHub Pages auto-builds |
| Widget JS/CSS | `https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@<VERSION>/dist/...` | `npm publish` from the widget repo, then bump `VERSION` here |
| Cloudflare Worker (if used) | `https://16oc-events-proxy.<account>.workers.dev` | `npx wrangler deploy` from this repo |

## Related

- [ticketmaster-venue-widget](https://github.com/wolfazoid/ticketmaster-venue-widget) — widget source, published to npm, serves via jsDelivr CDN
- [Ticketmaster Discovery API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
