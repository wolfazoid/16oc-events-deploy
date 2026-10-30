# 16OC Event Hub — Transition & Rollout Design

**Date:** 2026-10-30
**Status:** Draft for review
**Scope:** Move every 16OC event touchpoint off direct browser→Ticketmaster calls and onto one hub, starting with Salt Shed, then the legacy-widget sites, plus the new Aloompa app feed.

## 1. Current state (verified 2026-10-30)

| Touchpoint | Page(s) | What runs | Data path |
|---|---|---|---|
| saltshedchicago.com | `/home` (`data-ve-curated` + `data-venue-events`) | New widget, self-contained bundle uploaded to Squarespace (`/s/salt-shed.js`, built 2026-08-11) | Browser → TM, key in Code Injection (`SALTSHED_API_KEY`) |
| thaliahallchicago.com | `/home` (grid + "recently announced") | Legacy `/s/event-feed-widget.js` + `/s/recently-announced-widget.js`, mount `#widget-full-feed.thalia` | Browser → TM, hardcoded key |
| emptybottle.com | `/home` (grid) | Legacy, `#widget-full-feed.empty-bottle` | Browser → TM, hardcoded key, + promoter 6084 merge |
| evanstonspace.com | `/all-shows` (grid + recently announced), `/cahn` | Legacy, `.space` / `.cahn` | Browser → TM, + promoter 6085 merge, `queue`-source filter |
| 16oncenterchicago.com | `/` | Legacy `all` mode (venue/genre/date filters across properties) | Browser → TM |
| promontorychicago.com | — | Site unreachable; `promontory` branch commented out in live legacy widget | **Confirm with 16OC whether it's still in scope** |
| Aloompa app | — | Manual entry | None (new) |

Findings that shape the plan:
- **Production is ahead of git in two places.** The legacy widget on the live sites is newer than `event-feed-widget-original.js`: it adds the `all` and `cahn` modes and uses different Space venue IDs. Salt Shed's bundle source exists only as untracked `bundle/` + `scripts/` files. The local build matches the live bundle except for the newer `excludeEvents` feature, which isn't deployed yet.
- **Per-site data rules are embedded in widget code.** For example: Thalia uses `source=ticketweb` only, Empty Bottle's promoter query has no `size` (so Ticketmaster's default of 20 applies), and the 16OC all-venues page uses wider venue lists than the venue sites do. The full set is in `baseline/profiles.js`. The rules in `worker/src/config.js` **do not match** the live behavior: Space IDs `rZ7HnEZ173FQ4`/`rZ7HnEZ17fSA4` in config vs `KovZpakJQe,KovZ917At8O` live. The live legacy widget is the source of truth for parity.
- **At least five TM API keys are public** in page source.
- The new widget's `buildUrl()` already routes everything through `config.proxyUrl` when set. It calls `/events.json` (with `keyword`, `classificationName`, date range, `venueId`, paging), `/events/{id}.json`, `/venues/{id}.json` and `/classifications.json`.

## 2. Target architecture

```
Ticketmaster ──cron */10──▶ Hub Worker (16oc-events-deploy/worker)
                             │ per-site profile: venueIds, promoterIds, source rules,
                             │ exclusions → raw TM event objects
                             ▼
                        KV snapshot  (site:{id}:events, venues, classifications, meta)
                             │
     ┌───────────────────────┼─────────────────────────────┬─────────────────────┐
     ▼                       ▼                             ▼                     ▼
/v1/{site}/events.json   /v1/{site}/events/{id}.json   /aloompa/{events,       /health
(TM-compatible subset,   /venues/{id}.json             performers,places}.json  (last sync,
 served from snapshot)   /classifications.json         (Phase 3)                counts)
```

**Key decision: the hub serves TM-shaped responses from the snapshot.** The widget then needs only `proxyUrl: 'https://<hub>/v1/<site>'`, with no change to how it renders. Filtering (`keyword`, `classificationName`, `startDateTime`/`endDateTime`, `venueId`), `sort=date,asc` and `page`/`size` run against the snapshot inside the Worker. Promoter-ID merges happen in the profile, so the loader sets `promoterId: null` to avoid a second, duplicate fetch.

