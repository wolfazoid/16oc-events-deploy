/**
 * Salt Shed Events Widget — self-contained bundle
 * Built: 2026-10-30T19:02:06.773Z
 * Build date: 2026-10-30
 *
 * Contents: base widget CSS + Salt Shed theme CSS + widget runtime + bootstrap.
 * Reads API key from window.SALTSHED_API_KEY at runtime.
 */
(function () {
  // 1. Inject combined CSS (base widget + Salt Shed theme)
  var style = document.createElement('style');
  style.textContent = `/**
 * Ticketmaster Venue Widget - Component Styles
 * Designed to work within Squarespace templates
 */

/* ==========================================================================
   CSS CUSTOM PROPERTIES (Theming)
   ========================================================================== */

:root {
  /* Colors - Override these in Squarespace Custom CSS */
  --ve-primary: #e63946;
  --ve-primary-hover: #d62839;
  --ve-text: #1a1a1a;
  --ve-text-muted: #666666;
  --ve-background: #ffffff;
  --ve-card-bg: #ffffff;
  --ve-border: #e5e5e5;
  --ve-shadow: rgba(0, 0, 0, 0.08);

  /* Typography */
  --ve-font-family: inherit;
  --ve-font-size-sm: 0.875rem;
  --ve-font-size-base: 1rem;
  --ve-font-size-lg: 1.125rem;
  --ve-font-size-xl: 1.25rem;
  --ve-font-weight-normal: 400;
  --ve-font-weight-medium: 500;
  --ve-font-weight-bold: 600;

  /* Spacing */
  --ve-spacing-xs: 0.25rem;
  --ve-spacing-sm: 0.5rem;
  --ve-spacing-md: 1rem;
  --ve-spacing-lg: 1.5rem;
  --ve-spacing-xl: 2rem;

  /* Layout */
  --ve-card-radius: 8px;
  --ve-input-radius: 4px;
  --ve-transition: 0.2s ease;
  --ve-columns: 3;

  /* Button */
  --ve-button-radius: 4px;
  --ve-button-text-transform: none;
  --ve-button-letter-spacing: 0;
  --ve-button-font-weight: 500;
}

/* ==========================================================================
   BASE COMPONENT
   ========================================================================== */

.ve-events {
  font-family: var(--ve-font-family);
  color: var(--ve-text);
  position: relative;
  width: 100%;
}

.ve-events *,
.ve-events *::before,
.ve-events *::after {
  box-sizing: border-box;
}

/* ==========================================================================
   LOADING STATE
   ========================================================================== */

.ve-events__loading {
  display: none;
  padding: var(--ve-spacing-md) var(--ve-spacing-lg);
  margin-bottom: var(--ve-spacing-md);
  text-align: center;
  font-size: var(--ve-font-size-md);
  color: var(--ve-text-muted);
  background: var(--ve-background, #f5f5f5);
  border-radius: var(--ve-card-radius);
}

.ve-events--loading .ve-events__loading {
  display: block;
}

/* ==========================================================================
   FILTERS
   ========================================================================== */

.ve-events__filters {
  margin-bottom: var(--ve-spacing-xl);
  padding: var(--ve-spacing-md);
  background: var(--ve-card-bg);
  border-radius: var(--ve-card-radius);
  border: 1px solid var(--ve-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* Desktop: single line — search + all filters inline */
.ve-events__filter-row {
  display: flex;
  gap: var(--ve-spacing-sm);
  align-items: center;
}

.ve-events__search {
  flex: 1;
  min-width: 120px;
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-base);
  font-family: inherit;
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-input-radius);
  transition: border-color var(--ve-transition);
}

.ve-events__search:focus {
  outline: none;
  border-color: var(--ve-primary);
}

.ve-events__search::placeholder {
  color: var(--ve-text-muted);
}

/* Filter toggle button — hidden on desktop, shown on mobile */
.ve-events__filter-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  padding: 0;
  color: var(--ve-text-muted);
  background: transparent;
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
}

.ve-events__filter-toggle:hover,
.ve-events__filter-toggle--active {
  color: var(--ve-primary);
  border-color: var(--ve-primary);
}

/* Desktop: drawer is inline with the search in one row */
.ve-events__filter-drawer {
  display: contents;
}

.ve-events__venue-select,
.ve-events__genre-select {
  min-width: 0;
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-base);
  font-family: inherit;
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-input-radius);
  background: var(--ve-background);
  cursor: pointer;
  transition: border-color var(--ve-transition);
  flex-shrink: 0;
}

.ve-events__venue-select:focus,
.ve-events__genre-select:focus {
  outline: none;
  border-color: var(--ve-primary);
}

/* ==========================================================================
   DATE PICKER
   ========================================================================== */

.ve-events__date-picker {
  position: relative;
}

.ve-events__date-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--ve-spacing-xs);
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-base);
  font-family: inherit;
  color: var(--ve-text-muted);
  background: var(--ve-background);
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
  white-space: nowrap;
}

.ve-events__date-btn:hover,
.ve-events__date-btn--active {
  color: var(--ve-primary);
  border-color: var(--ve-primary);
}

/* Calendar dropdown */
.ve-events__calendar-dropdown {
  display: none;
  position: absolute;
  top: calc(100% + var(--ve-spacing-xs));
  right: 0;
  left: auto;
  z-index: 100;
  min-width: 280px;
  padding: var(--ve-spacing-md);
  background: var(--ve-card-bg);
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-card-radius);
  box-shadow: 0 8px 24px var(--ve-shadow);
}

.ve-events__calendar-dropdown--open {
  display: block;
}

/* Calendar header */
.ve-events__cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--ve-spacing-sm);
}

.ve-events__cal-title {
  font-size: var(--ve-font-size-base);
  font-weight: var(--ve-font-weight-bold);
  color: var(--ve-text);
}

.ve-events__cal-nav {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--ve-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
}

.ve-events__cal-nav:hover {
  color: var(--ve-primary);
  background: var(--ve-border);
}

/* Day labels */
.ve-events__cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: var(--ve-spacing-xs);
}

.ve-events__cal-day-label {
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-bold);
  color: var(--ve-text-muted);
  padding: var(--ve-spacing-xs) 0;
}

/* Date grid */
.ve-events__cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.ve-events__cal-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
  font-size: var(--ve-font-size-sm);
  font-family: inherit;
  color: var(--ve-text);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all var(--ve-transition);
}

.ve-events__cal-cell:hover:not(:disabled) {
  background: var(--ve-border);
}

.ve-events__cal-cell--empty {
  cursor: default;
}

.ve-events__cal-cell--disabled {
  color: var(--ve-border);
  cursor: not-allowed;
}

.ve-events__cal-cell--start,
.ve-events__cal-cell--end,
.ve-events__cal-cell--single {
  background: var(--ve-primary) !important;
  color: #ffffff !important;
}

.ve-events__cal-cell--in-range {
  background: var(--ve-border);
  border-radius: 0;
}

.ve-events__cal-cell--start {
  border-radius: 50% 0 0 50%;
}

.ve-events__cal-cell--end {
  border-radius: 0 50% 50% 0;
}

/* Clear button */
.ve-events__cal-clear {
  display: block;
  width: 100%;
  margin-top: var(--ve-spacing-sm);
  padding: var(--ve-spacing-xs) var(--ve-spacing-sm);
  font-size: var(--ve-font-size-sm);
  font-family: inherit;
  color: var(--ve-text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: color var(--ve-transition);
}

.ve-events__cal-clear:hover {
  color: var(--ve-primary);
}

/* ==========================================================================
   EVENT GRID
   ========================================================================== */

.ve-events__label {
  font-weight: var(--ve-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ve-primary);
  margin: 0 0 var(--ve-spacing-sm);
}

.ve-events__grid {
  display: grid;
  grid-template-columns: repeat(var(--ve-columns), 1fr);
  gap: var(--ve-spacing-lg);
}

/* Stacked date/time layout (opt-in via data-date-layout="stacked") */
.ve-events--date-stacked .ve-events__card-content {
  display: flex !important;
  flex-direction: column;
}

.ve-events--date-stacked .ve-events__card-date {
  grid-column: unset;
  grid-row: unset;
  display: block;
}

.ve-events--date-stacked .ve-events__card-time {
  grid-column: unset;
  grid-row: unset;
  display: block;
  text-align: left;
}

.ve-events--date-stacked .ve-events__card-title,
.ve-events--date-stacked .ve-events__card-genre,
.ve-events--date-stacked .ve-events__card-price {
  grid-column: unset;
  grid-row: unset;
}

.ve-events--date-stacked .ve-events__card-venue {
  grid-column: unset;
  grid-row: unset;
  align-self: unset;
  margin: auto 0 var(--ve-spacing-sm) 0;
}

.ve-events--date-stacked .ve-events__card-buttons {
  grid-column: unset;
  grid-row: unset;
}

/* Responsive grid */
@media (max-width: 1024px) {
  .ve-events__grid {
    --ve-columns: 2 !important;
  }
}

@media (max-width: 640px) {
  .ve-events__grid {
    --ve-columns: 1 !important;
  }

  /* Show filter toggle on mobile */
  .ve-events__filter-toggle {
    display: flex;
  }

  /* Override display:contents for mobile — collapsible column */
  .ve-events__filter-drawer {
    display: none;
    flex-direction: column;
    gap: var(--ve-spacing-sm);
    width: 100%;
    margin-top: var(--ve-spacing-sm);
  }

  .ve-events__filter-drawer--open {
    display: flex;
  }

  /* Filter row wraps on mobile */
  .ve-events__filter-row {
    flex-wrap: wrap;
  }

  .ve-events__venue-select,
  .ve-events__genre-select {
    min-width: 0;
    width: 100%;
  }

  .ve-events__date-picker {
    width: 100%;
  }

  .ve-events__date-btn {
    width: 100%;
    justify-content: center;
  }

}

/* List layout */
.ve-events--list .ve-events__grid {
  grid-template-columns: 1fr;
}

.ve-events--list .ve-events__card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--ve-spacing-lg);
}

.ve-events--list .ve-events__card-image {
  aspect-ratio: 1;
}

@media (max-width: 640px) {
  .ve-events--list .ve-events__card {
    grid-template-columns: 1fr;
  }
}

/* ==========================================================================
   EVENT CARD
   ========================================================================== */

.ve-events__card {
  background: var(--ve-card-bg);
  border-radius: var(--ve-card-radius);
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 2px 8px var(--ve-shadow);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex !important;
  flex-direction: column !important;
}

.ve-events__card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Card Image */
.ve-events__card-image {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--ve-border);
}

.ve-events__card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.ve-events__card:hover .ve-events__card-image img {
  transform: scale(1.04);
}

/* Status Badge */
.ve-events__badge {
  position: absolute;
  top: var(--ve-spacing-sm);
  right: var(--ve-spacing-sm);
  padding: 0.15rem var(--ve-spacing-sm);
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-medium);
  text-transform: uppercase;
  border-radius: var(--ve-input-radius);
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
}

.ve-events__badge--cancelled,
.ve-events__badge--postponed {
  background: #dc3545;
}

.ve-events__badge--offsale,
.ve-events__badge--rescheduled {
  background: var(--ve-border);
  color: var(--ve-primary);
}

/* Card Content */
.ve-events__card-content {
  padding: var(--ve-spacing-lg);
  display: grid !important;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto auto 1fr auto;
  gap: 0;
  flex: 1;
}

.ve-events__card-date {
  grid-column: 1;
  grid-row: 1;
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-bold);
  color: var(--ve-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--ve-spacing-xs);
}

.ve-events__card-time {
  grid-column: 2;
  grid-row: 1;
  text-align: right;
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
  margin-bottom: var(--ve-spacing-xs);
}

.ve-events__card-title {
  grid-column: 1 / -1;
  grid-row: 2;
  margin: 0 0 var(--ve-spacing-sm);
  font-size: var(--ve-font-size-lg);
  font-weight: var(--ve-font-weight-bold);
  line-height: 1.3;
  color: var(--ve-text);
}

/* Venue — pinned just above buttons */
.ve-events__card-venue {
  grid-column: 1 / -1;
  grid-row: 4;
  align-self: end;
  display: flex;
  align-items: center;
  gap: var(--ve-spacing-xs);
  margin: 0 0 var(--ve-spacing-sm) 0;
  padding-top: var(--ve-spacing-sm);
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
  line-height: 1.3;
}

.ve-events__card-venue-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.ve-events__card-venue-icon svg {
  display: block;
}

.ve-events__card-middle {
  grid-column: 1 / -1;
  grid-row: 3;
  display: flex;
  flex-direction: column;
  gap: var(--ve-spacing-xs);
}

.ve-events__card-genre {
  display: inline-block;
  padding: var(--ve-spacing-xs) var(--ve-spacing-sm);
  font-size: var(--ve-font-size-sm);
  background: var(--ve-border);
  border-radius: var(--ve-input-radius);
}

.ve-events__card-age-restriction {
  margin: 0 0 var(--ve-spacing-sm);
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-medium);
  color: var(--ve-text-muted);
}

.ve-events__card-price {
  margin: 0 0 var(--ve-spacing-md);
  font-size: var(--ve-font-size-base);
  font-weight: var(--ve-font-weight-medium);
  color: var(--ve-text);
}

/* Button Group — flush to card edges, no gap */
.ve-events__card-buttons {
  grid-column: 1 / -1;
  grid-row: 5;
  display: flex;
  gap: 0;
  align-items: stretch;
  margin-left: calc(-1 * var(--ve-spacing-lg));
  margin-right: calc(-1 * var(--ve-spacing-lg));
  margin-bottom: calc(-1 * var(--ve-spacing-lg));
}

/* CTA Button (left 50%) */
.ve-events__card-cta {
  flex: 1 1 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-button-font-weight);
  font-family: inherit;
  text-decoration: none;
  text-align: center;
  text-transform: var(--ve-button-text-transform);
  letter-spacing: var(--ve-button-letter-spacing);
  white-space: nowrap;
  color: #ffffff;
  background: var(--ve-primary);
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.ve-events__card-cta:hover {
  background: var(--ve-primary-hover);
  color: #ffffff;
  text-decoration: none;
}

.ve-events__card-cta:active {
  transform: scale(0.98);
}

/* Info Side — right 50%, entire area clickable */
.ve-events__card-info-side {
  flex: 1 1 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ve-spacing-sm);
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-sm);
  font-family: inherit;
  color: var(--ve-primary);
  background: var(--ve-border);
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  white-space: nowrap;
}

.ve-events__card-info-side:hover {
  background: #d9d9d9;
}

.ve-events__card-info-side:active {
  transform: scale(0.98);
}

/* Info icon within the right side */
.ve-events__card-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ve-events__card-info-icon svg {
  display: block;
}

/* Venue label within the right side */
.ve-events__card-venue-label {
  font-weight: var(--ve-button-font-weight);
  text-transform: var(--ve-button-text-transform);
  letter-spacing: var(--ve-button-letter-spacing);
}

/* Legacy info button (for backwards compat) */
.ve-events__card-info-btn {
  display: none;
}

/* ==========================================================================
   INFO MODAL
   ========================================================================== */

.ve-events__modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--ve-spacing-lg);
}

.ve-events__modal {
  background: var(--ve-card-bg);
  border-radius: var(--ve-card-radius);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 24px 64px rgba(0, 0, 0, 0.2);
}

.ve-events__modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--ve-spacing-md);
  padding: var(--ve-spacing-lg);
  border-bottom: 1px solid var(--ve-border);
}

.ve-events__modal-header-text {
  flex: 1;
  min-width: 0;
}

.ve-events__modal-title {
  margin: 0 0 var(--ve-spacing-xs);
  font-size: var(--ve-font-size-xl);
  font-weight: var(--ve-font-weight-bold);
  line-height: 1.3;
  color: var(--ve-text);
}

.ve-events__modal-date {
  margin: 0;
  font-size: var(--ve-font-size-sm);
  color: var(--ve-primary);
  font-weight: var(--ve-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ve-events__modal-doors {
  margin: 0;
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
  margin-top: var(--ve-spacing-xs);
}

.ve-events__modal-close {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  font-size: 1.5rem;
  line-height: 1;
  font-family: inherit;
  color: var(--ve-text-muted);
  background: transparent;
  border: none;
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ve-events__modal-close:hover {
  color: var(--ve-text);
  background: var(--ve-border);
}

.ve-events__modal-body {
  padding: var(--ve-spacing-lg);
}

.ve-events__modal-image {
  width: 100%;
  border-radius: var(--ve-input-radius);
  margin-bottom: var(--ve-spacing-lg);
}

.ve-events__modal-section {
  margin-bottom: var(--ve-spacing-lg);
}

.ve-events__modal-section:last-child {
  margin-bottom: 0;
}

.ve-events__modal-section-title {
  margin: 0 0 var(--ve-spacing-xs);
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-bold);
  color: var(--ve-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ve-events__modal-section-text {
  margin: 0;
  font-size: var(--ve-font-size-base);
  line-height: 1.6;
  color: var(--ve-text);
}

.ve-events__modal-footer {
  display: flex;
  gap: var(--ve-spacing-sm);
  padding: var(--ve-spacing-lg);
  border-top: 1px solid var(--ve-border);
}

.ve-events__modal-footer .ve-events__card-cta {
  flex: 1;
  text-align: center;
}

@media (max-width: 640px) {
  .ve-events__modal-overlay {
    padding: var(--ve-spacing-sm);
    align-items: flex-end;
  }

  .ve-events__modal {
    max-height: 90vh;
    border-radius: var(--ve-card-radius) var(--ve-card-radius) 0 0;
  }
}

/* ==========================================================================
   COMPACT CARD STYLE
   ========================================================================== */

.ve-events--compact .ve-events__card-content {
  padding: var(--ve-spacing-md);
}

.ve-events--compact .ve-events__card-buttons {
  margin-left: calc(-1 * var(--ve-spacing-md));
  margin-right: calc(-1 * var(--ve-spacing-md));
  margin-bottom: calc(-1 * var(--ve-spacing-md));
}

.ve-events--compact .ve-events__card-title {
  font-size: var(--ve-font-size-base);
}

.ve-events--compact .ve-events__card-venue,
.ve-events--compact .ve-events__card-genre {
  display: none;
}

/* ==========================================================================
   DETAILED CARD STYLE
   ========================================================================== */

.ve-events--detailed .ve-events__card-content {
  padding: var(--ve-spacing-xl);
}

.ve-events--detailed .ve-events__card-buttons {
  margin-left: calc(-1 * var(--ve-spacing-xl));
  margin-right: calc(-1 * var(--ve-spacing-xl));
  margin-bottom: calc(-1 * var(--ve-spacing-xl));
}

.ve-events--detailed .ve-events__card-title {
  font-size: var(--ve-font-size-xl);
}

/* ==========================================================================
   EMPTY & ERROR STATES
   ========================================================================== */

.ve-events__empty,
.ve-events__error {
  grid-column: 1 / -1;
  text-align: center;
  padding: var(--ve-spacing-xl);
  color: var(--ve-text-muted);
}

.ve-events__error p {
  margin-bottom: var(--ve-spacing-md);
}

.ve-events__retry-btn {
  padding: var(--ve-spacing-sm) var(--ve-spacing-lg);
  font-size: var(--ve-font-size-base);
  font-family: inherit;
  color: var(--ve-primary);
  background: transparent;
  border: 2px solid var(--ve-primary);
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
}

.ve-events__retry-btn:hover {
  color: #ffffff;
  background: var(--ve-primary);
}

/* ==========================================================================
   PAGINATION
   ========================================================================== */

.ve-events__pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: var(--ve-spacing-md);
  margin-top: var(--ve-spacing-xl);
  padding-top: var(--ve-spacing-lg);
  border-top: 1px solid var(--ve-border);
}

.ve-events__pagination-count {
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
}

.ve-events__pagination-nav {
  display: flex;
  align-items: center;
  gap: var(--ve-spacing-md);
}

.ve-events__pagination-btn {
  padding: var(--ve-spacing-sm) var(--ve-spacing-md);
  font-size: var(--ve-font-size-base);
  font-family: inherit;
  color: var(--ve-text);
  background: var(--ve-background);
  border: 1px solid var(--ve-border);
  border-radius: var(--ve-input-radius);
  cursor: pointer;
  transition: all var(--ve-transition);
}

.ve-events__pagination-btn:hover:not(:disabled) {
  border-color: var(--ve-primary);
  color: var(--ve-primary);
}

.ve-events__pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ve-events__pagination-indicator {
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
}

@media (max-width: 640px) {
  .ve-events__pagination {
    flex-direction: column;
    text-align: center;
  }
}

/* ==========================================================================
   FEATURED HERO COMPONENT
   ========================================================================== */

.ve-featured {
  font-family: var(--ve-font-family);
  color: var(--ve-text);
  width: 100%;
  margin-bottom: var(--ve-spacing-xl);
}

.ve-featured *,
.ve-featured *::before,
.ve-featured *::after {
  box-sizing: border-box;
}

.ve-featured__label {
  font-weight: var(--ve-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ve-primary);
  margin: 0 0 var(--ve-spacing-sm);
}

.ve-featured__card {
  display: flex;
  background: var(--ve-card-bg);
  border-radius: var(--ve-card-radius);
  box-shadow: 0 2px 8px var(--ve-shadow);
  overflow: hidden;
}

.ve-featured__image {
  position: relative;
  flex: 0 0 55%;
  min-height: 200px;
}

.ve-featured__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ve-featured__image .ve-events__badge {
  position: absolute;
  top: var(--ve-spacing-sm);
  left: var(--ve-spacing-sm);
}

.ve-featured__info {
  flex: 1;
  padding: var(--ve-spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.ve-featured__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ve-spacing-xs) var(--ve-spacing-md);
  align-items: baseline;
  margin-bottom: var(--ve-spacing-sm);
  line-height: 1.2;
}

.ve-featured__date {
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-bold);
  color: var(--ve-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.ve-featured__time {
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
  line-height: 1.2;
}

.ve-featured__title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--ve-text);
  margin: 0 0 var(--ve-spacing-md);
  line-height: 1.15;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.ve-featured__venue {
  display: flex;
  align-items: center;
  gap: var(--ve-spacing-xs);
  font-size: var(--ve-font-size-sm);
  color: var(--ve-text-muted);
  margin: 0 0 var(--ve-spacing-sm);
}

.ve-featured__age-restriction {
  font-size: var(--ve-font-size-sm);
  font-weight: var(--ve-font-weight-medium);
  color: var(--ve-text-muted);
  margin: 0 0 var(--ve-spacing-sm);
}

.ve-featured__buttons {
  display: flex;
  gap: 0;
}

.ve-featured__buttons .ve-events__card-cta,
.ve-featured__buttons .ve-events__card-info-side {
  flex: 1;
}

@media (max-width: 768px) {
  .ve-featured__image {
    flex: 0 0 45%;
  }

  .ve-featured__info {
    padding: var(--ve-spacing-md);
  }

  .ve-featured__title {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .ve-featured__card {
    flex-direction: column;
  }

  .ve-featured__image {
    flex: none;
    height: 220px;
  }

  .ve-featured__info {
    padding: var(--ve-spacing-md);
  }

  .ve-featured__title {
    font-size: 1.25rem;
  }
}

/* ==========================================================================
   CURATED STRIP COMPONENT
   ========================================================================== */

.ve-curated {
  font-family: var(--ve-font-family);
  color: var(--ve-text);
  width: 100%;
  margin-bottom: var(--ve-spacing-xl);
}

.ve-curated *,
.ve-curated *::before,
.ve-curated *::after {
  box-sizing: border-box;
}

.ve-curated__label {
  font-weight: var(--ve-font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ve-primary);
  margin: 0 0 var(--ve-spacing-sm);
}

.ve-curated__slider {
  position: relative;
}

.ve-curated__track {
  display: flex;
  gap: var(--ve-spacing-md);
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.ve-curated__track::-webkit-scrollbar {
  display: none;
}

.ve-curated__track > .ve-events__card {
  flex: 0 0 calc((100% - var(--ve-spacing-md) * (var(--ve-curated-columns, 3) - 1)) / var(--ve-curated-columns, 3));
  min-width: 220px;
  scroll-snap-align: start;
}

.ve-curated__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--ve-card-bg, #fff);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ve-text);
  transition: opacity 0.2s;
}

.ve-curated__arrow:hover {
  opacity: 0.8;
}

.ve-curated__arrow--prev {
  left: -18px;
}

.ve-curated__arrow--next {
  right: -18px;
}

.ve-curated__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: var(--ve-spacing-sm);
}

.ve-curated__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: var(--ve-border, #ccc);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.ve-curated__dot--active {
  background: var(--ve-primary);
  transform: scale(1.25);
}

@media (max-width: 768px) {
  .ve-curated__track > .ve-events__card {
    flex: 0 0 calc((100% - var(--ve-spacing-md)) / 2);
    min-width: 200px;
  }

  .ve-curated__arrow {
    display: none;
  }
}

@media (max-width: 640px) {
  .ve-curated__track > .ve-events__card {
    flex: 0 0 100%;
    min-width: 0;
  }
}

/* ==========================================================================
   SQUARESPACE OVERRIDES
   ========================================================================== */

/* Reset Squarespace link styles within our component */
.ve-events a {
  text-decoration: none;
}

.ve-events a:hover {
  text-decoration: none;
}

/* Ensure our fonts inherit properly */
.ve-events h1,
.ve-events h2,
.ve-events h3,
.ve-events h4,
.ve-events h5,
.ve-events h6,
.ve-events p {
  font-family: var(--ve-font-family);
}

/* Override any Squarespace button styles */
.ve-events button,
.ve-events .ve-events__card-cta {
  -webkit-appearance: none;
  appearance: none;
}


/* === Salt Shed theme === */
/*
 * Salt Shed — Venue Theme
 * Brand overrides for ticketmaster-venue-widget
 */

[data-venue-events],
[data-ve-featured],
[data-ve-curated] {
  --ve-primary: #2D3B97;
  --ve-primary-hover: #232E78;
  --ve-text: #2d3b97;
  --ve-text-muted: #636363;
  --ve-background: #FBF6DF;
  --ve-card-bg: #FBF6DF;
  --ve-border: rgba(45, 59, 151, 0.15);
  --ve-shadow: rgba(0, 0, 0, 0.25);
  --ve-font-family: purista-web, 'Rajdhani', sans-serif;
  --ve-card-radius: 2px;
  --ve-button-radius: 0px;
  --ve-button-text-transform: uppercase;
  --ve-button-letter-spacing: 0.1em;
  --ve-button-font-weight: 700;
}

[data-venue-events] .ve-events__card,
[data-ve-curated] .ve-events__card {
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.49);
}

[data-venue-events] .ve-events__card:hover,
[data-ve-curated] .ve-events__card:hover {
  transform: none;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.49);
}

[data-venue-events] .ve-events__card:hover .ve-events__card-image img,
[data-ve-curated] .ve-events__card:hover .ve-events__card-image img {
  transform: none;
}

[data-venue-events] .ve-events__card-title,
[data-ve-curated] .ve-events__card-title {
  font-family: purista-web, 'Rajdhani', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.25rem;
  color: #2d3b97;
  line-height: 1.2;
}

[data-venue-events] .ve-events__card-date,
[data-ve-curated] .ve-events__card-date {
  color: #2d3b97;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0;
}

[data-ve-featured] .ve-featured__date {
  color: #2d3b97;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

[data-venue-events] .ve-events__card-time,
[data-ve-curated] .ve-events__card-time {
  color: #2d3b97;
  font-size: 0.8rem;
  font-weight: 500;
}

[data-ve-featured] .ve-featured__time {
  color: #2d3b97;
  font-size: 0.95rem;
  font-weight: 500;
}

[data-venue-events] .ve-events__card-venue,
[data-ve-curated] .ve-events__card-venue,
[data-ve-featured] .ve-featured__venue {
  color: #636363;
}

[data-venue-events] .ve-events__card-cta,
[data-ve-curated] .ve-events__card-cta,
[data-ve-featured] .ve-events__card-cta {
  background: #9dbccb;
  color: #2d3b97;
  font-family: purista-web, 'Rajdhani', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 0;
}

[data-venue-events] .ve-events__card-cta:hover,
[data-ve-curated] .ve-events__card-cta:hover,
[data-ve-featured] .ve-events__card-cta:hover {
  background: #8aaebb;
  color: #2d3b97;
}

[data-venue-events] .ve-events__card-info-side,
[data-ve-curated] .ve-events__card-info-side,
[data-ve-featured] .ve-events__card-info-side {
  background: #F8D89E;
  color: #2d3b97;
  font-family: purista-web, 'Rajdhani', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

[data-venue-events] .ve-events__card-info-side:hover,
[data-ve-curated] .ve-events__card-info-side:hover,
[data-ve-featured] .ve-events__card-info-side:hover {
  background: #e6c88a;
  color: #2d3b97;
}

[data-venue-events] .ve-events__badge--offsale,
[data-ve-curated] .ve-events__badge--offsale,
[data-ve-featured] .ve-events__badge--offsale,
[data-venue-events] .ve-events__badge--rescheduled,
[data-ve-curated] .ve-events__badge--rescheduled,
[data-ve-featured] .ve-events__badge--rescheduled {
  background: #F8D89E;
  color: #2d3b97;
}

[data-venue-events] .ve-events__loading {
  background: #2D3B97;
  color: #F8D89E;
}

[data-venue-events] .ve-events__empty {
  color: #F8D89E;
}

[data-venue-events] .ve-events__filters {
  background: #FBF6DF;
  border: 1px solid rgba(45, 59, 151, 0.2);
  border-radius: 2px;
}

[data-venue-events] .ve-events__search,
[data-venue-events] .ve-events__venue-select,
[data-venue-events] .ve-events__genre-select,
[data-venue-events] .ve-events__date-input,
[data-venue-events] .ve-events__date-btn {
  background: #FBF6DF;
  border-color: rgba(45, 59, 151, 0.3);
  color: #2d3b97;
  font-family: purista-web, 'Rajdhani', sans-serif;
}

[data-venue-events] .ve-events__search::placeholder {
  color: rgba(45, 59, 151, 0.4);
}

[data-venue-events] .ve-events__card-genre,
[data-ve-curated] .ve-events__card-genre {
  background: rgba(45, 59, 151, 0.1);
  color: #2d3b97;
  font-weight: 500;
}

[data-venue-events] .ve-events__pagination-btn {
  border-color: rgba(45, 59, 151, 0.3);
  color: #2d3b97;
  background: #FBF6DF;
}

[data-venue-events] .ve-events__pagination-btn:hover:not(:disabled) {
  border-color: #2d3b97;
  background: #2d3b97;
  color: #FBF6DF;
}

[data-venue-events] .ve-events__modal,
[data-ve-featured] .ve-events__modal,
[data-ve-curated] .ve-events__modal {
  background: #FBF6DF;
}

[data-venue-events] .ve-events__modal-title,
[data-ve-featured] .ve-events__modal-title,
[data-ve-curated] .ve-events__modal-title {
  font-family: purista-web, 'Rajdhani', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  color: #2d3b97;
}

[data-venue-events] .ve-events__modal-overlay,
[data-ve-featured] .ve-events__modal-overlay,
[data-ve-curated] .ve-events__modal-overlay {
  background: rgba(26, 26, 46, 0.7);
}

[data-venue-events] .ve-events__modal-header,
[data-ve-featured] .ve-events__modal-header,
[data-ve-curated] .ve-events__modal-header {
  border-bottom-color: rgba(45, 59, 151, 0.15);
}

[data-venue-events] .ve-events__modal-footer,
[data-ve-featured] .ve-events__modal-footer,
[data-ve-curated] .ve-events__modal-footer {
  border-top-color: rgba(45, 59, 151, 0.15);
}

[data-venue-events] .ve-events__modal-footer .ve-events__card-cta,
[data-ve-featured] .ve-events__modal-footer .ve-events__card-cta,
[data-ve-curated] .ve-events__modal-footer .ve-events__card-cta {
  background: #9dbccb;
  color: #2d3b97;
}

/* Label color overrides — heading element handles sizing */
[data-ve-featured] .ve-featured__label {
  color: #fff;
}

[data-ve-curated] .ve-curated__label {
  color: #fff;
}

[data-venue-events] .ve-events__label {
  color: #fff;
}

[data-ve-curated] .ve-curated__dot {
  background: rgba(255, 255, 255, 0.4);
}

[data-ve-curated] .ve-curated__dot--active {
  background: #fff;
}

/* Collapse filter bar at tablet widths to match 2-column grid breakpoint */
@media (max-width: 1024px) {
  [data-venue-events] .ve-events__filter-toggle {
    display: flex;
  }

  [data-venue-events] .ve-events__filter-drawer {
    display: none;
    flex-direction: column;
    gap: var(--ve-spacing-sm);
    width: 100%;
    margin-top: var(--ve-spacing-sm);
  }

  [data-venue-events] .ve-events__filter-drawer--open {
    display: flex;
  }

  [data-venue-events] .ve-events__filter-row {
    flex-wrap: wrap;
  }

  [data-venue-events] .ve-events__venue-select,
  [data-venue-events] .ve-events__genre-select,
  [data-venue-events] .ve-events__date-input,
  [data-venue-events] .ve-events__date-btn {
    min-width: 0;
    width: 100%;
  }
}
`;
  document.head.appendChild(style);

  // 2. Widget runtime (inlined from widget/index.js)
  /**
 * Ticketmaster Venue Widget - Embeddable Events Widget for Venue Websites
 * https://github.com/wolfazoid/ticketmaster-venue-widget
 */

(function (global) {
  "use strict";

  // ==========================================================================
  // CONFIGURATION
  // ==========================================================================

  const DEFAULT_CONFIG = {
    apiKey: null,
    venues: [],
    baseUrl: "https://app.ticketmaster.com/discovery/v2",
    defaultLimit: 12,
    cacheEnabled: true,
    cacheDuration: {
      events: 60 * 60 * 1000, // 1 hour
      venues: 24 * 60 * 60 * 1000, // 24 hours
      classifications: 7 * 24 * 60 * 60 * 1000, // 7 days
      search: 15 * 60 * 1000, // 15 minutes
    },
    debug: false,
    promoterId: null,
    excludedArtists: [],
    // Events to hide on every surface (grid, featured, curated). Each entry may
    // be a Discovery API event id, the legacy id from a ticketmaster.com/event/
    // URL, or a full event URL. Matching is case-insensitive.
    excludeEvents: [],
    theme: null,
    proxyUrl: null,
    tracking: {
      enabled: false,
      utmSource: "venue_website",
      utmMedium: "referral",
      utmCampaign: "events_widget",
    },
    modal: {
      enabled: true,
      sections: [
        "image",
        "info",
        "description",
        "pleaseNote",
        "startTime",
        "venue",
        "price",
        "genre",
        "performers",
      ],
      timeDisplay: "inline",
      showVenueAddress: true,
      showVenueCity: true,
      startTimeLabel: "Start Time",
      doorsOffsetMinutes: 0,
    },
  };

  let config = { ...DEFAULT_CONFIG };

  // ==========================================================================
  // UTILITIES
  // ==========================================================================

  const utils = {
    log(...args) {
      if (config.debug) {
        console.log("[VenueEvents]", ...args);
      }
    },

    error(...args) {
      console.error("[VenueEvents]", ...args);
    },

    /**
     * Generate a cache key from request parameters
     */
    cacheKey(prefix, params) {
      const sorted = Object.keys(params)
        .sort()
        .map((k) => `${k}=${params[k]}`)
        .join("&");
      return `ve_events_${prefix}_${sorted}`;
    },

    /**
     * Get item from cache if valid
     */
    cacheGet(key, maxAge) {
      if (!config.cacheEnabled) return null;

      try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const age = Date.now() - timestamp;

        if (age > maxAge) {
          localStorage.removeItem(key);
          return null;
        }

        utils.log("Cache hit:", key);
        return data;
      } catch (e) {
        return null;
      }
    },

    /**
     * Store item in cache
     */
    cacheSet(key, data) {
      if (!config.cacheEnabled) return;

      try {
        localStorage.setItem(
          key,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        );
        utils.log("Cache set:", key);
      } catch (e) {
        utils.error("Cache write failed:", e);
      }
    },

    /**
     * Parse a comma-separated exclude list (from a data attribute) into an array
     */
    parseExcludeEvents(value) {
      return String(value || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    },

    /**
     * Extract the legacy event id from a ticketmaster.com-style URL
     * (e.g. https://www.ticketmaster.com/event/0400652BB8ACB1CF -> 0400652BB8ACB1CF)
     */
    legacyEventId(url) {
      const match = String(url || "").match(/\/event\/([A-Za-z0-9]+)(?:[/?#]|$)/);
      return match ? match[1] : null;
    },

    /**
     * Normalize a URL for comparison: strip query/hash, trailing slash, case
     */
    normalizeEventUrl(url) {
      return String(url || "")
        .split(/[?#]/)[0]
        .replace(/\/+$/, "")
        .toUpperCase();
    },

    /**
     * Build a normalized Set of identifiers from config.excludeEvents.
     * Entries may be Discovery ids, legacy ids, or full event URLs.
     */
    excludeSet(list) {
      const set = new Set();
      (list || []).forEach((entry) => {
        const raw = String(entry || "").trim();
        if (!raw) return;
        const legacy = utils.legacyEventId(raw);
        set.add((legacy || raw).toUpperCase());
        if (/^https?:\/\//i.test(raw)) set.add(utils.normalizeEventUrl(raw));
      });
      return set;
    },

    /**
     * True when a normalized event matches config.excludeEvents
     */
    isExcludedEvent(event, set) {
      if (!set || set.size === 0) return false;
      if (event.id && set.has(String(event.id).toUpperCase())) return true;
      const legacy = utils.legacyEventId(event.url);
      if (legacy && set.has(legacy.toUpperCase())) return true;
      return !!(event.url && set.has(utils.normalizeEventUrl(event.url)));
    },

    /**
     * Format date for display
     */
    formatDate(dateString, options = {}) {
      // Parse YYYY-MM-DD as local date (not UTC) to avoid off-by-one day in US timezones
      const parts = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
      const date = parts
        ? new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]))
        : new Date(dateString);
      const defaults = {
        weekday: "short",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", { ...defaults, ...options });
    },

    /**
     * Format time for display
     */
    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },

    /**
     * Debounce function calls
     */
    debounce(fn, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
      };
    },

    /**
     * Create DOM element with attributes and children
     */
    createElement(tag, attrs = {}, children = []) {
      const el = document.createElement(tag);

      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "className") {
          el.className = value;
        } else if (key === "dataset") {
          Object.entries(value).forEach(([dataKey, dataVal]) => {
            el.dataset[dataKey] = dataVal;
          });
        } else if (key.startsWith("on") && typeof value === "function") {
          el.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === "disabled") {
          // Handle boolean disabled attribute properly
          if (value) {
            el.setAttribute("disabled", "");
          }
        } else {
          el.setAttribute(key, value);
        }
      });

      children.forEach((child) => {
        if (typeof child === "string") {
          el.appendChild(document.createTextNode(child));
        } else if (child instanceof Node) {
          el.appendChild(child);
        }
      });

      return el;
    },
  };

  // ==========================================================================
  // TRACKING / DATA LAYER
  // ==========================================================================

  const tracking = {
    /**
     * Read UTM params from the current page URL
     */
    getPageUtmParams() {
      const params = {};
      try {
        const search = new URLSearchParams(window.location.search);
        [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
        ].forEach((key) => {
          const val = search.get(key);
          if (val) params[key] = val;
        });
      } catch (e) {
        // URLSearchParams not supported or no location — ignore
      }
      return params;
    },

    /**
     * Append UTM parameters to a Ticketmaster URL.
     * Priority: page URL params > config defaults > nothing.
     * No-op when tracking is disabled.
     */
    buildTrackedUrl(originalUrl) {
      if (!config.tracking.enabled || !originalUrl) return originalUrl;

      try {
        const url = new URL(originalUrl);
        const pageUtms = tracking.getPageUtmParams();

        // Determine final UTM values: page params win over config defaults
        const utmSource = pageUtms.utm_source || config.tracking.utmSource;
        const utmMedium = pageUtms.utm_medium || config.tracking.utmMedium;
        const utmCampaign =
          pageUtms.utm_campaign || config.tracking.utmCampaign;
        const utmTerm = pageUtms.utm_term;
        const utmContent = pageUtms.utm_content;

        if (utmSource) url.searchParams.set("utm_source", utmSource);
        if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
        if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
        if (utmTerm) url.searchParams.set("utm_term", utmTerm);
        if (utmContent) url.searchParams.set("utm_content", utmContent);

        return url.toString();
      } catch (e) {
        utils.error("Failed to build tracked URL:", e);
        return originalUrl;
      }
    },

    /**
     * Push an event to window.dataLayer (GTM).
     * No-op when tracking is disabled.
     */
    pushEvent(eventName, params = {}) {
      if (!config.tracking.enabled) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: eventName, ...params });
      utils.log("dataLayer push:", eventName, params);
    },

    /**
     * Track a "Get Tickets" click.
     * `section` identifies which widget the click came from:
     *   "grid" (all shows / main event grid),
     *   "featured" (featured event hero),
     *   "curated" (curated carousel).
     */
    trackTicketClick(event, trackedUrl, section) {
      tracking.pushEvent("ticket_click", {
        section: section || null,
        venue_id: event.venue.id,
        venue_name: event.venue.name,
        event_id: event.id,
        event_name: event.name,
        event_date: event.date.localDate,
        event_time: event.date.localTime,
        destination_url: trackedUrl,
        genre: event.classification.genre,
        price_min: event.price.min,
        price_max: event.price.max,
        currency: event.price.currency,
      });
    },

    /**
     * Track an "Info" (More Info) click.
     * `section` identifies which widget the click came from (see trackTicketClick).
     */
    trackInfoClick(event, section) {
      tracking.pushEvent("info_click", {
        section: section || null,
        venue_id: event.venue.id,
        venue_name: event.venue.name,
        event_id: event.id,
        event_name: event.name,
        event_date: event.date.localDate,
        event_time: event.date.localTime,
        genre: event.classification.genre,
        price_min: event.price.min,
        price_max: event.price.max,
        currency: event.price.currency,
      });
    },

    /**
     * Track a filter change (venue / genre / date range).
     * Fires whenever a user applies a filter in the grid.
     * Grid is currently the only section that has filters, but `section`
     * is included for forward-compatibility.
     */
    trackFilterChange(params = {}) {
      tracking.pushEvent("filter_applied", {
        section: params.section || null,
        venue_id: params.venueId || null,
        filter_type: params.filterType, // "venue" | "genre" | "date_range"
        filter_value: params.filterValue == null ? "" : String(params.filterValue),
      });
    },

    /**
     * Track a search query.
     * Fires after the debounced search input fires a new query.
     */
    trackSearch(params = {}) {
      tracking.pushEvent("search_performed", {
        section: params.section || null,
        venue_id: params.venueId || null,
        search_query: params.query || "",
      });
    },

    /**
     * Track widget render (including zero-events).
     * For the grid section, `filters` carries the current filter state so
     * renders can be attributed to the specific query that produced them.
     */
    trackWidgetLoaded(params = {}) {
      const payload = {
        section: params.section || null,
        venue_id: params.venueId,
        event_count: params.eventCount,
        page_url: window.location.href,
      };
      if (params.filters) {
        payload.filter_venue = params.filters.venue || "";
        payload.filter_genre = params.filters.genre || "";
        payload.filter_start_date = params.filters.startDate || "";
        payload.filter_end_date = params.filters.endDate || "";
        payload.filter_keyword = params.filters.keyword || "";
      }
      tracking.pushEvent("widget_events_rendered", payload);
    },
  };

  // ==========================================================================
  // API SERVICE
  // ==========================================================================

  const api = {
    requestQueue: [],
    isProcessing: false,
    lastRequestTime: 0,
    minRequestInterval: 200, // 5 requests per second max

    /**
     * Process queued requests with rate limiting
     */
    async processQueue() {
      if (this.isProcessing || this.requestQueue.length === 0) return;

      this.isProcessing = true;

      while (this.requestQueue.length > 0) {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;

        if (timeSinceLastRequest < this.minRequestInterval) {
          await new Promise((resolve) =>
            setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest),
          );
        }

        const { url, resolve, reject } = this.requestQueue.shift();
        this.lastRequestTime = Date.now();

        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(
              `API Error: ${response.status} ${response.statusText}`,
            );
          }

          const data = await response.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }

      this.isProcessing = false;
    },

    /**
     * Queue a request with rate limiting
     */
    request(url) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({ url, resolve, reject });
        this.processQueue();
      });
    },

    /**
     * Build API URL with parameters
     */
    buildUrl(endpoint, params = {}) {
      const base = config.proxyUrl || config.baseUrl;
      const url = new URL(`${base}${endpoint}`);

      if (!config.proxyUrl) {
        url.searchParams.set("apikey", config.apiKey);
      }

      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          url.searchParams.set(key, value);
        }
      });

      return url.toString();
    },

    /**
     * Fetch events with optional filters
     */
    async getEvents(params = {}) {
      const defaults = {
        size: config.defaultLimit,
        sort: "date,asc",
      };

      const mergedParams = { ...defaults, ...params };

      // Handle venue filtering
      if (params.venueId) {
        mergedParams.venueId = params.venueId;
      } else if (config.venues.length > 0) {
        mergedParams.venueId = config.venues.join(",");
      }

      const cacheKey = utils.cacheKey("events", mergedParams);
      const cached = utils.cacheGet(cacheKey, config.cacheDuration.events);

      if (cached) return transformers.applyExclusions(cached);

      const url = this.buildUrl("/events.json", mergedParams);
      utils.log("Fetching events:", url);

      const data = await this.request(url);
      const normalized = transformers.normalizeEventsResponse(data);

      utils.cacheSet(cacheKey, normalized);
      return transformers.applyExclusions(normalized);
    },

    /**
     * Fetch single event details
     */
    async getEvent(eventId) {
      const cacheKey = utils.cacheKey("event", { id: eventId });
      const cached = utils.cacheGet(cacheKey, config.cacheDuration.events);

      if (cached) return cached;

      const url = this.buildUrl(`/events/${eventId}.json`);
      utils.log("Fetching event:", eventId);

      const data = await this.request(url);
      const normalized = transformers.normalizeEvent(data);

      utils.cacheSet(cacheKey, normalized);
      return normalized;
    },

    /**
     * Fetch venue details
     */
    async getVenue(venueId) {
      const cacheKey = utils.cacheKey("venue", { id: venueId });
      const cached = utils.cacheGet(cacheKey, config.cacheDuration.venues);

      if (cached) return cached;

      const url = this.buildUrl(`/venues/${venueId}.json`);
      utils.log("Fetching venue:", venueId);

      const data = await this.request(url);
      const normalized = transformers.normalizeVenue(data);

      utils.cacheSet(cacheKey, normalized);
      return normalized;
    },

    /**
     * Fetch classifications (genres, segments)
     */
    async getClassifications() {
      const cacheKey = "ve_events_classifications";
      const cached = utils.cacheGet(
        cacheKey,
        config.cacheDuration.classifications,
      );

      if (cached) return cached;

      const url = this.buildUrl("/classifications.json", { size: 50 });
      utils.log("Fetching classifications");

      const data = await this.request(url);
      const normalized = transformers.normalizeClassifications(data);

      utils.cacheSet(cacheKey, normalized);
      return normalized;
    },

    /**
     * Search events by keyword
     */
    async searchEvents(keyword, params = {}) {
      return this.getEvents({ ...params, keyword });
    },
  };

  // ==========================================================================
  // DATA TRANSFORMERS
  // ==========================================================================

  const transformers = {
    /**
     * Merge two event arrays, deduplicate by ID, sort by date ascending
     */
    mergeAndDeduplicate(eventsA, eventsB) {
      const seen = new Map();
      [...eventsA, ...eventsB].forEach((event) => {
        if (!seen.has(event.id)) {
          seen.set(event.id, event);
        }
      });
      return Array.from(seen.values()).sort((a, b) => {
        const dateA = a.date.localDate || "";
        const dateB = b.date.localDate || "";
        return dateA.localeCompare(dateB);
      });
    },

    /**
     * Drop events matching config.excludedArtists (case-insensitive substring
     * match against the event name and attraction names) or
     * config.excludeEvents (event id / ticketmaster.com URL match).
     * Applied on cached responses too, so exclusion changes take effect
     * without waiting out the cache.
     */
    applyExclusions(result) {
      const excluded = (config.excludedArtists || [])
        .filter(Boolean)
        .map((name) => name.toLowerCase());
      const excludedIds = utils.excludeSet(config.excludeEvents);
      if (excluded.length === 0 && excludedIds.size === 0) return result;

      const events = result.events.filter((event) => {
        if (utils.isExcludedEvent(event, excludedIds)) return false;
        const names = [event.name, ...(event.attractions || []).map((a) => a.name)]
          .filter(Boolean)
          .map((name) => name.toLowerCase());
        return !excluded.some((ex) => names.some((name) => name.includes(ex)));
      });

      if (events.length < result.events.length) {
        utils.log("Excluded events:", result.events.length - events.length);
      }

      return { ...result, events };
    },

    /**
     * Normalize full events response
     */
    normalizeEventsResponse(response) {
      const events = response._embedded?.events || [];
      const page = response.page || {};

      return {
        events: events.map(this.normalizeEvent),
        pagination: {
          size: page.size || 0,
          totalElements: page.totalElements || 0,
          totalPages: page.totalPages || 0,
          currentPage: page.number || 0,
        },
      };
    },

    /**
     * Normalize single event
     */
    normalizeEvent(event) {
      const venue = event._embedded?.venues?.[0] || {};
      const attractions = event._embedded?.attractions || [];
      const classification = event.classifications?.[0] || {};
      const priceRange = event.priceRanges?.[0] || {};
      const dates = event.dates || {};
      const startDate = dates.start || {};

      // Find best image — mirrors original widget's getNewEventImage() logic:
      // 1. Ticketweb events: prefer ticketweb-hosted non-fallback image
      // 2. Other events: prefer non-fallback 16:9 at 640px
      // 3. Fallback: largest non-fallback image available
      // 4. Final fallback: any 16:9 at 640px (even generic)
      const images = event.images || [];
      const isTicketweb = (event.url || "").includes("ticketweb");

      let preferredImage;
      if (isTicketweb) {
        preferredImage = images.find(
          (img) => !img.fallback && img.url.includes("ticketweb"),
        );
      } else {
        preferredImage = images.find(
          (img) => !img.fallback && img.ratio === "16_9" && img.width === 640,
        );
      }

      if (!preferredImage) {
        // Largest non-fallback image
        const nonFallback = images.filter((img) => !img.fallback);
        preferredImage = nonFallback.reduce(
          (best, img) => (!best || img.width > best.width ? img : best),
          null,
        );
      }

      if (!preferredImage) {
        // Final fallback: any 16:9 at 640px
        preferredImage =
          images.find((img) => img.ratio === "16_9" && img.width === 640) ||
          images[0];
      }

      return {
        id: event.id,
        name: event.name,
        url: event.url,
        image: preferredImage?.url || null,
        images: images,

        // Date/time info
        date: {
          localDate: startDate.localDate,
          localTime: startDate.localTime,
          dateTime: startDate.dateTime,
          timezone: dates.timezone,
          status: dates.status?.code,
          tbd: startDate.dateTBD || startDate.timeTBA || false,
          noSpecificTime: startDate.noSpecificTime || false,
          accessTime: dates.access?.startDateTime || null,
        },

        // Formatted display strings
        display: {
          date: startDate.localDate
            ? utils.formatDate(startDate.localDate)
            : "Date TBD",
          time: startDate.localTime
            ? utils.formatTime(`2000-01-01T${startDate.localTime}`)
            : "Time TBA",
          dateTime: startDate.localDate
            ? `${utils.formatDate(startDate.localDate)}${startDate.localTime && !startDate.noSpecificTime ? " at " + utils.formatTime("2000-01-01T" + startDate.localTime) : ""}`
            : "Date/Time TBD",
          doorsTime: event.doorsTimes?.localTime
            ? utils.formatTime("2000-01-01T" + event.doorsTimes.localTime)
            : dates.access?.startDateTime
              ? utils.formatTime(dates.access.startDateTime)
              : null,
        },

        // Venue info
        venue: {
          id: venue.id,
          name: venue.name,
          city: venue.city?.name,
          state: venue.state?.stateCode,
          address: venue.address?.line1,
        },

        // Classification
        classification: {
          segment: classification.segment?.name,
          genre: classification.genre?.name,
          subGenre: classification.subGenre?.name,
          type: classification.type?.name,
        },

        // Pricing
        price: {
          min: priceRange.min,
          max: priceRange.max,
          currency: priceRange.currency || "USD",
        },

        // Attractions (artists/performers)
        attractions: attractions.map((a) => ({
          id: a.id,
          name: a.name,
          url: a.url,
          image: a.images?.[0]?.url,
        })),

        // Sales info
        sales: {
          public: event.sales?.public,
          presales: event.sales?.presales || [],
        },

        // Status
        status: dates.status?.code,

        // Event details (for info modal)
        info: event.info || null,
        description: event.description || null,
        pleaseNote: event.pleaseNote || null,
        ageRestrictions: event.ageRestrictions || null,
      };
    },

    /**
     * Normalize venue data
     */
    normalizeVenue(venue) {
      return {
        id: venue.id,
        name: venue.name,
        url: venue.url,
        address: {
          line1: venue.address?.line1,
          city: venue.city?.name,
          state: venue.state?.stateCode,
          postalCode: venue.postalCode,
          country: venue.country?.name,
        },
        location: {
          lat: venue.location?.latitude,
          lng: venue.location?.longitude,
        },
        timezone: venue.timezone,
        images: venue.images || [],
        social: venue.social || {},
        boxOffice: venue.boxOfficeInfo || {},
        parking: venue.parkingDetail,
        accessibility: venue.accessibleSeatingDetail,
      };
    },

    /**
     * Normalize classifications
     */
    normalizeClassifications(response) {
      const classifications = response._embedded?.classifications || [];

      return classifications.map((c) => ({
        segment: {
          id: c.segment?.id,
          name: c.segment?.name,
        },
        genres: (c._embedded?.genres || []).map((g) => ({
          id: g.id,
          name: g.name,
        })),
      }));
    },
  };

  // ==========================================================================
  // COMPONENT REGISTRY
  // ==========================================================================

  const components = {
    registered: {},

    /**
     * Register a component
     */
    register(name, ComponentClass) {
      this.registered[name] = ComponentClass;
      utils.log("Component registered:", name);
    },

    /**
     * Initialize all components on page
     */
    initAll() {
      Object.entries(this.registered).forEach(([name, ComponentClass]) => {
        const selector = ComponentClass.selector;
        const elements = document.querySelectorAll(selector);

        elements.forEach((el) => {
          if (!el._veComponent) {
            try {
              el._veComponent = new ComponentClass(el);
              utils.log("Component initialized:", name, el);
            } catch (error) {
              utils.error("Component init failed:", name, error);
            }
          }
        });
      });
    },

    /**
     * Destroy all component instances
     */
    destroyAll() {
      document
        .querySelectorAll(
          "[data-venue-events], [data-ve-featured], [data-ve-curated], [data-ve-calendar]",
        )
        .forEach((el) => {
          if (
            el._veComponent &&
            typeof el._veComponent.destroy === "function"
          ) {
            el._veComponent.destroy();
          }
          el._veComponent = null;
        });
    },
  };

  // ==========================================================================
  // SHARED CARD AND MODAL FUNCTIONS
  // ==========================================================================

  function getStatusLabel(status) {
    const labels = {
      onsale: "On Sale",
      offsale: "Presale",
      cancelled: "Cancelled",
      postponed: "Postponed",
      rescheduled: "Rescheduled",
    };
    return labels[status] || status;
  }

  function createModalSection(title, text) {
    const section = utils.createElement("div", {
      className: "ve-events__modal-section",
    });
    section.appendChild(
      utils.createElement("h4", { className: "ve-events__modal-section-title" }, [title]),
    );
    const p = utils.createElement("p", { className: "ve-events__modal-section-text" });
    text.split("\n").forEach((line, i) => {
      if (i > 0) p.appendChild(document.createElement("br"));
      p.appendChild(document.createTextNode(line));
    });
    section.appendChild(p);
    return section;
  }

  /**
   * Render a standard event card.
   * @param {object} event - Normalized event from transformers.normalizeEvent
   * @param {object} cardOptions - { showVenueLabel, venueShortNames, showGenre, showPrice, showStatusBadges, modal }
   * @param {function} onInfoClick - Called with event when the info button is clicked
   */
  function createCard(event, cardOptions, onInfoClick) {
    const card = utils.createElement("article", {
      className: "ve-events__card",
      dataset: { eventId: event.id },
    });

    // Image
    if (event.image) {
      const imageContainer = utils.createElement("div", {
        className: "ve-events__card-image",
      });
      const img = utils.createElement("img", {
        src: event.image,
        alt: event.name,
        loading: "lazy",
      });
      imageContainer.appendChild(img);
      const skipBadge =
        event.status === "onsale" ||
        (cardOptions.hidePresaleBadge && event.status === "offsale");
      if (cardOptions.showStatusBadges && event.status && !skipBadge) {
        const badge = utils.createElement(
          "span",
          { className: `ve-events__badge ve-events__badge--${event.status}` },
          [getStatusLabel(event.status)],
        );
        imageContainer.appendChild(badge);
      }
      card.appendChild(imageContainer);
    }

    // Content grid
    const content = utils.createElement("div", {
      className: "ve-events__card-content",
    });

    // Date
    content.appendChild(
      utils.createElement(
        "time",
        {
          className: "ve-events__card-date",
          datetime: event.date.dateTime || event.date.localDate,
        },
        [event.display.date],
      ),
    );

    // Time (real doors time from API, else offset calc, else start time)
    if (!event.date.noSpecificTime && event.date.localTime) {
      let timeText = event.display.time;
      if (event.display.doorsTime) {
        timeText = "Doors: " + event.display.doorsTime;
      } else {
        const doorsOffset = cardOptions.modal.doorsOffsetMinutes;
        if (doorsOffset > 0) {
          const [h, m] = event.date.localTime.split(":").map(Number);
          const totalMin = h * 60 + m - doorsOffset;
          const doorsH = Math.floor((((totalMin % 1440) + 1440) % 1440) / 60);
          const doorsM = (((totalMin % 1440) + 1440) % 1440) % 60;
          const pad = (n) => String(n).padStart(2, "0");
          timeText = "Doors: " + utils.formatTime(`2000-01-01T${pad(doorsH)}:${pad(doorsM)}:00`);
        }
      }
      content.appendChild(
        utils.createElement("span", { className: "ve-events__card-time" }, [timeText]),
      );
    }

    // Title
    content.appendChild(
      utils.createElement("h3", { className: "ve-events__card-title" }, [event.name]),
    );

    // Middle — genre, age restriction, price
    const middle = utils.createElement("div", { className: "ve-events__card-middle" });

    if (cardOptions.showGenre && event.classification.genre) {
      middle.appendChild(
        utils.createElement("span", { className: "ve-events__card-genre" }, [event.classification.genre]),
      );
    }

    const ageText = event.ageRestrictions &&
      (event.ageRestrictions.ageRuleDescription || event.ageRestrictions.description ||
       (event.ageRestrictions.legalAgeEnforced ? "Age Restricted" : null));
    if (ageText) {
      middle.appendChild(
        utils.createElement("p", { className: "ve-events__card-age-restriction" }, [ageText]),
      );
    }

    if (cardOptions.showPrice && event.price.min) {
      const priceText = event.price.min === event.price.max
        ? `$${event.price.min}`
        : `$${event.price.min} - $${event.price.max}`;
      middle.appendChild(
        utils.createElement("p", { className: "ve-events__card-price" }, [priceText]),
      );
    }

    if (middle.children.length > 0) content.appendChild(middle);

    // Venue
    if (event.venue.name) {
      const venue = utils.createElement("p", { className: "ve-events__card-venue" });
      const pinIcon = utils.createElement("span", { className: "ve-events__card-venue-icon" });
      pinIcon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
      venue.appendChild(pinIcon);
      venue.appendChild(document.createTextNode(event.venue.name));
      content.appendChild(venue);
    }

    // Buttons
    const buttons = utils.createElement("div", { className: "ve-events__card-buttons" });

    const trackedUrl = tracking.buildTrackedUrl(event.url);
    const cta = utils.createElement(
      "a",
      {
        className: "ve-events__card-cta",
        href: trackedUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      ["Get Tickets"],
    );
    cta.addEventListener("click", () => tracking.trackTicketClick(event, trackedUrl, cardOptions.section));
    buttons.appendChild(cta);

    if (cardOptions.modal.enabled || cardOptions.showVenueLabel) {
      const infoSide = utils.createElement("button", {
        className: "ve-events__card-info-side",
        type: "button",
        title: "More info",
        "aria-label": "More information about this event",
      });
      if (cardOptions.modal.enabled) {
        const icon = utils.createElement("span", { className: "ve-events__card-info-icon" });
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        infoSide.appendChild(icon);
      }
      if (cardOptions.showVenueLabel && event.venue.id) {
        const shortNames = cardOptions.venueShortNames;
        const label = (shortNames && shortNames[event.venue.id]) || event.venue.name;
        if (label) {
          infoSide.appendChild(
            utils.createElement("span", { className: "ve-events__card-venue-label" }, [label]),
          );
        }
      }
      infoSide.addEventListener("click", () => {
        tracking.trackInfoClick(event, cardOptions.section);
        onInfoClick(event);
      });
      buttons.appendChild(infoSide);
    }

    content.appendChild(buttons);
    card.appendChild(content);
    return card;
  }

  /**
   * Show the event info modal, appended to ownerEl.
   * Stores _modalOverlay and _modalEscHandler on ownerEl for cleanup.
   * `section` is the originating widget section ("grid" | "featured" | "curated"),
   * attached to the Get Tickets tracking event inside the modal footer.
   */
  function showEventModal(event, ownerEl, modalConfig, section) {
    hideEventModal(ownerEl);

    const overlay = utils.createElement("div", { className: "ve-events__modal-overlay" });
    const modal = utils.createElement("div", { className: "ve-events__modal" });

    // Header
    const header = utils.createElement("div", { className: "ve-events__modal-header" });
    const headerText = utils.createElement("div", { className: "ve-events__modal-header-text" });
    headerText.appendChild(
      utils.createElement("h2", { className: "ve-events__modal-title" }, [event.name]),
    );

    if (modalConfig.timeDisplay === "doors") {
      headerText.appendChild(
        utils.createElement("p", { className: "ve-events__modal-date" }, [event.display.date]),
      );
      if (event.display.doorsTime) {
        headerText.appendChild(
          utils.createElement("p", { className: "ve-events__modal-doors" }, [`Doors: ${event.display.doorsTime}`]),
        );
      }
    } else if (modalConfig.timeDisplay === "startTime") {
      headerText.appendChild(
        utils.createElement("p", { className: "ve-events__modal-date" }, [event.display.date]),
      );
    } else {
      headerText.appendChild(
        utils.createElement("p", { className: "ve-events__modal-date" }, [event.display.dateTime]),
      );
    }
    header.appendChild(headerText);

    const closeBtn = utils.createElement(
      "button",
      { className: "ve-events__modal-close", type: "button" },
      ["\u00D7"],
    );
    closeBtn.addEventListener("click", () => hideEventModal(ownerEl));
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // Body — config-driven sections
    const body = utils.createElement("div", { className: "ve-events__modal-body" });

    modalConfig.sections.forEach((section) => {
      switch (section) {
        case "image":
          if (event.image) {
            body.appendChild(
              utils.createElement("img", {
                className: "ve-events__modal-image",
                src: event.image,
                alt: event.name,
              }),
            );
          }
          break;
        case "info":
          if (event.info) body.appendChild(createModalSection("Event Info", event.info));
          break;
        case "description":
          if (event.description) body.appendChild(createModalSection("Description", event.description));
          break;
        case "pleaseNote":
          if (event.pleaseNote) body.appendChild(createModalSection("Please Note", event.pleaseNote));
          break;
        case "ageRestriction":
          if (event.ageRestrictions) {
            const ageText = event.ageRestrictions.ageRuleDescription ||
              (event.ageRestrictions.legalAgeEnforced ? "Age restriction enforced" : null);
            if (ageText) body.appendChild(createModalSection("Age Restriction", ageText));
          }
          break;
        case "startTime": {
          const localTime = event.date.localTime;
          if (localTime && !event.date.noSpecificTime) {
            let timeStr;
            if (event.display.doorsTime) {
              timeStr = event.display.doorsTime;
            } else if (modalConfig.doorsOffsetMinutes > 0) {
              const [h, m] = localTime.split(":").map(Number);
              const startMinutes = h * 60 + m;
              const doorsMinutes = startMinutes - modalConfig.doorsOffsetMinutes;
              const doorsH = Math.floor((((doorsMinutes % 1440) + 1440) % 1440) / 60);
              const doorsM = (((doorsMinutes % 1440) + 1440) % 1440) % 60;
              const pad = (n) => String(n).padStart(2, "0");
              timeStr = utils.formatTime(`2000-01-01T${pad(doorsH)}:${pad(doorsM)}:00`);
            } else {
              timeStr = utils.formatTime("2000-01-01T" + localTime);
            }
            body.appendChild(createModalSection(modalConfig.startTimeLabel, timeStr));
          }
          break;
        }
        case "venue":
          if (event.venue.name) {
            const parts = [event.venue.name];
            if (modalConfig.showVenueAddress && event.venue.address) parts.push(event.venue.address);
            if (modalConfig.showVenueCity && event.venue.city && event.venue.state) {
              parts.push(`${event.venue.city}, ${event.venue.state}`);
            }
            body.appendChild(createModalSection("Venue", parts.join("\n")));
          }
          break;
        case "price":
          if (event.price.min) {
            const priceText = event.price.min === event.price.max
              ? `$${event.price.min}`
              : `$${event.price.min} – $${event.price.max}`;
            body.appendChild(createModalSection("Price Range", priceText));
          }
          break;
        case "genre": {
          const genreParts = [
            event.classification.segment,
            event.classification.genre,
            event.classification.subGenre,
          ].filter(Boolean);
          if (genreParts.length) {
            body.appendChild(createModalSection("Genre", genreParts.join(" / ")));
          }
          break;
        }
        case "performers":
          if (event.attractions.length) {
            body.appendChild(createModalSection("Performers", event.attractions.map((a) => a.name).join(", ")));
          }
          break;
      }
    });

    modal.appendChild(body);

    // Footer
    const footer = utils.createElement("div", { className: "ve-events__modal-footer" });
    const trackedUrl = tracking.buildTrackedUrl(event.url);
    const footerCta = utils.createElement(
      "a",
      {
        className: "ve-events__card-cta",
        href: trackedUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      ["Get Tickets"],
    );
    footerCta.addEventListener("click", () => tracking.trackTicketClick(event, trackedUrl, section));
    footer.appendChild(footerCta);

    const footerClose = utils.createElement(
      "button",
      { className: "ve-events__card-info-btn", type: "button" },
      ["Close"],
    );
    footerClose.addEventListener("click", () => hideEventModal(ownerEl));
    footer.appendChild(footerClose);

    modal.appendChild(footer);
    overlay.appendChild(modal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideEventModal(ownerEl);
    });

    ownerEl._modalEscHandler = (e) => {
      if (e.key === "Escape") hideEventModal(ownerEl);
    };
    document.addEventListener("keydown", ownerEl._modalEscHandler);
    document.body.style.overflow = "hidden";
    ownerEl.appendChild(overlay);
    ownerEl._modalOverlay = overlay;
  }

  function hideEventModal(ownerEl) {
    if (ownerEl._modalOverlay) {
      ownerEl._modalOverlay.remove();
      ownerEl._modalOverlay = null;
    }
    if (ownerEl._modalEscHandler) {
      document.removeEventListener("keydown", ownerEl._modalEscHandler);
      ownerEl._modalEscHandler = null;
    }
    document.body.style.overflow = "";
  }

  // ==========================================================================
  // EVENT GRID COMPONENT
  // ==========================================================================

  class EventGrid {
    static selector = "[data-venue-events]";

    constructor(element) {
      this.element = element;
      this.options = this.parseOptions();
      this.events = [];
      this.pagination = null;
      this.currentPage = 0;
      this.isLoading = false;
      this.venueData = {}; // Cache for venue names: { id: name }
      this.filters = {
        keyword: "",
        genre: "",
        venue: "", // Empty = all venues
        startDate: "",
        endDate: "",
      };

      this.init();
    }

    parseOptions() {
      const dataset = this.element.dataset;
      const venueIdStr = dataset.venueId || config.venues.join(",");
      const venueIds = venueIdStr
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      // Venues shown in the filter dropdown — may be a subset of venueIds
      // (data-venue-filter-ids), so events can be pulled from venues that
      // aren't individually filterable.
      const venueFilterIds = dataset.venueFilterIds
        ? dataset.venueFilterIds
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean)
        : venueIds;

      // Parse venue short names from JSON data attribute
      let venueShortNames = null;
      if (dataset.venueShortNames) {
        try {
          venueShortNames = JSON.parse(dataset.venueShortNames);
        } catch (e) {
          utils.debug("Failed to parse venue-short-names:", e);
        }
      }

      return {
        venue: venueIdStr,
        venueIds: venueIds,
        venueFilterIds: venueFilterIds,
        label: dataset.label || "",
        heading: dataset.heading || "p",
        limit: parseInt(dataset.limit, 10) || config.defaultLimit,
        layout: dataset.layout || "grid", // 'grid' or 'list'
        showFilters: dataset.showFilters === "true",
        showVenueFilter: dataset.showVenueFilter === "true",
        showPagination: dataset.showPagination !== "false",
        columns: parseInt(dataset.columns, 10) || 3,
        cardStyle: dataset.cardStyle || "default", // 'default', 'compact', 'detailed'
        showGenre: dataset.showGenre === "true",
        dateLayout: dataset.dateLayout || "inline",
        showPrice: dataset.showPrice !== "false",
        showVenueLabel: dataset.showVenueLabel !== "false",
        showStatusBadges: dataset.showStatusBadges === "true",
        venueShortNames: venueShortNames,
        modal: config.modal,
      };
    }

    async init() {
      this.render();
      await this.loadEvents();
    }

    render() {
      this.element.innerHTML = "";
      this.element.classList.add("ve-events");
      this.element.classList.add(`ve-events--${this.options.layout}`);
      this.element.classList.add(`ve-events--${this.options.cardStyle}`);
      if (this.options.dateLayout === "stacked") {
        this.element.classList.add("ve-events--date-stacked");
      }

      // Apply theme CSS variables to widget container
      if (config.theme) {
        Object.entries(config.theme).forEach(([key, value]) => {
          this.element.style.setProperty(key, value);
        });
      }

      // Section label
      if (this.options.label) {
        this.element.appendChild(
          utils.createElement(this.options.heading, { className: "ve-events__label" }, [this.options.label]),
        );
      }

      // Filters container
      if (this.options.showFilters) {
        this.filtersEl = utils.createElement("div", {
          className: "ve-events__filters",
        });
        this.renderFilters();
        this.element.appendChild(this.filtersEl);
      }

      // Loading banner (in-flow, between filters and grid)
      this.loadingEl = utils.createElement(
        "div",
        {
          className: "ve-events__loading",
        },
        ["Loading events..."],
      );
      this.element.appendChild(this.loadingEl);

      // Events grid container
      this.gridEl = utils.createElement("div", {
        className: "ve-events__grid",
        style: `--ve-columns: ${this.options.columns}`,
      });
      this.element.appendChild(this.gridEl);

      // Pagination container
      if (this.options.showPagination) {
        this.paginationEl = utils.createElement("div", {
          className: "ve-events__pagination",
        });
        this.element.appendChild(this.paginationEl);
      }
    }

    renderFilters() {
      this.filtersEl.innerHTML = "";

      // Top row: search + filter toggle
      const topRow = utils.createElement("div", {
        className: "ve-events__filter-row",
      });

      const searchInput = utils.createElement("input", {
        type: "text",
        className: "ve-events__search",
        placeholder: "Search events or artists...",
        value: this.filters.keyword,
      });
      searchInput.addEventListener(
        "input",
        utils.debounce((e) => {
          const next = e.target.value.trim();
          // TM's keyword search needs ~3 chars to match; skip the fetch
          // on 1–2 char inputs so the grid doesn't flash to empty.
          if (next.length > 0 && next.length < 3) return;
          if (next === this.filters.keyword) return;
          this.filters.keyword = next;
          this.currentPage = 0;
          tracking.trackSearch({
            section: "grid",
            venueId: this.options.venue,
            query: next,
          });
          this.loadEvents();
        }, 300),
      );
      topRow.appendChild(searchInput);

      // Filter toggle button (visible on mobile, icon-only)
      const filterToggle = utils.createElement("button", {
        className: "ve-events__filter-toggle",
        type: "button",
        title: "Filters",
        "aria-label": "Toggle filters",
        "aria-expanded": "false",
      });
      filterToggle.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';
      topRow.appendChild(filterToggle);

      // Expandable filter drawer (inside topRow so display:contents works on desktop)
      const drawer = utils.createElement("div", {
        className: "ve-events__filter-drawer",
      });

      filterToggle.addEventListener("click", () => {
        const isOpen = drawer.classList.toggle("ve-events__filter-drawer--open");
        filterToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        filterToggle.classList.toggle("ve-events__filter-toggle--active", isOpen);
      });

      // Venue select (if enabled and multiple filterable venues)
      if (this.options.showVenueFilter && this.options.venueFilterIds.length > 1) {
        this.venueSelect = utils.createElement(
          "select",
          {
            className: "ve-events__venue-select",
          },
          [utils.createElement("option", { value: "" }, ["All Venues"])],
        );
        this.venueSelect.addEventListener("change", (e) => {
          this.filters.venue = e.target.value;
          this.currentPage = 0;
          tracking.trackFilterChange({
            section: "grid",
            venueId: this.options.venue,
            filterType: "venue",
            filterValue: e.target.value,
          });
          this.loadEvents();
        });
        drawer.appendChild(this.venueSelect);

        this.loadVenues();
      }

      // Genre select
      this.genreSelect = utils.createElement(
        "select",
        {
          className: "ve-events__genre-select",
        },
        [utils.createElement("option", { value: "" }, ["All Genres"])],
      );
      this.genreSelect.addEventListener("change", (e) => {
        this.filters.genre = e.target.value;
        this.currentPage = 0;
        tracking.trackFilterChange({
          section: "grid",
          venueId: this.options.venue,
          filterType: "genre",
          filterValue: e.target.value,
        });
        this.loadEvents();
      });
      drawer.appendChild(this.genreSelect);

      this.loadGenres();

      // Date picker — single button with inline calendar
      const dateWrapper = utils.createElement("div", {
        className: "ve-events__date-picker",
      });

      const dateBtn = utils.createElement("button", {
        className: "ve-events__date-btn",
        type: "button",
      });
      dateBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg><span class="ve-events__date-btn-text">Date</span>';
      dateWrapper.appendChild(dateBtn);

      // Calendar dropdown
      const calDropdown = utils.createElement("div", {
        className: "ve-events__calendar-dropdown",
      });
      dateWrapper.appendChild(calDropdown);

      // Calendar state
      this._calState = {
        viewDate: new Date(),
        startDate: null,
        endDate: null,
        open: false,
      };

      dateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this._calState.open = !this._calState.open;
        calDropdown.classList.toggle("ve-events__calendar-dropdown--open", this._calState.open);
        if (this._calState.open) this._renderCalendar(calDropdown, dateBtn);
      });

      // Close calendar on outside click
      document.addEventListener("click", (e) => {
        if (this._calState.open && !dateWrapper.contains(e.target)) {
          this._calState.open = false;
          calDropdown.classList.remove("ve-events__calendar-dropdown--open");
        }
      });

      drawer.appendChild(dateWrapper);

      topRow.appendChild(drawer);
      this.filtersEl.appendChild(topRow);
    }

    _renderCalendar(container, dateBtn) {
      container.innerHTML = "";
      const state = this._calState;
      const year = state.viewDate.getFullYear();
      const month = state.viewDate.getMonth();

      // Header: prev / month-year / next
      const header = utils.createElement("div", { className: "ve-events__cal-header" });

      const prevBtn = utils.createElement("button", { type: "button", className: "ve-events__cal-nav" });
      prevBtn.textContent = "\u2039";
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.viewDate.setMonth(state.viewDate.getMonth() - 1);
        this._renderCalendar(container, dateBtn);
      });

      const title = utils.createElement("span", { className: "ve-events__cal-title" });
      title.textContent = state.viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      const nextBtn = utils.createElement("button", { type: "button", className: "ve-events__cal-nav" });
      nextBtn.textContent = "\u203A";
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.viewDate.setMonth(state.viewDate.getMonth() + 1);
        this._renderCalendar(container, dateBtn);
      });

      header.appendChild(prevBtn);
      header.appendChild(title);
      header.appendChild(nextBtn);
      container.appendChild(header);

      // Day labels
      const dayLabels = utils.createElement("div", { className: "ve-events__cal-days" });
      ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].forEach((d) => {
        const lbl = utils.createElement("span", { className: "ve-events__cal-day-label" });
        lbl.textContent = d;
        dayLabels.appendChild(lbl);
      });
      container.appendChild(dayLabels);

      // Date grid
      const grid = utils.createElement("div", { className: "ve-events__cal-grid" });
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Empty cells before first day
      for (let i = 0; i < firstDay; i++) {
        grid.appendChild(utils.createElement("span", { className: "ve-events__cal-cell ve-events__cal-cell--empty" }));
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const cellDate = new Date(year, month, d);
        const cell = utils.createElement("button", {
          type: "button",
          className: "ve-events__cal-cell",
        });
        cell.textContent = d;

        // Past dates
        if (cellDate < today) {
          cell.classList.add("ve-events__cal-cell--disabled");
          cell.disabled = true;
        }

        // Highlight selected range
        const cellStr = this._dateStr(cellDate);
        if (state.startDate && cellStr === state.startDate) {
          cell.classList.add("ve-events__cal-cell--start");
        }
        if (state.endDate && cellStr === state.endDate) {
          cell.classList.add("ve-events__cal-cell--end");
        }
        if (state.startDate && state.endDate && cellStr > state.startDate && cellStr < state.endDate) {
          cell.classList.add("ve-events__cal-cell--in-range");
        }
        if (state.startDate && !state.endDate && cellStr === state.startDate) {
          cell.classList.add("ve-events__cal-cell--single");
        }

        cell.addEventListener("click", (e) => {
          e.stopPropagation();
          this._onDateSelect(cellStr, container, dateBtn);
        });

        grid.appendChild(cell);
      }
      container.appendChild(grid);

      // Clear button
      if (state.startDate) {
        const clearBtn = utils.createElement("button", {
          type: "button",
          className: "ve-events__cal-clear",
        });
        clearBtn.textContent = "Clear dates";
        clearBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          state.startDate = null;
          state.endDate = null;
          this.filters.startDate = "";
          this.filters.endDate = "";
          this.currentPage = 0;
          this._trackDateFilterChange();
          this.loadEvents();
          dateBtn.querySelector(".ve-events__date-btn-text").textContent = "Date";
          dateBtn.classList.remove("ve-events__date-btn--active");
          this._renderCalendar(container, dateBtn);
        });
        container.appendChild(clearBtn);
      }
    }

    _onDateSelect(dateStr, container, dateBtn) {
      const state = this._calState;

      if (!state.startDate || (state.startDate && state.endDate)) {
        // First click or reset: set start
        state.startDate = dateStr;
        state.endDate = null;
        this.filters.startDate = dateStr;
        this.filters.endDate = "";
        this.currentPage = 0;
        this._trackDateFilterChange();
        this.loadEvents();
        // Update button text
        const label = this._formatShortDate(dateStr);
        dateBtn.querySelector(".ve-events__date-btn-text").textContent = label;
        dateBtn.classList.add("ve-events__date-btn--active");
      } else if (dateStr === state.startDate) {
        // Clicked same date: select single day, close
        state.endDate = dateStr;
        this.filters.endDate = dateStr;
        this.currentPage = 0;
        this._trackDateFilterChange();
        this.loadEvents();
        this._calState.open = false;
        container.parentElement.querySelector(".ve-events__calendar-dropdown").classList.remove("ve-events__calendar-dropdown--open");
      } else if (dateStr < state.startDate) {
        // Clicked before start: reset to new start
        state.startDate = dateStr;
        state.endDate = null;
        this.filters.startDate = dateStr;
        this.filters.endDate = "";
        this.currentPage = 0;
        this._trackDateFilterChange();
        this.loadEvents();
        const label = this._formatShortDate(dateStr);
        dateBtn.querySelector(".ve-events__date-btn-text").textContent = label;
      } else {
        // Second click after start: set end, close
        state.endDate = dateStr;
        this.filters.endDate = dateStr;
        this.currentPage = 0;
        this._trackDateFilterChange();
        this.loadEvents();
        const label = this._formatShortDate(state.startDate) + " – " + this._formatShortDate(dateStr);
        dateBtn.querySelector(".ve-events__date-btn-text").textContent = label;
        dateBtn.classList.add("ve-events__date-btn--active");
        this._calState.open = false;
        container.classList.remove("ve-events__calendar-dropdown--open");
      }

      this._renderCalendar(container, dateBtn);
    }

    _trackDateFilterChange() {
      const isApplied = !!(this.filters.startDate || this.filters.endDate);
      // Fire only on transitions between "no date filter" and "has date filter"
      // so range picks (two clicks) don't double-fire and refining within an
      // applied state stays quiet.
      if (isApplied === this._dateFilterApplied) return;
      this._dateFilterApplied = isApplied;
      tracking.trackFilterChange({
        section: "grid",
        venueId: this.options.venue,
        filterType: "date",
        filterValue: isApplied ? "applied" : "",
      });
    }

    _dateStr(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    _formatShortDate(dateStr) {
      const [y, m, d] = dateStr.split("-").map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    async loadGenres() {
      try {
        // Fetch a large batch of events to extract available genres
        const params = {
          size: 200, // Get up to 200 events to find all genres
          sort: "date,asc",
        };

        if (this.options.venue) {
          params.venueId = this.options.venue;
        }

        const result = await api.getEvents(params);

        // Extract unique genres from events
        const genreMap = new Map();
        result.events.forEach((event) => {
          const genre = event.classification?.genre;
          if (genre && !genreMap.has(genre)) {
            genreMap.set(genre, genre);
          }
        });

        // Sort genres alphabetically and populate dropdown
        const genres = Array.from(genreMap.values()).sort((a, b) =>
          a.localeCompare(b),
        );

        genres.forEach((genre) => {
          const option = utils.createElement(
            "option",
            {
              value: genre,
            },
            [genre],
          );
          this.genreSelect.appendChild(option);
        });

        utils.log("Loaded genres from events:", genres);
      } catch (error) {
        utils.error("Failed to load genres:", error);
      }
    }

    async loadVenues() {
      try {
        // Fetch venue details for the filterable venue IDs only
        const venuePromises = this.options.venueFilterIds.map((id) =>
          api.getVenue(id),
        );
        const venues = await Promise.all(venuePromises);

        // Cache venue data and populate dropdown
        venues.forEach((venue) => {
          if (venue && venue.id) {
            this.venueData[venue.id] = venue.name;

            const option = utils.createElement(
              "option",
              {
                value: venue.id,
              },
              [venue.name],
            );
            this.venueSelect.appendChild(option);
          }
        });

        utils.log("Loaded venues:", this.venueData);
      } catch (error) {
        utils.error("Failed to load venues:", error);
      }
    }

    async loadEvents() {
      if (this.isLoading) return;

      this.isLoading = true;
      // Only show the loading overlay if the request is slow enough to
      // notice — avoids a flash on fast keystroke-triggered searches.
      const loadingTimer = setTimeout(() => {
        this.element.classList.add("ve-events--loading");
      }, 250);

      try {
        const params = {
          size: this.options.showPagination ? this.options.limit : 200,
          page: this.currentPage,
        };

        // Use filtered venue if selected, otherwise all venues
        if (this.filters.venue) {
          params.venueId = this.filters.venue;
        } else if (this.options.venue) {
          params.venueId = this.options.venue;
        }

        if (this.filters.keyword) {
          params.keyword = this.filters.keyword;
        }

        if (this.filters.genre) {
          params.classificationName = this.filters.genre;
        }

        if (!this.filters.startDate) {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          params.localStartDateTime = `${yyyy}-${mm}-${dd}T00:00:00`;
        }

        if (this.filters.startDate) {
          params.localStartDateTime = `${this.filters.startDate}T00:00:00`;
        }

        if (this.filters.endDate) {
          params.localEndDateTime = `${this.filters.endDate}T23:59:59`;
        }

        const result = await api.getEvents(params);
        let events = result.events;

        // If promoterId is configured, fetch promoter events and merge
        if (config.promoterId) {
          try {
            const promoterParams = {
              size: params.size,
              promoterId: config.promoterId,
              sort: "date,asc",
            };
            if (this.filters.keyword) {
              promoterParams.keyword = this.filters.keyword;
            }
            if (this.filters.genre) {
              promoterParams.classificationName = this.filters.genre;
            }
            if (params.localStartDateTime) {
              promoterParams.localStartDateTime = params.localStartDateTime;
            }
            if (params.localEndDateTime) {
              promoterParams.localEndDateTime = params.localEndDateTime;
            }
            const promoterResult = await api.getEvents(promoterParams);
            events = transformers.mergeAndDeduplicate(
              events,
              promoterResult.events,
            );
          } catch (promoterError) {
            utils.error("Failed to fetch promoter events:", promoterError);
            // Continue with venue-only events
          }
        }

        // Client-side end-date filter (API doesn't reliably enforce it)
        if (this.filters.endDate) {
          events = events.filter((event) => {
            return event.date.localDate && event.date.localDate <= this.filters.endDate;
          });
        }

        this.events = events;
        this.pagination = result.pagination;

        this.renderEvents();
        this.renderPagination();
      } catch (error) {
        utils.error("Failed to load events:", error);
        this.renderError(error);
      } finally {
        clearTimeout(loadingTimer);
        this.isLoading = false;
        this.element.classList.remove("ve-events--loading");
      }
    }

    renderEvents() {
      this.gridEl.innerHTML = "";

      if (this.events.length === 0) {
        const keyword = (this.filters.keyword || "").trim();
        const message = keyword
          ? `No matches for “${keyword}”. Try the complete artist or event name — partial searches don’t always match.`
          : "No events found. Check back soon!";
        this.gridEl.appendChild(
          utils.createElement(
            "div",
            {
              className: "ve-events__empty",
            },
            [message],
          ),
        );
        tracking.trackWidgetLoaded({
          section: "grid",
          venueId: this.options.venue,
          eventCount: 0,
          filters: this.filters,
        });
        return;
      }

      this.events.forEach((event) => {
        const card = this.createEventCard(event);
        this.gridEl.appendChild(card);
      });

      tracking.trackWidgetLoaded({
        section: "grid",
        venueId: this.options.venue,
        eventCount: this.events.length,
        filters: this.filters,
      });
    }

    createEventCard(event) {
      return createCard(event, {
        section: "grid",
        showVenueLabel: this.options.showVenueLabel,
        venueShortNames: this.options.venueShortNames,
        showGenre: this.options.showGenre,
        showPrice: this.options.showPrice,
        showStatusBadges: this.options.showStatusBadges,
        modal: this.options.modal,
      }, (e) => this.showInfoModal(e));
    }

    showInfoModal(event) {
      showEventModal(event, this.element, this.options.modal, "grid");
    }

    hideInfoModal() {
      hideEventModal(this.element);
    }

    renderPagination() {
      if (!this.paginationEl || !this.pagination) return;

      this.paginationEl.innerHTML = "";

      if (this.pagination.totalPages <= 1) return;

      const { currentPage, totalPages, totalElements } = this.pagination;

      // Results count
      const count = utils.createElement(
        "span",
        {
          className: "ve-events__pagination-count",
        },
        [`Showing ${this.events.length} of ${totalElements} events`],
      );
      this.paginationEl.appendChild(count);

      const nav = utils.createElement("nav", {
        className: "ve-events__pagination-nav",
      });

      // Previous button
      const prevBtn = utils.createElement(
        "button",
        {
          className: "ve-events__pagination-btn",
          disabled: currentPage === 0,
        },
        ["← Previous"],
      );
      prevBtn.addEventListener("click", () => this.goToPage(currentPage - 1));
      nav.appendChild(prevBtn);

      // Page indicator
      const pageIndicator = utils.createElement(
        "span",
        {
          className: "ve-events__pagination-indicator",
        },
        [`Page ${currentPage + 1} of ${totalPages}`],
      );
      nav.appendChild(pageIndicator);

      // Next button
      const nextBtn = utils.createElement(
        "button",
        {
          className: "ve-events__pagination-btn",
          disabled: currentPage >= totalPages - 1,
        },
        ["Next →"],
      );
      nextBtn.addEventListener("click", () => this.goToPage(currentPage + 1));
      nav.appendChild(nextBtn);

      this.paginationEl.appendChild(nav);
    }

    goToPage(page) {
      if (page < 0 || page >= this.pagination.totalPages) return;
      this.currentPage = page;
      this.loadEvents();

      // Scroll to top of component
      this.element.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    renderError(error) {
      this.gridEl.innerHTML = "";

      const errorEl = utils.createElement(
        "div",
        {
          className: "ve-events__error",
        },
        [
          utils.createElement("p", {}, [
            "Unable to load events. Please try again later.",
          ]),
          utils.createElement(
            "button",
            {
              className: "ve-events__retry-btn",
              onClick: () => this.loadEvents(),
            },
            ["Retry"],
          ),
        ],
      );

      this.gridEl.appendChild(errorEl);
    }

    destroy() {
      hideEventModal(this.element);
      this.element.innerHTML = "";
      this.element.classList.remove(
        "ve-events",
        `ve-events--${this.options.layout}`,
      );
    }
  }

  // Register EventGrid component
  components.register("EventGrid", EventGrid);

  // ==========================================================================
  // EVENT FEATURED COMPONENT
  // ==========================================================================

  class EventFeatured {
    static selector = "[data-ve-featured]";

    constructor(element) {
      this.element = element;
      this.options = this.parseOptions();
      this.init();
    }

    parseOptions() {
      const dataset = this.element.dataset;
      let venueShortNames = null;
      if (dataset.venueShortNames) {
        try {
          venueShortNames = JSON.parse(dataset.venueShortNames);
        } catch (e) {
          utils.error("EventFeatured: failed to parse venueShortNames", e);
        }
      }
      return {
        label: dataset.label || "",
        heading: dataset.heading || "p",
        option: dataset.option || "upcoming",
        ids: dataset.ids
          ? dataset.ids.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        showStatusBadges: dataset.showStatusBadges === "true",
        venueShortNames,
      };
    }

    async init() {
      try {
        const event = await this.fetchEvent();
        if (!event) {
          tracking.trackWidgetLoaded({
            section: "featured",
            venueId: this.options.venue,
            eventCount: 0,
          });
          return;
        }
        this.render(event);
        tracking.trackWidgetLoaded({
          section: "featured",
          venueId: this.options.venue,
          eventCount: 1,
        });
      } catch (e) {
        utils.error("EventFeatured fetch failed:", e);
      }
    }

    async fetchEvent() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const localStart = `${yyyy}-${mm}-${dd}T00:00:00`;

      if (this.options.ids.length > 0) {
        const result = await api.getEvents({
          id: this.options.ids.join(","),
          size: this.options.ids.length,
          localStartDateTime: localStart,
        });
        const byId = {};
        result.events.forEach((e) => { byId[e.id] = e; });
        for (const id of this.options.ids) {
          if (byId[id]) return byId[id];
        }
        return null;
      }

      const sort = this.options.option === "recently-added"
        ? "onsaleStartDateTime,desc"
        : "date,asc";
      const result = await api.getEvents({
        size: 1,
        sort,
        localStartDateTime: localStart,
      });
      return result.events[0] || null;
    }

    render(event) {
      this.element.classList.add("ve-featured");

      // Section label
      if (this.options.label) {
        this.element.appendChild(
          utils.createElement(this.options.heading, { className: "ve-featured__label" }, [this.options.label]),
        );
      }

      // Card
      const card = utils.createElement("article", {
        className: "ve-featured__card",
        dataset: { eventId: event.id },
      });

      // Image (left panel)
      if (event.image) {
        const imageWrap = utils.createElement("div", { className: "ve-featured__image" });
        const img = utils.createElement("img", {
          src: event.image,
          alt: event.name,
          loading: "lazy",
        });
        imageWrap.appendChild(img);
        if (this.options.showStatusBadges && event.status && event.status !== "onsale") {
          const badge = utils.createElement(
            "span",
            { className: `ve-events__badge ve-events__badge--${event.status}` },
            [getStatusLabel(event.status)],
          );
          imageWrap.appendChild(badge);
        }
        card.appendChild(imageWrap);
      }

      // Info (right panel)
      const info = utils.createElement("div", { className: "ve-featured__info" });

      // Date + time row
      const meta = utils.createElement("div", { className: "ve-featured__meta" });
      meta.appendChild(
        utils.createElement(
          "time",
          {
            className: "ve-featured__date",
            datetime: event.date.dateTime || event.date.localDate,
          },
          [event.display.date],
        ),
      );
      if (!event.date.noSpecificTime && event.date.localTime) {
        let timeText = event.display.time;
        if (event.display.doorsTime) {
          timeText = "Doors: " + event.display.doorsTime;
        } else {
          const doorsOffset = config.modal.doorsOffsetMinutes;
          if (doorsOffset > 0) {
            const [h, m] = event.date.localTime.split(":").map(Number);
            const totalMin = h * 60 + m - doorsOffset;
            const doorsH = Math.floor((((totalMin % 1440) + 1440) % 1440) / 60);
            const doorsM = (((totalMin % 1440) + 1440) % 1440) % 60;
            const pad = (n) => String(n).padStart(2, "0");
            timeText = "Doors: " + utils.formatTime(`2000-01-01T${pad(doorsH)}:${pad(doorsM)}:00`);
          }
        }
        meta.appendChild(
          utils.createElement("span", { className: "ve-featured__time" }, [timeText]),
        );
      }
      info.appendChild(meta);

      // Title
      info.appendChild(
        utils.createElement("h2", { className: "ve-featured__title" }, [event.name]),
      );

      // Venue (always full name)
      if (event.venue.name) {
        const venue = utils.createElement("p", { className: "ve-featured__venue" });
        const pinIcon = utils.createElement("span", { className: "ve-events__card-venue-icon" });
        pinIcon.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
        venue.appendChild(pinIcon);
        venue.appendChild(document.createTextNode(event.venue.name));
        info.appendChild(venue);
      }

      // Age restriction
      const ageText = event.ageRestrictions &&
        (event.ageRestrictions.ageRuleDescription || event.ageRestrictions.description ||
         (event.ageRestrictions.legalAgeEnforced ? "Age Restricted" : null));
      if (ageText) {
        info.appendChild(
          utils.createElement("p", { className: "ve-featured__age-restriction" }, [ageText]),
        );
      }

      // Buttons
      const buttons = utils.createElement("div", { className: "ve-featured__buttons" });

      const trackedUrl = tracking.buildTrackedUrl(event.url);
      const cta = utils.createElement(
        "a",
        {
          className: "ve-events__card-cta",
          href: trackedUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        },
        ["Get Tickets"],
      );
      cta.addEventListener("click", () => tracking.trackTicketClick(event, trackedUrl, "featured"));
      buttons.appendChild(cta);

      if (config.modal.enabled) {
        const infoBtn = utils.createElement("button", {
          className: "ve-events__card-info-side",
          type: "button",
          title: "More info",
          "aria-label": "More information about this event",
        });
        const icon = utils.createElement("span", { className: "ve-events__card-info-icon" });
        icon.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
        infoBtn.appendChild(icon);
        if (event.venue.id) {
          const shortNames = this.options.venueShortNames;
          const label = (shortNames && shortNames[event.venue.id]) || event.venue.name;
          if (label) {
            infoBtn.appendChild(
              utils.createElement("span", { className: "ve-events__card-venue-label" }, [label]),
            );
          }
        }
        infoBtn.addEventListener("click", () => {
          tracking.trackInfoClick(event, "featured");
          showEventModal(event, this.element, config.modal, "featured");
        });
        buttons.appendChild(infoBtn);
      }

      info.appendChild(buttons);
      card.appendChild(info);
      this.element.appendChild(card);
    }

    destroy() {
      hideEventModal(this.element);
      this.element.innerHTML = "";
      this.element.classList.remove("ve-featured");
    }
  }

  // Register EventFeatured component
  components.register("EventFeatured", EventFeatured);

  // ==========================================================================
  // EVENT CURATED COMPONENT
  // ==========================================================================

  class EventCurated {
    static selector = "[data-ve-curated]";

    constructor(element) {
      this.element = element;
      this.options = this.parseOptions();
      this.init();
    }

    parseOptions() {
      const dataset = this.element.dataset;
      let venueShortNames = null;
      if (dataset.venueShortNames) {
        try {
          venueShortNames = JSON.parse(dataset.venueShortNames);
        } catch (e) {
          utils.error("EventCurated: failed to parse venueShortNames", e);
        }
      }
      const count = parseInt(dataset.count, 10) || 4;
      return {
        label: dataset.label || "",
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
        showStatusBadges: dataset.showStatusBadges === "true",
      };
    }

    async init() {
      try {
        const events = await this.fetchEvents();
        if (!events || events.length === 0) {
          tracking.trackWidgetLoaded({
            section: "curated",
            venueId: this.options.venue,
            eventCount: 0,
          });
          return;
        }
        this.render(events);
        tracking.trackWidgetLoaded({
          section: "curated",
          venueId: this.options.venue,
          eventCount: events.length,
        });
      } catch (e) {
        utils.error("EventCurated fetch failed:", e);
      }
    }

    /**
     * Best available "announced on" timestamp for an event.
     *
     * Prefers the public onsale date. Some events never get one populated and
     * carry only presale records, so fall back to the earliest presale. Returns
     * null when neither exists, so undated events can be excluded from
     * recency ordering instead of sorting to an arbitrary end of the list.
     */
    announcedAt(event) {
      const publicOnsale = event.sales?.public?.startDateTime;
      if (publicOnsale) return publicOnsale;

      const presales = (event.sales?.presales || [])
        .map((p) => p.startDateTime)
        .filter(Boolean)
        .sort();
      return presales[0] || null;
    }

    async fetchEvents() {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const localStart = `${yyyy}-${mm}-${dd}T00:00:00`;

      if (this.options.ids.length > 0) {
        const result = await api.getEvents({
          id: this.options.ids.join(","),
          size: this.options.ids.length,
          localStartDateTime: localStart,
        });
        const byId = {};
        result.events.forEach((e) => { byId[e.id] = e; });
        return this.options.ids.map((id) => byId[id]).filter(Boolean);
      }

      if (this.options.option === "recently-added") {
        // API only supports onSaleStartDate,asc, so order client-side rather
        // than reversing the response. Ticketmaster sorts events with no public
        // onsale date LAST in an ascending sort; reversing promoted exactly
        // those events to the front and billed them as the newest announcements.
        // Include presale (offsale) events too: once an event is publicly
        // announced, it should appear here even before tickets go on sale.
        const result = await api.getEvents({
          size: 200,
          sort: "onSaleStartDate,asc",
          localStartDateTime: localStart,
        });
        return result.events
          .filter((e) => this.announcedAt(e))
          .sort(
            (a, b) =>
              new Date(this.announcedAt(b)) - new Date(this.announcedAt(a)),
          )
          .slice(0, this.options.count);
      }
      const result = await api.getEvents({
        size: this.options.count,
        sort: "date,asc",
        localStartDateTime: localStart,
      });
      return result.events.slice(0, this.options.count);
    }

    render(events) {
      this.element.classList.add("ve-curated");

      if (this.options.label) {
        this.element.appendChild(
          utils.createElement(this.options.heading, { className: "ve-curated__label" }, [this.options.label]),
        );
      }

      // Slider wrapper
      const slider = utils.createElement("div", { className: "ve-curated__slider" });

      // Track
      const track = utils.createElement("div", { className: "ve-curated__track" });
      track.style.setProperty("--ve-curated-columns", this.options.columns);

      const cardOptions = {
        section: "curated",
        showVenueLabel: this.options.showVenueLabel,
        venueShortNames: this.options.venueShortNames,
        showGenre: this.options.showGenre,
        showPrice: this.options.showPrice,
        showStatusBadges: this.options.showStatusBadges,
        hidePresaleBadge: this.options.option === "recently-added",
        modal: config.modal,
      };

      events.forEach((event) => {
        track.appendChild(
          createCard(event, cardOptions, (e) => showEventModal(e, this.element, config.modal, "curated")),
        );
      });

      // Arrow buttons
      const prevBtn = utils.createElement("button", {
        className: "ve-curated__arrow ve-curated__arrow--prev",
        type: "button",
        "aria-label": "Previous",
      });
      prevBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';

      const nextBtn = utils.createElement("button", {
        className: "ve-curated__arrow ve-curated__arrow--next",
        type: "button",
        "aria-label": "Next",
      });
      nextBtn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

      // Dot indicators (page-aware: dots = total - visible + 1)
      const dotsEl = utils.createElement("div", { className: "ve-curated__dots" });
      const dots = [];

      const computeVisible = () => {
        const card = track.querySelector(".ve-events__card");
        if (!card || !track.clientWidth) return events.length;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardW = card.offsetWidth;
        if (cardW <= 0) return events.length;
        // Count whole cards that fit: N fits iff N*cardW + (N-1)*gap <= trackW
        return Math.max(1, Math.min(events.length, Math.floor((track.clientWidth + gap) / (cardW + gap))));
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

      renderDots();

      const updateIndicators = () => {
        const allVisible = track.scrollWidth <= track.clientWidth + 1;
        const atStart = track.scrollLeft <= 0;
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
        prevBtn.style.display = (allVisible || atStart) ? "none" : "";
        nextBtn.style.display = (allVisible || atEnd) ? "none" : "";
        dotsEl.style.display = allVisible ? "none" : "";

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
      };

      const scrollAmount = () => {
        const card = track.querySelector(".ve-events__card");
        return card ? card.offsetWidth + 16 : 280;
      };

      prevBtn.addEventListener("click", () => {
        track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
      });
      nextBtn.addEventListener("click", () => {
        track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
      });
      track.addEventListener("scroll", updateIndicators);

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

    destroy() {
      hideEventModal(this.element);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      this.element.innerHTML = "";
      this.element.classList.remove("ve-curated");
    }
  }

  // Register EventCurated component
  components.register("EventCurated", EventCurated);

  // ==========================================================================
  // AUTO-INITIALIZATION FROM DATA ATTRIBUTES
  // ==========================================================================

  /**
   * Detect configuration from data attributes on widget elements
   * This allows zero-JS configuration for end users
   */
  function autoDetectConfig() {
    const widgets = document.querySelectorAll("[data-venue-events]");

    if (widgets.length === 0) return null;

    const first = widgets[0];
    const dataset = first.dataset;

    // Build config from data attributes
    const detectedConfig = {};

    if (dataset.apiKey) {
      detectedConfig.apiKey = dataset.apiKey;
    }

    if (dataset.venueId) {
      detectedConfig.venues = dataset.venueId
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    }

    if (dataset.limit) {
      detectedConfig.defaultLimit = parseInt(dataset.limit, 10) || 12;
    }

    if (dataset.debug === "true") {
      detectedConfig.debug = true;
    }

    // Promoter ID
    if (dataset.promoterId) {
      detectedConfig.promoterId = dataset.promoterId;
    }

    // Proxy URL
    if (dataset.proxyUrl) {
      detectedConfig.proxyUrl = dataset.proxyUrl;
    }

    // Excluded events (comma-separated ids or ticketmaster.com event URLs)
    if (dataset.excludeEvents) {
      detectedConfig.excludeEvents = utils.parseExcludeEvents(
        dataset.excludeEvents,
      );
    }

    // Theme from data attributes
    const themeAttrs = {};
    if (dataset.themePrimary) themeAttrs["--ve-primary"] = dataset.themePrimary;
    if (dataset.themePrimaryHover)
      themeAttrs["--ve-primary-hover"] = dataset.themePrimaryHover;
    if (dataset.themeBg) themeAttrs["--ve-background"] = dataset.themeBg;
    if (Object.keys(themeAttrs).length > 0) {
      detectedConfig.theme = themeAttrs;
    }

    // Tracking config from data attributes
    if (
      dataset.tracking === "true" ||
      dataset.utmSource ||
      dataset.utmMedium ||
      dataset.utmCampaign
    ) {
      detectedConfig.tracking = {};
      if (dataset.tracking === "true") {
        detectedConfig.tracking.enabled = true;
      }
      if (dataset.utmSource) {
        detectedConfig.tracking.utmSource = dataset.utmSource;
      }
      if (dataset.utmMedium) {
        detectedConfig.tracking.utmMedium = dataset.utmMedium;
      }
      if (dataset.utmCampaign) {
        detectedConfig.tracking.utmCampaign = dataset.utmCampaign;
      }
    }

    // Modal config from data attributes
    if (
      dataset.modalEnabled !== undefined ||
      dataset.modalSections ||
      dataset.modalTimeDisplay ||
      dataset.modalShowVenueCity !== undefined ||
      dataset.modalShowVenueAddress !== undefined ||
      dataset.modalStartTimeLabel ||
      dataset.modalDoorsOffsetMinutes
    ) {
      detectedConfig.modal = {};
      if (dataset.modalEnabled !== undefined) {
        detectedConfig.modal.enabled = dataset.modalEnabled !== "false";
      }
      if (dataset.modalSections) {
        detectedConfig.modal.sections = dataset.modalSections
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (dataset.modalTimeDisplay) {
        detectedConfig.modal.timeDisplay = dataset.modalTimeDisplay;
      }
      if (dataset.modalShowVenueCity !== undefined) {
        detectedConfig.modal.showVenueCity =
          dataset.modalShowVenueCity !== "false";
      }
      if (dataset.modalShowVenueAddress !== undefined) {
        detectedConfig.modal.showVenueAddress =
          dataset.modalShowVenueAddress !== "false";
      }
      if (dataset.modalStartTimeLabel) {
        detectedConfig.modal.startTimeLabel = dataset.modalStartTimeLabel;
      }
      if (dataset.modalDoorsOffsetMinutes) {
        detectedConfig.modal.doorsOffsetMinutes =
          parseInt(dataset.modalDoorsOffsetMinutes, 10) || 0;
      }
    }

    return detectedConfig;
  }

  /**
   * Auto-initialize when DOM is ready
   */
  function autoInit() {
    const detectedConfig = autoDetectConfig();

    if (detectedConfig && (detectedConfig.apiKey || detectedConfig.proxyUrl)) {
      VenueEvents.init(detectedConfig);
    }
  }

  // ==========================================================================
  // PUBLIC API
  // ==========================================================================

  const VenueEvents = {
    /**
     * Initialize the library with configuration
     */
    init(userConfig = {}) {
      config = {
        ...DEFAULT_CONFIG,
        ...userConfig,
        cacheDuration: {
          ...DEFAULT_CONFIG.cacheDuration,
          ...(userConfig.cacheDuration || {}),
        },
        tracking: {
          ...DEFAULT_CONFIG.tracking,
          ...(userConfig.tracking || {}),
        },
        modal: { ...DEFAULT_CONFIG.modal, ...(userConfig.modal || {}) },
      };

      if (!config.apiKey && !config.proxyUrl) {
        utils.error(
          'API key or proxy URL is required. Set via VenueEvents.init({ apiKey: "..." }) or { proxyUrl: "..." }',
        );
        return;
      }

      utils.log("Initialized with config:", config);

      // Auto-initialize components when DOM is ready
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          components.initAll(),
        );
      } else {
        components.initAll();
      }
    },

    /**
     * Manually refresh all components
     */
    refresh() {
      components.destroyAll();
      components.initAll();
    },

    /**
     * Clear all cached data
     */
    clearCache() {
      const keys = Object.keys(localStorage).filter((k) =>
        k.startsWith("ve_events_"),
      );
      keys.forEach((k) => localStorage.removeItem(k));
      utils.log("Cache cleared");
    },

    /**
     * Direct API access
     */
    api,

    /**
     * Tracking / data layer
     */
    tracking,

    /**
     * Utility functions
     */
    utils,

    /**
     * Component registry
     */
    components,

    /**
     * Current configuration
     */
    get config() {
      return { ...config };
    },
  };

  // Expose globally
  global.VenueEvents = VenueEvents;

  // Auto-initialize when DOM is ready if widgets are present with API key
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    // DOM already loaded, try to auto-init immediately
    autoInit();
  }
})(typeof window !== "undefined" ? window : this);


  // 3. Bootstrap: set per-element defaults, then init
  var API_KEY = window.SALTSHED_API_KEY;

  // Events to hide on every surface (grid, featured, curated). Two ways to set:
  //   1. On the events grid element in a Squarespace Code Block:
  //        <div data-venue-events data-exclude-events="0400652BB8ACB1CF, 0400643BF736AC2E"></div>
  //   2. In Code Injection, next to the API key:
  //        <script>window.SALTSHED_EXCLUDE_EVENTS = ['https://www.ticketmaster.com/event/0400652BB8ACB1CF'];</script>
  // Entries may be the id from a ticketmaster.com/event/<ID> link, a full
  // ticketmaster.com or ticketweb.com event link, or a Discovery API id.
  // Comma-separated strings and arrays are both accepted; both sources merge.
  function parseExcludeList(value) {
    var list = Array.isArray(value) ? value : String(value || '').split(',');
    return list.map(function (s) { return String(s || '').trim(); }).filter(Boolean);
  }

  function collectExcludeEvents() {
    var list = parseExcludeList(window.SALTSHED_EXCLUDE_EVENTS);
    document.querySelectorAll('[data-venue-events], [data-ve-featured], [data-ve-curated]').forEach(function (el) {
      list = list.concat(parseExcludeList(el.dataset.excludeEvents));
    });
    return list;
  }

  function bootstrap() {
    var venueShortNames = {
      'KovZ917AI5F': 'Shed',
      'rZ7HnEZ17pa4z': 'Shed',
      'KovZ917Amf0': 'Fairgrounds',
      'rZ7HnEZ17qokf': 'Fairgrounds',
      'rZ7HnEZ17_oxd': 'Salt Shed',      // "1357 N Elston Ave" (Elston Skate Club)
      'rZ7HnEZ17qAZK': 'Three Top',      // Move at the Shed
      'rZ7HnEZ17qvqS': 'Rooftop',        // "Premium Rooftop" (Move at the Shed)
      'rZ7HnEZ17qvrd': 'Fairgrounds'     // "Outdoor Fairgrounds Stage" (Move at the Shed)
    };
    var venueShortNamesJson = JSON.stringify(venueShortNames);

    document.querySelectorAll('[data-ve-featured]').forEach(function (el) {
      if (!el.dataset.heading) el.dataset.heading = 'h2';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = venueShortNamesJson;
    });

    document.querySelectorAll('[data-ve-curated]').forEach(function (el) {
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      if (!el.dataset.option) el.dataset.option = 'upcoming';
      if (!el.dataset.count) el.dataset.count = '5';
      if (!el.dataset.columns) el.dataset.columns = '3';
      if (!el.dataset.showVenueLabel) el.dataset.showVenueLabel = 'true';
      if (!el.dataset.venueShortNames) el.dataset.venueShortNames = venueShortNamesJson;
    });

    document.querySelectorAll('[data-venue-events]').forEach(function (el) {
      el.dataset.columns = '4';
      if (!el.dataset.heading) el.dataset.heading = 'h3';
      el.dataset.showFilters = 'true';
      el.dataset.showVenueFilter = 'true';
      // Dropdown lists Shed + Fairgrounds only; micro-venue events still
      // appear in the grid under "All Venues".
      el.dataset.venueFilterIds = 'KovZ917AI5F,KovZ917Amf0';
      el.dataset.showVenueLabel = 'true';
      el.dataset.showPrice = 'false';
      el.dataset.showPagination = 'false';
      el.dataset.venueShortNames = venueShortNamesJson;
    });

    VenueEvents.init({
      apiKey: API_KEY,
      venues: [
        'KovZ917AI5F',   // The Salt Shed Indoors (Shed)
        'KovZ917Amf0',   // The Salt Shed Outdoors (Fairgrounds)
        'rZ7HnEZ17_oxd', // 1357 N Elston Ave
        'rZ7HnEZ17qAZK', // Three Top (NOT Three Top Lounge rZ7HnEZ17_Skd)
        'rZ7HnEZ17qvqS', // Premium Rooftop
        'rZ7HnEZ17qvrd'  // Outdoor Fairgrounds Stage
      ],
      excludedArtists: ['Oliver Tree'],
      excludeEvents: collectExcludeEvents(),
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
