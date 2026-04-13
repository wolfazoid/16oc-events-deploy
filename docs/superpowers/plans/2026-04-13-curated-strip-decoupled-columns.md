# Curated Strip: Decoupled Columns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `data-count` (total rendered) from a new `data-columns` (visible per row) on the curated strip, and update dot indicators to reflect reachable pages instead of total cards.

**Architecture:** The curated strip already renders as a horizontal flex track with scroll-snap, prev/next arrows, and dot indicators. Today the track's `--ve-curated-columns` CSS variable is set to `data-count`, coupling total and visible. This plan adds a separate `columns` option, reads `--ve-curated-columns` from it, and replaces the per-card dot model with a per-page dot model that recomputes on resize via `ResizeObserver`.

**Tech Stack:** Vanilla JS widget (`ticketmaster-events-widget` npm package) loaded from CDN by `16oc-events-deploy/venues/salt-shed.js`. Build via `npm run build` (terser + cssnano). Verification via `test.html` in a browser (`npm run serve` → `http://localhost:8080/test.html`). No unit-test framework; manual browser testing is the project convention.

**Spec:** `docs/superpowers/specs/2026-04-13-curated-strip-decoupled-columns-design.md`

**Two repos touched:**
- **Widget:** `/Users/wolf/workspace/github.com/wolfazoid/ticketmaster-events-widget` — Phase A (Tasks 1–8)
- **Loader:** `/Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy` — Phase B (Tasks 9–11)

---

## Phase A — Widget changes (`ticketmaster-events-widget`)

### Task 1: Add `columns` option and use it for track CSS var

**Files:**
- Modify: `src/index.js` (EventCurated class, around lines 2156–2168 and 2227–2228)

- [ ] **Step 1: Open the widget repo and confirm location**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/ticketmaster-events-widget
git status
```

Expected: a clean working tree on whichever branch the user is developing on.

- [ ] **Step 2: Add `columns` to `parseOptions()` return object**

Find this block in `src/index.js` inside `class EventCurated { parseOptions() { ... } }`:

```js
      return {
        label: dataset.label || "Featured Events",
        heading: dataset.heading || "p",
        option: dataset.option || "upcoming",
        ids: dataset.ids
          ? dataset.ids.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        count: parseInt(dataset.count, 10) || 4,
        showVenueLabel: dataset.showVenueLabel !== "false",
        venueShortNames,
        showGenre: dataset.showGenre === "true",
        showPrice: dataset.showPrice !== "false",
      };
```

Replace with:

```js
      const count = parseInt(dataset.count, 10) || 4;
      return {
        label: dataset.label || "Featured Events",
        heading: dataset.heading || "p",
        option: dataset.option || "upcoming",
        ids: dataset.ids
          ? dataset.ids.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        count,
        columns: parseInt(dataset.columns, 10) || count,
        showVenueLabel: dataset.showVenueLabel !== "false",
        venueShortNames,
        showGenre: dataset.showGenre === "true",
        showPrice: dataset.showPrice !== "false",
      };
```

- [ ] **Step 3: Change the track CSS var to read `columns`**

Find this line in `EventCurated.render()` (around line 2228):

```js
      track.style.setProperty("--ve-curated-columns", this.options.count);
```

Replace with:

```js
      track.style.setProperty("--ve-curated-columns", this.options.columns);
```

- [ ] **Step 4: Build**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/ticketmaster-events-widget
npm run build
```

Expected: build completes with no errors; `dist/ticketmaster-venue-widget.min.js` updates.

- [ ] **Step 5: Commit**

```bash
git add src/index.js dist/
git commit -m "feat(curated): add data-columns option decoupled from data-count"
```

---

### Task 2: Refactor dot rendering into `renderDots()` with page-aware count

**Files:**
- Modify: `src/index.js` (EventCurated.render, around lines 2259–2315)

- [ ] **Step 1: Replace the dot-rendering block with a `renderDots()` function**

Find this block in `EventCurated.render()`:

```js
      // Dot indicators
      const dotsEl = utils.createElement("div", { className: "ve-curated__dots" });
      const dots = [];
      events.forEach((_, i) => {
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
      });
```

Replace with:

```js
      // Dot indicators (page-aware: dots = total - visible + 1)
      const dotsEl = utils.createElement("div", { className: "ve-curated__dots" });
      const dots = [];

      const computeVisible = () => {
        const card = track.querySelector(".ve-events__card");
        if (!card || !track.clientWidth) return events.length;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardW = card.offsetWidth + gap;
        if (cardW <= 0) return events.length;
        return Math.max(1, Math.min(events.length, Math.round(track.clientWidth / cardW)));
      };

      const renderDots = () => {
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
      };
```