**Rules move to one place:** `worker/src/sites.js` holds the per-site profiles, and `worker/src/rules.json` holds excluded events and artists. During the transition the loader's `window.*_EXCLUDE_EVENTS` keeps working (union of both lists). After cutover, it's removed.

**Freshness:** cron every 10 min, plus the widget's `cacheDuration.events` lowered to 15 min. Worst-case staleness is ~25 min, compared with up to 60 min per browser today. TM usage stays flat regardless of site traffic.

## 3. Phases

### Phase 0 — Baseline & safety net (no production change)
1. Commit `bundle/`, `scripts/`, `test/` and the 2026-08-11 live snapshot. Add the **live** legacy widget as `legacy/event-feed-widget.live-2026-10-30.js` (API keys redacted) and the live `recently-announced-widget.js`.
2. Write the parity baseline, `scripts/capture-baseline.js`. For each touchpoint it runs the live legacy query rules against TM and records the set of event IDs shown → `test/fixtures/baseline/{site}.json`. This becomes the acceptance test for every cutover.
3. Check whether TM list responses include `description`, or whether the cron must call `/events/{id}.json` per event. If it must, fetch details only for events that are new or changed (by hash).
4. 16OC decisions: is Promontory still in scope, does the Aloompa app cover Salt Shed only, and who signs off on the visual change for each site.

### Phase 1 — Hub core (shadow mode)
- Cron snapshot with per-site profiles that reproduce the Phase 0 rules exactly. TM-compatible endpoints. `/health`. Keys held as Worker secrets.
- Deploy to a custom domain (e.g. `events.16oncenterchicago.com`), not `workers.dev`, so the URL can't break or change later.
- **Shadow check:** a daily job diffs the hub's event IDs per site against a fresh run of the baseline query. Move to Phase 2 only after 3 consecutive clean days.

### Phase 2 — Salt Shed cutover
1. In `bundle/salt-shed/03-bootstrap.js`: set `proxyUrl` to `<hub>/v1/saltshed`, remove the `apiKey` requirement, set `promoterId: null`, set `cacheDuration.events: 900000`, and ship the pending `excludeEvents` feature at the same time.
2. Upload as `/s/salt-shed-hub.js` and load it on an **unlisted Squarespace test page**. Verify: event set equals the baseline; search, genre, date and venue filters work; the modal (doors, pleaseNote, age) renders; GTM `ticket_click` fires; no requests go to `app.ticketmaster.com` (DevTools).
3. Swap the `/home` script tag to the new file. Remove `SALTSHED_API_KEY` from Code Injection.
4. **Rollback:** point the script tag back at `/s/salt-shed.js`, which stays uploaded for 30 days. Recovery takes about one minute.
5. Hosting decision: keep uploading bundles to Squarespace, or serve them from the hub at a stable versioned URL so future releases need no Squarespace edits. Recommendation: serve from the hub at `<hub>/assets/salt-shed.js`, so every site ends up with one stable `<script>` tag.

### Phase 3 — Aloompa feed (can run in parallel with Phase 4)
`/aloompa/*` endpoints formatted from the same snapshot, following the Aloompa Third-Party Feed Guide exactly, with the site scope set in Phase 0. A change-hash produces `updated_at`. Removed or cancelled events stay in the feed with `is_published: false` for 30 days. Aloompa first imports into an unpublished/staging state.

### Phase 4 — Legacy sites, lowest risk first
For each site: a theme CSS + loader (Salt Shed pattern), an unlisted test page, a visual sign-off from 16OC, a parity check against the baseline, the swap, and the legacy file left in place for 30 days as rollback.

