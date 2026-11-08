# 16oc-events-deploy

Deployment layer for the [ticketmaster-venue-widget](https://github.com/wolfazoid/ticketmaster-venue-widget) across the 16 On Center venue network. This repo contains per-venue loader scripts, brand themes, the 16OC event hub (a Cloudflare Worker), and embed snippets for Squarespace.

> **Picking this work back up?** Start with [`docs/STATUS.md`](docs/STATUS.md) for the current state, blockers and next steps.

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

Optionally, add `window.SALTSHED_EXCLUDE_EVENTS = [...]` before the loader script to hide specific events — see "Hide a specific event" below.

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
| `bundle/salt-shed/`, `scripts/build-salt-shed-bundle.js` | Source and build for the self-contained bundle the live Salt Shed site runs |
| `worker/src/` | The event hub: per-site snapshots, Ticketmaster-compatible API, health, admin refresh (see [Event hub](#event-hub-worker)). Not deployed yet |
| `wrangler.toml` | Hub Worker config (cron, KV binding) |
| `baseline/`, `scripts/capture-baseline.js`, `scripts/shadow-diff.js` | Records what each live site shows, and diffs the hub against it |
| `test/fixtures/baseline/` | Captured per-site baseline (2026-10-30) |
| `legacy/` | Live copies of the legacy widgets (API keys redacted). These are the reference for parity |
| `event-feed-widget-original.js` | Older archived copy of the legacy widget. Superseded by `legacy/` |
| `docs/` | `STATUS.md` (start here), plus specs and plans under `docs/superpowers/` |

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

### Self-contained bundle (what the live site actually runs)

As of September 2026 the live site does **not** load the GitHub Pages loader. It loads a single self-contained file uploaded to Squarespace file storage, served at `https://www.saltshedchicago.com/s/salt-shed.js`, and referenced from Code Injection as:

```html
<script>window.SALTSHED_API_KEY = 'YOUR_TICKETMASTER_KEY';</script>
<script src="/s/salt-shed.js"></script>
```

That file is built from the parts in `bundle/salt-shed/`:

| Part | Contents |
|---|---|
| `01-styles.js` | Base widget CSS + Salt Shed theme, injected via `<style>` |
| `02-runtime.js` | Widget runtime. A **fork** of `ticketmaster-venue-widget` `src/index.js` carrying changes not yet published upstream (`excludedArtists`, `venueFilterIds`, presale handling, `excludeEvents`) |
| `03-bootstrap.js` | Per-element defaults, venue list, and the `VenueEvents.init()` call |

```bash
npm run build:salt-shed     # writes sites/salt-shed.js
npm test                    # loads the built file and checks the bootstrap + exclusions
```

Then upload `sites/salt-shed.js` to Squarespace (Settings → Files), replacing the existing `salt-shed.js`. Squarespace keeps the same `/s/salt-shed.js` URL. `sites/live-snapshot-2026-08-11-salt-shed.js` is the file that was live before this build process existed; keep it for diffing.

Widget-level changes should still be made upstream and released to npm; when that happens, replace `02-runtime.js` with the upstream `src/index.js` and drop this fork.

### Hide a specific event (self-serve for the client)

Both the bundle and the loader hide listed events on every surface (grid, featured, curated). The client can manage the list in either of two places, no deploy needed.

**Option A — on the events grid in the Squarespace Code Block** (comma-separated ids from the Ticketmaster link, or full links):

```html
<div data-venue-events data-exclude-events="0400652BB8ACB1CF, 0400643BF736AC2E"></div>
```

**Option B — in Settings → Advanced → Code Injection → Footer**, right next to the API key line:

```html
<script>window.SALTSHED_API_KEY = 'YOUR_TICKETMASTER_KEY';</script>
<script>
  window.SALTSHED_EXCLUDE_EVENTS = [
    'https://www.ticketmaster.com/event/0400652BB8ACB1CF',
  ];
</script>
<script src="https://wolfazoid.github.io/16oc-events-deploy/venues/salt-shed.js"></script>
```

Each entry can be a full `ticketmaster.com/event/...` link (easiest — copy it from the event page), the ID from that link, or a Discovery API event ID. Matching is case-insensitive. Remove the entry to show the event again. The exclusion applies to visitors' cached data too, so changes are visible on the next page load.

Both sources merge. Artist-level exclusion (`excludedArtists`, currently `['Oliver Tree']`) is still hardcoded in `bundle/salt-shed/03-bootstrap.js` and needs a rebuild + upload to change.

Requires the September 2026 bundle or newer, or widget `1.3.21` or newer via the loader (the `excludeEvents` option).

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

## Event hub (worker/)

The Cloudflare Worker in `worker/` is the 16OC event hub. It snapshots Ticketmaster events for each site every 10 minutes and serves them through a Ticketmaster-compatible API. A widget can then switch to it by setting only `proxyUrl`, and API keys stay server-side.

**Status:** built and tested, but **not deployed**, and no live site uses it yet. See [`docs/STATUS.md`](docs/STATUS.md).

| Piece | File |
|---|---|
| Site profiles (venue/promoter IDs, rules per site) | `worker/src/sites.js` |
| Selection rules (dedupe, cancelled, past, exclusions, sort) | `worker/src/select.js` |
| Paged Ticketmaster fetch (15 s timeout, 1,000-result cap) | `worker/src/tm.js` |
| Snapshots in KV, failure isolation, drop guards | `worker/src/snapshot.js` |
| Ticketmaster-compatible query over a snapshot | `worker/src/query.js` |
| Venues/classifications pass-through (allow-listed params, edge cache) | `worker/src/passthrough.js` |
| Routes, cron, health | `worker/src/index.js` |

Sites: `saltshed`, `thalia`, `emptybottle`, `space`, `cahn`, `sixteenoc`.

| Route | Purpose |
|---|---|
| `GET /v1/{site}/events.json` | Events from the snapshot. Accepts the widget's params (`venueId`, `keyword`, `classificationName`, `localStartDateTime`/`localEndDateTime`, `id`, `promoterId`, `sort`, `size`, `page`). Returns 503 if the site has no snapshot yet |
| `GET /v1/{site}/events/{id}.json` | One event from the snapshot |
| `GET /v1/{site}/venues/{id}.json`, `/v1/{site}/classifications.json` | Passed through to Ticketmaster with the site's key, edge-cached |
| `GET /health` | Last attempt, last success, last error and `capped` for each site. 503 `degraded` if any site has gone more than 30 min without a success, is capped, or has never refreshed |
| `POST /admin/refresh[?site=x][&force=1]` | Refresh now. Requires `Authorization: Bearer <ADMIN_TOKEN>`. `force=1` bypasses the drop guards for that run |

**Guards:**
- One site failing never stops the others.
- A snapshot is never replaced by one that has fallen below 50% of a previous list of 10 or more events.
- A snapshot is never replaced by one that went to zero events.
- A snapshot is never replaced when one of its requests went to zero results.

A refused refresh shows up as `lastError` on `/health`.

### Deploy

```bash
npx wrangler login                              # 16OC's Cloudflare account
npx wrangler kv namespace create SNAPSHOTS      # paste the id into wrangler.toml
npx wrangler secret put TM_KEY_SALTSHED         # repeat for TM_KEY_THALIA, TM_KEY_EMPTYBOTTLE, TM_KEY_SPACE, TM_KEY_DEFAULT
npx wrangler secret put ADMIN_TOKEN             # e.g. openssl rand -hex 32
npx wrangler deploy
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" https://<hub>/admin/refresh
curl https://<hub>/health
```

Cron runs every 10 minutes (`wrangler.toml`). The full checklist, including the 3-day shadow diff, is Task 8 in `docs/superpowers/plans/2026-10-30-16oc-hub-phase-1.md`.

### Local run and shadow diff

See "How to run things" in [`docs/STATUS.md`](docs/STATUS.md). In short: put keys in a gitignored `.dev.vars`, run `npx wrangler dev --local`, POST `/admin/refresh`, then run `HUB_URL=http://localhost:8787 TM_API_KEY=... npm run shadow`.

### Wiring a widget to the hub (Phase 2+)

Set `proxyUrl` to `https://<hub>/v1/<site>`, drop the API key, and set `promoterId: null`, because promoter merges happen in the hub profile. The widget builds the same request paths, so no other change is needed.

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
| Event hub (not deployed yet) | `https://events.16oncenterchicago.com` (planned) | `npx wrangler deploy` from this repo (see [Event hub](#event-hub-worker)) |

## Related

- [ticketmaster-venue-widget](https://github.com/wolfazoid/ticketmaster-venue-widget) — widget source, published to npm, serves via jsDelivr CDN
- [Ticketmaster Discovery API docs](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/)