- [ ] **Step 2: Call `renderDots()` before `updateIndicators` is first defined**

The current code defines `updateIndicators` immediately after the dot loop. Leave `updateIndicators` where it is but call `renderDots()` just before it. Find this (immediately after the block you replaced):

```js
      const updateIndicators = () => {
```

Insert just above it:

```js
      renderDots();

      const updateIndicators = () => {
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/index.js dist/
git commit -m "refactor(curated): compute dots from visible-page count"
```

---

### Task 3: Attach `ResizeObserver` and clean up in `destroy()`

**Files:**
- Modify: `src/index.js` (EventCurated.render and EventCurated.destroy)

- [ ] **Step 1: Attach a `ResizeObserver` after initial render**

Find the final lines of `EventCurated.render()`:

```js
      slider.appendChild(prevBtn);
      slider.appendChild(track);
      slider.appendChild(nextBtn);
      slider.appendChild(dotsEl);
      this.element.appendChild(slider);

      // Initial state after layout
      requestAnimationFrame(updateIndicators);
    }
```

Replace with:

```js
      slider.appendChild(prevBtn);
      slider.appendChild(track);
      slider.appendChild(nextBtn);
      slider.appendChild(dotsEl);
      this.element.appendChild(slider);

      // Recompute dots + indicators when the track resizes (breakpoint changes)
      this._ro = new ResizeObserver(() => {
        renderDots();
        updateIndicators();
      });
      this._ro.observe(track);

      // Initial state after layout
      requestAnimationFrame(updateIndicators);
    }
```

- [ ] **Step 2: Disconnect the observer in `destroy()`**

Find the existing `destroy()` method:

```js
    destroy() {
      hideEventModal(this.element);
      this.element.innerHTML = "";
      this.element.classList.remove("ve-curated");
    }
```

Replace with:

```js
    destroy() {
      hideEventModal(this.element);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      this.element.innerHTML = "";
      this.element.classList.remove("ve-curated");
    }
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/index.js dist/
git commit -m "feat(curated): recompute dots on resize via ResizeObserver"
```

---

### Task 4: Clamp active dot index in `updateIndicators`

**Files:**
- Modify: `src/index.js` (EventCurated.render — updateIndicators function)

- [ ] **Step 1: Clamp `activeIdx` to the current dot range**

Find this block inside `updateIndicators`:

```js
        // Find the card closest to the left edge
        const cards = track.querySelectorAll(".ve-events__card");
        let activeIdx = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
          if (dist < minDist) { minDist = dist; activeIdx = i; }
        });
        dots.forEach((d, i) => d.classList.toggle("ve-curated__dot--active", i === activeIdx));
```

Replace with:

```js
        // Find the card closest to the left edge
        const cards = track.querySelectorAll(".ve-events__card");
        let activeIdx = 0;
        let minDist = Infinity;
        cards.forEach((card, i) => {
          const dist = Math.abs(card.getBoundingClientRect().left - track.getBoundingClientRect().left);
          if (dist < minDist) { minDist = dist; activeIdx = i; }
        });
        // Clamp to current dot range (dots = pages, not total cards)
        if (dots.length > 0) activeIdx = Math.min(activeIdx, dots.length - 1);
        dots.forEach((d, i) => d.classList.toggle("ve-curated__dot--active", i === activeIdx));
```

- [ ] **Step 2: Build**

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/index.js dist/
git commit -m "fix(curated): clamp active dot index to page range"
```

---

### Task 5: Add curated-strip coverage to `test.html`

**Files:**
- Modify: `test.html`

Context: the curated strip is not currently demonstrated in `test.html`. CLAUDE.md requires test.html coverage for every configurable feature. Add a minimal section that exercises `data-count="5" data-columns="3"`.

- [ ] **Step 1: Inspect current test.html structure**

```bash
grep -n "<h2\|data-ve-featured\|data-venue-events" /Users/wolf/workspace/github.com/wolfazoid/ticketmaster-events-widget/test.html | head -20
```

Identify a logical spot to insert a new curated section (typically after the featured section or before the grid).

- [ ] **Step 2: Add curated strip section to `test.html`**

Insert this block in `test.html` at the identified location (before the closing `</body>` of the relevant demo section, using the existing `VENUE_ID` placeholder convention already present in the file):

```html
<h2>Test: Curated strip (5 rendered, 3 visible)</h2>
<p>Expected: 5 cards rendered, 3 visible on desktop, prev/next arrows + 3 dots. Resize the window: 2 visible / 4 dots at ≤768px, 1 visible / 5 dots at ≤640px.</p>
<div
  data-ve-curated
  data-venue-id="VENUE_ID"
  data-count="5"
  data-columns="3"
  data-label="Featured Events">