| Order | Site | Mounts → new widget | Profile notes |
|---|---|---|---|
| 1 | Empty Bottle `/home` | grid → `data-venue-events` | 13 venue IDs + promoter 6084 merge |
| 2 | Thalia `/home` | grid + recently-announced → `data-venue-events` + `data-ve-curated data-option="recently-added"` | `source=ticketweb` only |
| 3 | Space `/all-shows`, `/cahn` | grid + recently-announced; Cahn as a separate profile | `KovZpakJQe,KovZ917At8O` + promoter 6085 merge; Cahn `KovZ917At8O` |
| 4 | 16oncenterchicago.com `/` | `all` aggregator → grid with venue filter across all properties | profile = union of the site profiles; venue filter options from the snapshot |
| 5 | Promontory | only if still in scope | `rZ7HnEZ178Zp4` |

Reaching parity in the new widget: per-site short names, and the "presents" variants, which formerly used the dead `static2.16oncenterchicago.com` Eventbrite feeds (confirm they're unused). This is a **visual redesign** for the four legacy sites, so theming effort and client sign-off are the main schedule risks, not data.

### Phase 5 — Cleanup
- Rotate **every** TM key that was exposed in page source. Only the Worker holds keys after that.
- Delete the legacy files from Squarespace after 30 days without a rollback. Remove `event-feed-widget-original.js` references and the `<YOUR_SUBDOMAIN>` snippets.
- Alerts: cron failure, event count drops more than 30% for any site, `/health` stale for over 30 min.
- Fold `docs/superpowers/specs/2026-05-23-exclude-ticketweb-events-design.md` into the hub rules as `excludeProviders` on the profile, so it no longer needs a widget change.

## 3a. Phase 0 results (2026-10-30)
- Salt Shed bundle source is committed. The local build matches the live `/s/salt-shed.js`, plus the not-yet-deployed `excludeEvents`.
- The live old-widget files are archived in `legacy/` with API keys redacted.
- Baseline captured in `test/fixtures/baseline/` (`npm run baseline`). Events shown per touchpoint: Salt Shed 43, Thalia 66, Empty Bottle 72, Space 104, Cahn 6, 16OC all-venues 296. Thalia and Space also have 4 "recently announced" each. No query was cut off by paging.
- **Descriptions:** `description` is absent from both list and detail responses. `info`, `pleaseNote`, `doorsTimes` and `ageRestrictions` all come in the list response, so the cron does not need per-event detail calls. Andy's 2023 constraint no longer applies.
- **Cancelled shows:** TicketWeb sends `cancelled` and Ticketmaster sends `canceled`. The old widget hides only the TicketWeb spelling. The hub should hide both, as a deliberate and visible change from today's behavior.
- **Still open:** Promontory scope, Aloompa app scope, hosting decision.

## 4. Risks
- **Parity drift.** Undocumented legacy rules (for example, the cancelled filter only catches TicketWeb's spelling) silently change which shows appear. Mitigation: Phase 0 baseline + Phase 1 shadow diff.
- **Single point of failure.** If the hub goes down, every site's events go blank. Mitigations: Cloudflare edge plus the last good KV snapshot (endpoints never call TM live), and the widget keeps its localStorage cache. A loader fallback to direct TM is possible but would keep keys public, so it isn't recommended.
- **Ticketmaster terms:** "may rate limit or block applications that make a large number of calls" not driven by users. The cron's call volume is lower than today's per-visitor traffic.
- **Squarespace edits are manual.** Each cutover is one script-tag change by whoever holds the Squarespace logins. Schedule those edits with 16OC.

## 5. Rough timeline
Phase 0: 2–3 days · Phase 1: 4–5 days + 3-day shadow · Phase 2: 1–2 days · Phase 3: 3–4 days · Phase 4: ~2–3 days per site plus sign-off · Phase 5: 1 day.
Salt Shed is on the hub in about 2–2.5 weeks. All sites take about 5–6 weeks, mostly waiting on design sign-offs.

## 6. Next step
After this design is approved, write the implementation plan for **Phases 0–2** (`docs/superpowers/plans/2026-10-30-16oc-hub-phase-0-2.md`). Phases 3–5 get their own plans once Salt Shed is stable on the hub.
