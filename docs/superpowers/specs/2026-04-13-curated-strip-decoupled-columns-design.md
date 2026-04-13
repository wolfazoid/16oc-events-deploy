# Curated Strip: Decoupled Total vs Visible Columns

## Goal

Allow the curated strip to render more events than are visible at once, with the overflow reachable via the existing swiper (arrows, dots, swipe/scroll-snap). Concretely: render 5 cards, show 3 on desktop, step down to 2 then 1 at existing breakpoints.

## Motivation

Today `data-count` on `[data-ve-curated]` controls both the number of cards rendered *and* the number of cards visible per row (via the `--ve-curated-columns` CSS custom property). This couples two concerns that the product now needs to separate: the editorial set (how many featured events exist) vs the layout (how many fit the viewport).

The carousel infrastructure already exists — flex track with `scroll-snap`, prev/next arrows, dot indicators, and an `updateIndicators` handler that hides arrows/dots when there is no overflow. Responsive step-down (3 → 2 → 1 visible) is already in place via media queries at 768px and 640px. Only the coupling needs to be removed and the dot count needs to track actual pages.

## Scope

Two repositories are touched:

- **`ticketmaster-events-widget`** — widget source, published to npm and loaded from CDN. Houses the `EventCurated` class and curated-strip CSS.
- **`16oc-events-deploy`** — this repo, the loader. `venues/salt-shed.js` sets defaults on `[data-ve-curated]` elements and pins the widget CDN version.

Out of scope: changes to `EventFeatured`, `EventGrid`, or the main `[data-venue-events]` selector; changes to theming; changes to the API.

## Design

### 1. New `data-columns` attribute on `[data-ve-curated]`

A new optional data attribute, `data-columns`, controls how many cards are visible per row. It is read in `EventCurated.parseOptions()`:

```js
columns: parseInt(dataset.columns, 10) || parseInt(dataset.count, 10) || 4
```

If `data-columns` is omitted, it falls back to `data-count`, which preserves current behavior for any consumer that has not opted in.

The attribute name matches the existing `data-columns` already used on `[data-venue-events]`, keeping the public API consistent across curated and grid components.

### 2. Track CSS variable reads from `columns`, not `count`

In `EventCurated.render()`:

```js
track.style.setProperty("--ve-curated-columns", this.options.columns);
```

(was: `this.options.count`)

No other CSS changes are needed. The existing flex-basis formula already uses this custom property:

```css
.ve-curated__track > .ve-events__card {
  flex: 0 0 calc((100% - var(--ve-spacing-md) * (var(--ve-curated-columns, 3) - 1)) / var(--ve-curated-columns, 3));
}
```

The existing `@media (max-width: 768px)` and `@media (max-width: 640px)` rules override this flex rule directly for 2-visible and 1-visible layouts, so the CSS variable value on wider viewports is what changes.

### 3. Dot indicators reflect reachable pages, not total cards

Today the widget renders one dot per card. With 5 cards and 3 visible, dots 4 and 5 are unreachable: the track hits its scroll-end before those cards can become the leftmost card.

Fix: render `max(1, totalCards − visibleNow + 1)` dots, where `visibleNow` is derived from the live layout so it adapts to breakpoints.

**Computing `visibleNow`**

```js
function computeVisible() {
  const card = track.querySelector(".ve-events__card");
  if (!card) return 1;
  const cardW = card.offsetWidth + parseFloat(getComputedStyle(track).gap || 0);
  return Math.max(1, Math.round(track.clientWidth / cardW));
}
```

**Rendering dots**

Extract current dot-building logic into a `renderDots()` function. Called on initial render and whenever the track resizes:

```js
function renderDots() {
  const visible = computeVisible();
  const pages = Math.max(1, events.length - visible + 1);
  dotsEl.innerHTML = "";
  dots.length = 0;
  for (let i = 0; i < pages; i++) {
    const dot = utils.createElement("button", {
      className: "ve-curated__dot",
      type: "button",
      "aria-label": `Go to slide ${i + 1}`,
    });
    dot.addEventListener("click", () => {
      const cards = track.querySelectorAll(".ve-events__card");
      if (cards[i]) cards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    });
    dots.push(dot);
    dotsEl.appendChild(dot);
  }
  updateIndicators();
}
```

**ResizeObserver**

Attach a `ResizeObserver` to `track` so dots recompute when the viewport crosses a breakpoint:

```js
const ro = new ResizeObserver(renderDots);
ro.observe(track);
```

**Active-dot clamping in `updateIndicators`**

The existing "leftmost card" logic still applies, but the active index must be clamped to the new dot range:

```js
const activeIdx = Math.min(leftmostCardIdx, dots.length - 1);
dots.forEach((d, i) => d.classList.toggle("ve-curated__dot--active", i === activeIdx));
```

### 4. Destroy cleanup

`EventCurated.destroy()` clears `this.element.innerHTML`, which removes the track. Disconnect the `ResizeObserver` in `destroy()` to avoid a leaked observer reference:

```js
destroy() {
  hideEventModal(this.element);
  if (this._ro) { this._ro.disconnect(); this._ro = null; }
  this.element.innerHTML = "";
  this.element.classList.remove("ve-curated");
}
```

(Store the observer on `this._ro` in `render()`.)

### 5. Loader defaults — `venues/salt-shed.js`

In the `data-ve-curated` defaults block:

```js
if (!el.dataset.count) el.dataset.count = '5';      // was '3'
if (!el.dataset.columns) el.dataset.columns = '3';  // new
```

Bump `VERSION` to the new widget release once published.

## Resulting behavior across breakpoints

Given `data-count="5" data-columns="3"`:

| Viewport | Visible cards | Dot count | Arrows |
|---|---|---|---|
| > 768px | 3 | 3 | shown |
| 641–768px | 2 | 4 | hidden (existing CSS) |
| ≤ 640px | 1 | 5 | hidden (existing CSS) |

## Backwards compatibility

Any existing page that sets only `data-count` (no `data-columns`) gets today's behavior: `columns` defaults to `count`, so rendered count equals visible columns, the track does not overflow, and `updateIndicators` hides arrows/dots. No existing site is affected until its loader opts in.

## Testing plan

- **Desktop (> 768px)**: 5 cards render, 3 visible, prev/next arrows visible, 3 dots render. Click next → track scrolls one card; at end, next-arrow hides. Click dot 1 → track returns to start.
- **Tablet (641–768px)**: 2 cards visible, 4 dots, arrows hidden, horizontal swipe/scroll works.
- **Mobile (≤ 640px)**: 1 card visible, 5 dots, horizontal swipe works.
- **Resize across breakpoints**: dot count recomputes within one animation frame; no console errors; active dot remains valid.
- **Back-compat regression**: a page configured with only `data-count="3"` renders exactly as before — 3 cards, no overflow, arrows and dots hidden.
- **Destroy**: re-initializing (or removing) a curated element disconnects its `ResizeObserver` (verified via devtools memory snapshot or simple instrumentation).

## Release sequence

1. Merge and publish widget change (`ticketmaster-events-widget`) as a new minor or patch version.
2. Update loader `VERSION` in `venues/salt-shed.js` to the published version and commit in `16oc-events-deploy`.
3. Verify on the live Salt Shed site that the curated strip shows 5 cards / 3 visible / 3 dots.