</div>
```

(If `test.html` uses a different venue-id attribute name or injection pattern, match the surrounding examples in the file rather than this literal snippet.)

- [ ] **Step 3: Run the local server and verify in a browser**

```bash
npm run serve
```

Open `http://localhost:8080/test.html`. Confirm:
- 5 cards render in the curated section
- 3 are visible at viewport width > 768px
- Prev/next arrows and 3 dots appear
- Resize to 700px wide → 2 visible, 4 dots, arrows hidden
- Resize to 500px wide → 1 visible, 5 dots

Stop the server with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add test.html
git commit -m "test(curated): add coverage for data-columns in test.html"
```

---

### Task 6: Document `data-columns` on the curated strip in README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a curated-strip section or row documenting `data-columns`**

Open `README.md`. Locate the existing data-attribute reference table (the same one that documents `data-columns` for `[data-venue-events]` at line 180). Either add a new row in that table or a new table under a "Curated strip" heading. Use the existing table style. Add rows for the curated strip's relevant attributes:

```markdown
### Curated strip — `[data-ve-curated]`

| Attribute | Default | Notes |
|---|---|---|
| `data-count` | `4` | Total events rendered on the carousel track |
| `data-columns` | `data-count` | Cards visible per row on wide viewports; CSS steps down to 2 at ≤768px and 1 at ≤640px |
| `data-label` | `"Featured Events"` | Heading text |
| `data-heading` | `"p"` | Heading tag (`h2`, `h3`, etc.) |
| `data-option` | `"upcoming"` | `"upcoming"` or `"recently-added"` |
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: document data-columns on curated strip"
```

---

### Task 7: Manual browser verification across breakpoints

**Files:** (verification only)

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/ticketmaster-events-widget
npm run serve
```

- [ ] **Step 2: Open `test.html` and verify desktop behavior**

Open `http://localhost:8080/test.html` at viewport width > 768px.
Confirm on the curated test section:
- 5 cards render
- 3 cards visible
- Prev arrow hidden at start, next arrow visible
- 3 dots; first dot active
- Click next arrow → track scrolls by one card, first dot deactivates, second activates
- Click next again → third dot active, next arrow hides (at end)
- Click first dot → track returns to start

- [ ] **Step 3: Verify tablet breakpoint (≤ 768px)**

Resize window to ~700px wide. Confirm:
- 2 cards visible
- 4 dots appear
- Arrows hidden (existing CSS)
- Horizontal scroll/swipe still works

- [ ] **Step 4: Verify mobile breakpoint (≤ 640px)**

Resize to ~500px wide. Confirm:
- 1 card visible
- 5 dots appear
- Arrows hidden
- Horizontal scroll/swipe works

- [ ] **Step 5: Back-compat check**

Temporarily edit the curated section in `test.html` to use only `data-count="3"` (remove `data-columns`). Reload. Confirm:
- 3 cards render
- All 3 visible, no overflow
- Arrows hidden (because `allVisible` check in `updateIndicators`)
- Dots hidden

Restore `data-columns="3"` and `data-count="5"` afterward. Do not commit the back-compat test edit.

- [ ] **Step 6: Stop the server**

Ctrl+C in the terminal running `npm run serve`.

---

### Task 8: Bump widget package version and publish

**Files:**
- Modify: `package.json` (version field)

- [ ] **Step 1: Bump the version**

Pick a new version (a patch bump like `1.3.10` is fine since the change is additive and backwards-compatible). Edit `package.json`:

```json
  "version": "1.3.10",
```

- [ ] **Step 2: Build from scratch to refresh `dist/`**

```bash
npm run build
```

- [ ] **Step 3: Commit the version bump**

```bash
git add package.json dist/
git commit -m "chore: bump to v1.3.10"
```

- [ ] **Step 4: Tag and push**

```bash
git tag v1.3.10
git push && git push --tags
```

- [ ] **Step 5: Publish to npm**

This step requires npm login. If not already logged in:

```bash
npm whoami || npm login
```

Publish:

```bash
npm publish
```

Expected: `+ ticketmaster-venue-widget@1.3.10` printed. The CDN (`https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@1.3.10/dist/`) will pick up the new version within a few minutes.

- [ ] **Step 6: Confirm the CDN has the new version**

```bash
curl -sI "https://cdn.jsdelivr.net/npm/ticketmaster-venue-widget@1.3.10/dist/ticketmaster-venue-widget.min.js" | head -3
```

Expected: `HTTP/2 200`. If `404`, wait 1–2 minutes and retry (jsDelivr has a propagation delay).

---

