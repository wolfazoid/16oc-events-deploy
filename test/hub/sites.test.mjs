import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { SITES, getSite } from "../../worker/src/sites.js";
const baseline = createRequire(import.meta.url)("../../baseline/profiles.js");

const idsOf = (requests, key) =>
  new Set(requests.flatMap((r) => (r.params[key] || "").split(",")).filter(Boolean));

test("site ids are exactly the in-scope touchpoints", () => {
  assert.deepEqual(Object.keys(SITES).sort(), ["cahn", "emptybottle", "saltshed", "sixteenoc", "space", "thalia"]);
});

test("each site queries the same venue and promoter ids as the live widget", () => {
  for (const id of Object.keys(SITES)) {
    for (const key of ["venueId", "promoterId"]) {
      assert.deepEqual(idsOf(SITES[id].requests, key), idsOf(baseline[id].requests, key), `${id} ${key}`);
    }
  }
});

test("sources match the live widget where it sets one", () => {
  assert.equal(SITES.thalia.requests[0].params.source, "ticketweb");
  assert.equal(SITES.emptybottle.requests[0].params.source, "ticketmaster,ticketweb");
});

test("getSite returns null for unknown or out-of-scope ids", () => {
  assert.equal(getSite("promontory"), null);
  assert.equal(getSite("__proto__"), null);
  assert.equal(getSite("saltshed").keyBinding, "TM_KEY_SALTSHED");
});
