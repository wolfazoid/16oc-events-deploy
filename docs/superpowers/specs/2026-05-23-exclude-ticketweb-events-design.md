# Exclude TicketWeb Events: Loader-Side Staging

## Goal

The Salt Shed client wants events sold via TicketWeb (Live Nation's secondary platform) hidden from the widget on every surface — main grid, featured hero, and curated strip. This spec covers only the loader side. It stages the activation so that once the widget gains a real exclusion option, turning it on in Salt Shed is a one-line uncomment plus a `VERSION` bump.

## Motivation

Events flow through the Ticketmaster Discovery API, but a subset of them are actually sold via TicketWeb. These show up in API results with `ticketweb.com` URLs (the widget already detects this for image fallback handling). The client does not consider those events "their" events for the purpose of the venue site.

The clean fix is a widget-level exclusion option: the widget already knows what a TicketWeb event looks like and already iterates the event list, so adding a "skip these" filter is natural there. That work lives in the sibling `ticketmaster-venue-widget` repo and is driven separately. This repo's responsibility is to be ready to consume that option the moment it ships.

## Scope

In scope:

- A single staged change in `venues/salt-shed.js`: a commented-out option inside the `VenueEvents.init({...})` call, with a TODO that describes the missing widget capability and the steps to activate it.

Out of scope:

- Any change to the widget repo.
- Bumping `VERSION` in the loader.
- Any client-side DOM filtering, MutationObserver, or Cloudflare Worker rewiring.
- Any change to behavior shipping today — this PR ships no user-visible change.

## Design

### Staged option in `VenueEvents.init({...})`

Add the following lines to the `init` call in `venues/salt-shed.js`, placed inside the options object (location below `tracking` is suggested for readability, but any in-object location is fine):

```javascript
// TODO(ticketweb-exclude): client wants TicketWeb-hosted events hidden on
// every surface (grid, featured, curated). The widget does not yet expose
// an exclusion option. When ticketmaster-venue-widget ships this, bump
// VERSION above and uncomment the line below. The final option name is
// owned by the widget repo — confirm it matches before uncommenting.
// excludeProviders: ['ticketweb'],
```

The proposed name `excludeProviders: ['ticketweb']` is a placeholder. A list-shaped option is forward-compatible if other resellers ever need the same treatment, but the widget repo owns the final naming. The TODO wording calls this out explicitly so that whoever activates the flag verifies the name against the widget release notes first.

### Why a commented stub instead of just a comment

A bare TODO without a code stub is also valid, but a commented option line:

- Makes the activation a single-character edit (delete the leading `//`).
- Documents the expected shape, not just the intent.
- Surfaces during code search (`grep excludeProviders`) once the widget feature is reviewed and named.

### Why no behavior change today

Until the widget supports an exclusion option, the only ways to filter from the loader are:

1. A post-render DOM observer that removes ticketweb cards. Cards would flash in then disappear, counts and pagination would drift, and the same logic would need to run for featured + curated + grid mounts. Rejected during brainstorming.
2. Routing through the Cloudflare Worker proxy and dropping ticketweb events server-side. The worker is built but not in the Salt Shed loader path; wiring it up is a much larger change than the user wants right now. Rejected during brainstorming.

Doing nothing visible today and staging the activation is the explicit choice.

## Resulting behavior

No user-visible change. The Salt Shed site continues to render TicketWeb events as it does today until the widget feature ships and the loader is activated.

## Testing plan

- **Static check**: `node --check venues/salt-shed.js` (or equivalent) passes — comments and unmodified `init` call do not break parsing.
- **Live site spot-check**: after deploy, confirm the page renders unchanged (no regressions from adding a comment block).

## Release sequence

1. Land this loader-only change (just the staged comment).
2. Widget work happens separately in `ticketmaster-venue-widget`. When that release ships:
   - Confirm the option name the widget chose; update the TODO if it differs from `excludeProviders`.
   - Bump `VERSION` in `venues/salt-shed.js` to the new widget release.
   - Uncomment the `excludeProviders: [...]` line.
   - Commit, push, verify the live Salt Shed site hides TicketWeb events on grid, featured, and curated.