## Phase B — Loader changes (`16oc-events-deploy`)

### Task 9: Update loader defaults in `venues/salt-shed.js`

**Files:**
- Modify: `/Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy/venues/salt-shed.js`

- [ ] **Step 1: Switch working directory**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy
git status
```

Expected: clean working tree on `main`.

- [ ] **Step 2: Bump `VERSION` to the new widget release**

Find line 2 of `venues/salt-shed.js`:

```js
  var VERSION = '1.3.9';
```

Replace with:

```js
  var VERSION = '1.3.10';
```

- [ ] **Step 3: Update curated defaults to `count=5`, `columns=3`**

Find the curated-strip defaults block (lines 37–51) in `venues/salt-shed.js`:

```js
    // Set defaults on curated strip elements
    var curatedEls = document.querySelectorAll('[data-ve-curated]');
    curatedEls.forEach(function (el) {
      if (!el.dataset.label) el.dataset.label = 'Featured Events';
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.count) el.dataset.count = '3';
      if (!el.dataset.showVenueLabel) el.dataset.showVenueLabel = 'true';
      if (!el.dataset.venueShortNames) {
        el.dataset.venueShortNames = JSON.stringify({
          'KovZ917AI5F': 'Shed',
          'KovZ917Amf0': 'Fairgrounds',
        });
      }
    });
```

Replace with:

```js
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
          'KovZ917Amf0': 'Fairgrounds',
        });
      }
    });
```

---

### Task 10: Local verification of the loader

**Files:** (verification only)

The loader pulls the widget JS from jsDelivr. Easiest verification is to open one of the demo HTMLs against the edited loader. The demo pages in `sites/` already include the loader.

- [ ] **Step 1: Serve the repo locally**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy
python3 -m http.server 8081
```

- [ ] **Step 2: Open `saltshed.html` in a browser**

Navigate to `http://localhost:8081/sites/saltshed.html`.

Note: the loader reads `window.SALTSHED_API_KEY`. If the demo page does not set it, the widget will render an error. Inspect `sites/saltshed.html` and, if needed, set a test API key in a temporary `<script>window.SALTSHED_API_KEY = 'YOUR_KEY';</script>` tag before the loader script (do not commit).

- [ ] **Step 3: Verify curated strip renders 5 cards / 3 visible**

Confirm on the rendered page:
- Curated section shows 5 cards on the track
- 3 are visible at desktop width
- Arrows and 3 dots appear
- Resize to < 768px → 2 visible + 4 dots
- Resize to < 640px → 1 visible + 5 dots

- [ ] **Step 4: Stop the server**

Ctrl+C.

If the curated section still shows only 3 cards (no overflow, no dots), the jsDelivr CDN has not propagated. Wait a minute and hard-reload (Cmd+Shift+R) to bypass browser cache.

---

### Task 11: Commit loader update

**Files:**
- The edited `venues/salt-shed.js` from Task 9.

- [ ] **Step 1: Commit**

```bash
cd /Users/wolf/workspace/github.com/wolfazoid/16oc-events-deploy
git add venues/salt-shed.js
git commit -m "chore: bump loader to v1.3.10, curated renders 5 cards / 3 visible"
```

- [ ] **Step 2: Push**

```bash
git push
```

- [ ] **Step 3: Confirm on production**

After GitHub Pages publishes (typically within ~1 minute), load the live Salt Shed page that embeds the loader. Verify the curated strip shows 5 cards with 3 visible. If the live site caches aggressively, a hard reload will pick up the updated loader.

---

## Self-Review

**Spec coverage:**
- Design §1 (new `data-columns`) → Task 1 ✓
- Design §2 (CSS var reads `columns`) → Task 1 ✓
- Design §3 (page-aware dots + computeVisible + renderDots) → Task 2 ✓
- Design §3 (ResizeObserver) → Task 3 ✓
- Design §3 (active-dot clamping) → Task 4 ✓
- Design §4 (destroy cleanup) → Task 3 ✓
- Design §5 (loader defaults + VERSION bump) → Task 9 ✓
- Testing plan (desktop/tablet/mobile, back-compat) → Task 7 ✓
- Release sequence (publish widget, bump loader, verify) → Tasks 8, 10, 11 ✓

**Placeholders:** none.

**Type consistency:** `computeVisible`, `renderDots`, `_ro`, `events.length`, `dots.length`, `this.options.columns`, `this.options.count` are used consistently across Tasks 1–4.

**Note on scope:** Tasks 5 and 6 add the first test.html coverage and first README docs for the curated strip (they did not exist before). This is technically beyond the strict diff for `data-columns`, but CLAUDE.md of the widget repo explicitly requires both for every new feature, so it's in-scope.
