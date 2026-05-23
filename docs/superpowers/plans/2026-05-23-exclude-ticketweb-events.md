# Exclude TicketWeb Events: Loader-Side Staging — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stage a commented-out `excludeProviders: ['ticketweb']` option inside the `VenueEvents.init({...})` call in `venues/salt-shed.js`, with a TODO that documents the missing widget capability and the activation steps. Ships no behavior change today; flips on with a one-line uncomment plus a `VERSION` bump once the widget repo ships the feature.

**Architecture:** Single-file edit. The loader (`venues/salt-shed.js`) is a vanilla JS bundle served via GitHub Pages that configures and initializes the widget. The change is a comment block inside the existing `init({...})` options object — no new code paths, no DOM observers, no proxy rewiring. The widget repo work is explicitly out of scope.

**Tech Stack:** Vanilla JS loader. No build, no test framework. Verification is `node --check` for parse correctness plus a local browser smoke test against `demos/saltshed.html`.

**Spec:** `docs/superpowers/specs/2026-05-23-exclude-ticketweb-events-design.md`

**Repo:** `/home/wolf/wolfazoid/16oc-events-deploy` (this repo only — no sibling widget repo work).

**Pre-existing working-tree state to be aware of:** `venues/salt-shed.js` already has one unrelated uncommitted change (a `watchFilterActivity();` call added by another in-progress task). **Do not** stage or commit that line as part of this plan. Use targeted `git add` and the patch-mode workflow described in Task 1, Step 7. Verify with `git diff --cached` before committing.

---

## Task 1: Add staged `excludeProviders` comment to the `init` call

**Files:**
- Modify: `venues/salt-shed.js:76-92` (the `VenueEvents.init({...})` call)

- [ ] **Step 1: Confirm repo state and current branch**

Run:

```bash
cd /home/wolf/wolfazoid/16oc-events-deploy
git status
```

Expected: on branch `feat/top-filter-bar` (or whichever branch the user is developing on), with at least the pre-existing modification to `venues/salt-shed.js` already in the working tree. Do not attempt to clean this up.

- [ ] **Step 2: Read the current `init` call to anchor on exact whitespace**

Read `venues/salt-shed.js`, lines 76–92. The block today looks like:

```javascript
    VenueEvents.init({
      apiKey: API_KEY,
      venues: ['KovZ917AI5F', 'KovZ917Amf0'],
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
        showVenueCity: false,
      }
    });
```

Indentation is 6 spaces for top-level option keys. Match it exactly.

- [ ] **Step 3: Insert the staged comment block between `tracking` and `modal`**

Use the Edit tool. Replace this exact old string:

```javascript
      tracking: {
        enabled: true,
        utmSource: 'saltshed-website',
        utmMedium: 'widget',
        utmCampaign: 'events'
      },
      modal: {
```

With this new string:

```javascript
      tracking: {
        enabled: true,
        utmSource: 'saltshed-website',
        utmMedium: 'widget',
        utmCampaign: 'events'
      },
      // TODO(ticketweb-exclude): client wants TicketWeb-hosted events hidden on
      // every surface (grid, featured, curated). The widget does not yet expose
      // an exclusion option. When ticketmaster-venue-widget ships this, bump
      // VERSION above and uncomment the line below. The final option name is
      // owned by the widget repo — confirm it matches before uncommenting.
      // excludeProviders: ['ticketweb'],
      modal: {
```

- [ ] **Step 4: Parse-check the file**

Run:

```bash
node --check /home/wolf/wolfazoid/16oc-events-deploy/venues/salt-shed.js
```

Expected: no output, exit code 0. If you see a `SyntaxError`, the comment block was inserted in the wrong place (e.g. between a key and its value rather than between two top-level keys). Re-read the file and re-apply the edit.

- [ ] **Step 5: Confirm the diff is exactly the comment block, nothing else**

Run:

```bash
git diff venues/salt-shed.js
```

Expected: the diff shows only added lines — the six `// ...` lines from Step 3 — plus the pre-existing `+    watchFilterActivity();` line that was already in the working tree before this task started. **No deleted lines.** No changes to indentation of surrounding lines. If anything else changed, revert with `git checkout -p venues/salt-shed.js` and redo Step 3.

- [ ] **Step 6: Browser smoke test (optional but recommended)**

If a Salt Shed demo is set up locally, open `demos/saltshed.html` in a browser with a valid TM API key and confirm the page renders identically to before — same event count, same featured hero, same curated strip, no console errors. Skip if no local demo is configured; the parse check in Step 4 is sufficient to ship.

- [ ] **Step 7: Stage only the comment block, not the pre-existing change**

The working tree contains a pre-existing `watchFilterActivity();` line in `venues/salt-shed.js` that is unrelated to this plan. Use `git add -p` to stage *only* the new TODO comment block:

```bash
git add -p venues/salt-shed.js
```

When prompted for each hunk:
- The hunk containing the six `// TODO(ticketweb-exclude)...` lines → answer `y`.
- The hunk containing `+    watchFilterActivity();` → answer `n`.

If the two changes appear in the same hunk, split it with `s`, then `y`/`n` the resulting smaller hunks.

Verify with:

```bash
git diff --cached venues/salt-shed.js
```

Expected: only the six-line comment block in the staged diff. The `watchFilterActivity();` line must NOT appear in `--cached`; it should still appear in unstaged `git diff venues/salt-shed.js`.

- [ ] **Step 8: Commit**

Run:

```bash
git commit -m "$(cat <<'EOF'
chore: stage commented excludeProviders option for TicketWeb exclusion

Adds a TODO + commented-out excludeProviders: ['ticketweb'] line inside
the VenueEvents.init({...}) call. No behavior change today. Activates
with a one-line uncomment and VERSION bump once the widget supports
provider exclusion. See docs/superpowers/specs/2026-05-23-exclude-ticketweb-events-design.md.
EOF
)"
```

Expected: commit succeeds. `git log --oneline -1` shows the new commit.

- [ ] **Step 9: Final verification**

Run:

```bash
git show HEAD --stat
```

Expected: exactly one file in the commit — `venues/salt-shed.js` — with `+6` lines added and `0` deleted. If anything else is in the commit (e.g. the `watchFilterActivity();` line slipped through), reset the commit with `git reset --soft HEAD~1`, unstage everything (`git reset venues/salt-shed.js`), and redo Step 7.

---

## Done criteria

- `venues/salt-shed.js` contains the six-line `// TODO(ticketweb-exclude): ...` comment block immediately after the `tracking: {...}` option.
- `node --check venues/salt-shed.js` passes.
- The commit on HEAD touches only `venues/salt-shed.js` with exactly six added lines and no deletions.
- The pre-existing `watchFilterActivity();` modification remains uncommitted in the working tree, untouched.
- No widget release. No `VERSION` bump. No user-visible change on the Salt Shed site after deploy.

## Activation later (not part of this plan)

When the widget repo ships provider exclusion:

1. Confirm the option name the widget chose. If it differs from `excludeProviders`, update the TODO and the commented line accordingly.
2. Bump `VERSION` in `venues/salt-shed.js` to the new widget release.
3. Remove the leading `// ` from the `excludeProviders: ['ticketweb'],` line.
4. Update or remove the TODO comment.
5. Commit, push, and verify on the live Salt Shed site that TicketWeb events no longer appear on the grid, featured, or curated surfaces.
