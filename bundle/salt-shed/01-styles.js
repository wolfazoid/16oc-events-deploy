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

