#!/usr/bin/env node
/**
 * Assemble the self-contained Salt Shed bundle that gets uploaded to
 * Squarespace (served at https://www.saltshedchicago.com/s/salt-shed.js).
 *
 * Parts live in bundle/salt-shed/ and are concatenated verbatim:
 *   01-styles.js    — injects base widget CSS + Salt Shed theme via <style>
 *   02-runtime.js   — widget runtime (a fork of ticketmaster-venue-widget
 *                     src/index.js carrying changes not yet published upstream)
 *   03-bootstrap.js — per-element defaults + VenueEvents.init() for Salt Shed
 *
 * Usage:  node scripts/build-salt-shed-bundle.js [--out sites/salt-shed.js]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PARTS = path.join(ROOT, 'bundle', 'salt-shed');
const outArg = process.argv.indexOf('--out');
const OUT = path.resolve(ROOT, outArg > -1 ? process.argv[outArg + 1] : 'sites/salt-shed.js');

const read = (name) => fs.readFileSync(path.join(PARTS, name), 'utf8');
const now = new Date();

const header = `/**
 * Salt Shed Events Widget — self-contained bundle
 * Built: ${now.toISOString()}
 * Build date: ${now.toISOString().slice(0, 10)}
 *
 * Contents: base widget CSS + Salt Shed theme CSS + widget runtime + bootstrap.
 * Reads API key from window.SALTSHED_API_KEY at runtime.
 */
`;

const bundle =
  header +
  '(function () {\n' +
  read('01-styles.js') +
  '  // 2. Widget runtime (inlined from widget/index.js)\n' +
  read('02-runtime.js') +
  read('03-bootstrap.js') +
  '})();\n';

fs.writeFileSync(OUT, bundle);
const kb = (Buffer.byteLength(bundle) / 1024).toFixed(1);
console.log(`Built ${path.relative(ROOT, OUT)} (${kb} KB)`);
