# 16OC Events — Project Status

**Last updated:** 2026-11-08 · **Start here when picking this work back up.**

The goal: one event hub (the Cloudflare Worker in `worker/`) that every 16OC event touchpoint reads from, in place of browsers calling Ticketmaster directly with public API keys. It also feeds the Salt Shed mobile app (Aloompa) so staff stop entering shows by hand.

- Design, phases, decisions: [`superpowers/specs/2026-10-30-16oc-event-hub-transition-design.md`](superpowers/specs/2026-10-30-16oc-event-hub-transition-design.md)
- Phase 1 plan (done): [`superpowers/plans/2026-10-30-16oc-hub-phase-1.md`](superpowers/plans/2026-10-30-16oc-hub-phase-1.md)
- How the hub works, plus deploy steps: [README → Event hub](../README.md#event-hub-worker)

## Where things stand

| Phase | State |
|---|---|
| 0: Baseline and safety net | ✅ Done. Bundle source in git, live widgets archived in `legacy/`, per-site baseline in `test/fixtures/baseline/` |
| 1: Hub core (shadow mode) | ✅ Built and merged. 82 tests. A local run against live Ticketmaster data matched every site exactly. **Not deployed** (see Blockers) |
| 1, Task 8: Deploy and run the 3-day shadow diff | ⏸ Blocked on 16OC Cloudflare access |
| 2: Salt Shed cutover and hub-served bundles | Not started. Needs its own plan |
| 3: Aloompa feed (`/aloompa/*`) | Not started. Can be built before deploy |
| 4: Legacy sites onto the new widget and the hub | Not started |
| 5: Cleanup (rotate exposed keys, delete legacy files, alerts) | Not started |

## Blockers

1. **Cloudflare (needed for Task 8):** an account owned by 16OC with Wolf as a member, the `events.16oncenterchicago.com` subdomain, and 16OC's Ticketmaster API keys to store as Worker secrets.
   - The hub is designed to run in their account so they keep control of it. See the hosting decision in the spec, §3a.
   - Fallback: run the shadow deploy in Wolf's account on a `workers.dev` URL, then move it to 16OC's account before cutover. Moving means creating the KV namespace, setting the secrets and redeploying.
2. **Workers plan:**
   - **Aloompa feed only** (one site, hourly): fits the Workers **free** plan easily, at about 48 KV writes a day against roughly 1,000 allowed, with a small payload.
   - **All five websites on the hub** at a 10-minute refresh: needs **Workers Paid**. That's about 1,700 KV writes a day, and parsing the large `sixteenoc` snapshot exceeds the free plan's 10 ms CPU limit.
   - These are Cloudflare's published free-plan limits as of 2026-11. Re-check before deciding.
3. **Aloompa scoping:** the feed must follow Aloompa's Third-Party Feed Guide exactly. Open technical questions for them are listed below.

## Open PRs

| Repo / PR | What | Waiting on |
|---|---|---|
| this repo #3 | Pages loader passes `SALTSHED_EXCLUDE_EVENTS`, pins widget 1.3.21 | Widget **1.3.21 published to npm**, which is still at 1.3.20. Merging before that breaks the hosted loader (jsDelivr 404) |
| this repo #4 (draft) | Presale email signup in the modal | 16OC confirming they want it, plus the Hive form URL. Conflicts with `main`. Loader-only, so it would need porting into `bundle/salt-shed/` to go live |

The widget repo `ticketmaster-events-widget` has `excludeEvents` (v1.3.21) merged to `main` but not yet published.

## Next steps, in order

1. Get Cloudflare access (Blocker 1), or start the shadow deploy in Wolf's account.
2. **Task 8:** create the KV namespace, set the secrets, deploy, trigger `POST /admin/refresh`, then run `npm run shadow` daily for 3 days. Steps are in the Phase 1 plan, Task 8. Also check in production that a repeated venues request returns `X-Cache: HIT`.
3. **Phase 3, Aloompa feed:** `/aloompa/events|performers|places` built from the `saltshed` snapshot, following the Aloompa guide (field mapping is in the spec). Can be built and tested locally now.
4. **Phase 2 plan**, including the carry-forward items:
   - a timeout on the pass-through fetch
   - validation of the classifications `size`/`page` params
   - a per-isolate snapshot cache if CPU is high
   - a per-site **manual events** list for shows Ticketmaster doesn't publish (see Findings)
   - serving bundles at `/sites/{site}.js` with per-site version pins
5. Publish widget 1.3.21 and merge PR #3.
6. **Before Phase 4:** handle `venueId` vs promoter-merged events (spec §3b), and add a **Three Top Lounge** profile and baseline (see Touchpoints).

## Touchpoints

| Site | Page(s) | Code today | Hub profile |
|---|---|---|---|
| saltshedchicago.com | `/home` | New widget, a self-contained bundle uploaded to Squarespace (`/s/salt-shed.js`, source `bundle/salt-shed/`) | `saltshed` |
| thaliahallchicago.com | `/home` | Legacy `/s/event-feed-widget.js` (`.thalia`) plus `recently-announced-widget.js` | `thalia` |
| emptybottle.com | `/home` | Legacy (`.empty-bottle`) | `emptybottle` |
| evanstonspace.com | `/all-shows`, `/cahn` | Legacy (`.space`, `.cahn`) plus recently-announced | `space`, `cahn` |
| 16oncenterchicago.com | `/` | Legacy, own variant (`.all`) | `sixteenoc` |
| threetoploungechicago.com | `/home` | Legacy, **own variant** (`.three-top`, plus a `#widget-coming-up` mount), venue `rZ7HnEZ17_Skd` only. Archived in `legacy/` | **none yet**: add before Phase 4 |
| Aloompa app | — | Manual entry | will use `saltshed` |

Promontory is out of scope. Its site is offline and the legacy branch for it is commented out.

The legacy widget exists as **three variants**:
1. Thalia, Empty Bottle and Space share one file.
2. 16oncenterchicago.com has a one-line edit.
3. Three Top Lounge has a larger divergence.

All are newer than `event-feed-widget-original.js`. The live files are the reference for behavior. The current copies are in `legacy/`.

## How to run things

```bash
npm test                         # all tests (CJS + hub .mjs)
npm run build:salt-shed          # rebuild sites/salt-shed.js from bundle/salt-shed/
TM_API_KEY=... npm run baseline  # re-capture what each live site shows → test/fixtures/baseline/
HUB_URL=... TM_API_KEY=... npm run shadow   # diff hub vs live widget rules; exit 1 on unexplained differences
```

To run the hub locally against live Ticketmaster data:

```bash
# .dev.vars is gitignored. Never commit keys.
printf 'TM_KEY_SALTSHED=...\nTM_KEY_THALIA=...\nTM_KEY_EMPTYBOTTLE=...\nTM_KEY_SPACE=...\nTM_KEY_DEFAULT=...\nADMIN_TOKEN=localtest\n' > .dev.vars
npx wrangler dev --local --port 8787
curl -X POST -H "Authorization: Bearer localtest" http://localhost:8787/admin/refresh
HUB_URL=http://localhost:8787 TM_API_KEY=... npm run shadow
```

Last local result (2026-10-30), with all six profiles exact matches and 0 unexpected:

| saltshed | thalia | emptybottle | space | cahn | sixteenoc |
|---|---|---|---|---|---|
| 43 | 66 | 72 | 104 | 6 | 296 |

## Findings worth knowing

- **Descriptions:** Ticketmaster returns no `description` field. `info`, `pleaseNote`, `doorsTimes` and `ageRestrictions` all come in the list response, so the hub never needs per-event detail calls.
- **Cancelled spellings:** TicketWeb uses `cancelled` and Ticketmaster uses `canceled`. The legacy widget hides only the TicketWeb spelling. The hub hides both, which is a deliberate and visible change.
- **Events missing from the Discovery API:** an event can be live on ticketmaster.com by direct link and still be missing from the Discovery API entirely, under every key, source, locale and venue. This is a visibility or distribution setting on Ticketmaster's side, not something our code can fix. The venue's Ticketmaster rep has to make the event public or searchable. Until then the only workaround is manual entry, and later the hub's manual-events list.
- **Production has drifted ahead of git before**, twice: the Salt Shed bundle, and the legacy widgets. Before changing any site, diff against the live file.
- The Discovery API caps results at 1,000 per query (`size*page < 1000`). `sixteenoc` is at about 300, and `/health` reports `capped` if a site hits the cap.

## Open questions for Aloompa

1. Timezone for `start_time`/`end_time`: venue-local, UTC, or with an offset? Their samples disagree.
2. How records are keyed and updated. Does `updated_at` drive updates, and what happens to records that disappear from the feed?
3. Can a feed-sourced record be edited in their CMS without being overwritten on the next pull?
4. Images: Ticketmaster supplies 16:9, their spec is 1280×800. Is cropping acceptable?
5. Endpoint auth, and pagination size limits.
6. Required vs recommended fields. The color legend in their PDF doesn't come through as text.
