/**
 * Archetype-inherent conversion script.
 *
 * Usage: node scripts/convert-archetype-inherents.cjs --dataset=<id>
 *
 * ## The gap this closes
 *
 * A server can put an archetype's signature power in `Inherent.Inherent`
 * instead of in a powerset, auto-issue it, and gate it on the archetype's
 * class. Thunderspy does exactly that with the Stalker's **Hide** and
 * **Placate** — and then reuses the vacated powerset name slots for other
 * powers (`Stalker_Defense.Ninjitsu.Hide` holds Quick Recovery,
 * `Stalker_Melee.Ninja_Sword.Placate` holds The Lotus Drops).
 *
 * Nothing in the planner picked those up. `convert-powerset.cjs` only walks
 * the powerset categories, and the archetype-inherent list in
 * `datasets/homecoming/levels.ts` is hand-written — it covers the two
 * Kheldians and nobody else. So on Thunderspy both powers were reachable
 * from no screen at all: not in the powerset picker (the slots show the
 * repurposed powers under their own names), and not in the inherent list.
 *
 * ## The selection rule
 *
 * Derived, not a name list — a fork that moves another power the same way is
 * picked up with no edit here. A member of `<dataset>/inherent/inherent/` is
 * kept when ALL of:
 *
 *   1. `auto_issue` — the server hands it over; the player never picks it.
 *   2. `requires` gates on player archetype classes ONLY, per that dataset's
 *      own class catalogue (`derivePlayerArchetypes`). This is what keeps out
 *      the NPC classes and the dead legacy variants (`Class_BlasterOLD`'s four
 *      Defiance copies) that also sit in this directory.
 *   3. `boosts_allowed` is non-empty. A power a build can slot is a power a
 *      build can see. This is the discriminator that drops the meter/dampen/
 *      mode machinery — `Domination_Meter`, `Rage_Dampen`,
 *      `Primal_Energy_Meter`, `Vigilance_PerTeamEndAdjustment` — which share
 *      their archetype inherent's display name and are engine bookkeeping, not
 *      picks. Every one of them carries an empty `boosts_allowed`.
 *   4. No powerset in this dataset already displays that name. Note the key:
 *      DISPLAY name, not internal name. Thunderspy's powerset layer does carry
 *      `internalName: "Hide"` — pointing at Quick Recovery — so an
 *      internal-name check reproduces the very collision this script exists to
 *      see past.
 *   5. It isn't already handed out by `GRANTED_POWER_GROUPS`. The Kheldian
 *      form attacks (`Bright_Nova_Blast`, `Black_Dwarf_Strike`, …) live in
 *      `Inherent.Inherent` too and reach the build through their form toggle;
 *      emitting them here would double every one of them.
 *
 * On the three shipped datasets this keeps 10 powers, all Thunderspy:
 * Stalker Hide + Placate, four Peacebringer travel toggles, four Warshade
 * teleports. Homecoming and Rebirth keep zero — they grant these from
 * powersets, so rule 4 rejects them, which is the answer that makes this
 * emit safe to merge into the shared hand-written list unconditionally.
 *
 * ## Levels
 *
 * `available_level` is read straight through — it is the authority, not a
 * guess. Homecoming's export says 9 for Combat Flight and Shadow Recall (the
 * L10 unlocks) and 0 for Energy Flight and Shadow Step, which is exactly what
 * the hand-written Kheldian list encodes. Thunderspy's says 0 for all ten, so
 * on that fork they really are granted from level 1.
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');
const { derivePlayerArchetypes } = require('./_player-classes.cjs');
const { convertPower } = require('./convert-powerset.cjs');

const datasetId = parseDatasetArg();

const RAW_DATA_BASE = path.join(__dirname, '../exported_powers');
const RAW_DATA_PATH =
  datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_DATA_BASE, datasetId))
    ? RAW_DATA_BASE
    : path.join(RAW_DATA_BASE, datasetId);

const INHERENT_DIR = path.join(RAW_DATA_PATH, 'inherent', 'inherent');
const TABLES_DIR = path.join(RAW_DATA_PATH, 'tables');
const OUTPUT_FILE = datasetPath(datasetId, 'generated', 'archetype-inherents.ts');

/**
 * Archetype ids this dataset actually registers, so a class stem that maps to
 * no archetype is a loud failure rather than a silently dropped power. Read
 * from the registry's own top-level keys — `archetypes.ts` is generated, so a
 * new archetype flows through without an edit here.
 */
function registeredArchetypeIds() {
  const src = fs.readFileSync(datasetPath(datasetId, 'archetypes.ts'), 'utf-8');
  const body = src.slice(src.indexOf('export const ARCHETYPES'));
  return new Set([...body.matchAll(/^ {2}'?([a-z0-9_-]+)'?: \{/gm)].map((m) => m[1]));
}

/** Class stem (`arachnos_soldier`) → archetype id (`arachnos-soldier`). */
function archetypeIdForClass(stem, registered) {
  for (const candidate of [stem, stem.replace(/_/g, '-')]) {
    if (registered.has(candidate)) return candidate;
  }
  return undefined;
}

/** Every display name this dataset's powerset layer already shows. */
function powersetDisplayNames() {
  const root = datasetPath(datasetId, 'generated', 'powersets');
  const names = new Set();
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.ts') || entry.name === 'index.ts') continue;
      const match = fs.readFileSync(full, 'utf-8').match(/"name":\s*"([^"]+)"/);
      if (match) names.add(match[1].toLowerCase());
    }
  })(root);
  return names;
}

/**
 * Every power name `GRANTED_POWER_GROUPS` already routes into a build, parent
 * and child alike. Datasets that re-export Homecoming's groups resolve to
 * Homecoming's — matching what the app actually loads.
 */
function grantedPowerNames(id = datasetId) {
  const src = fs.readFileSync(datasetPath(id, 'granted-powers.ts'), 'utf-8');
  if (id !== 'homecoming' && /from ['"][^'"]*homecoming/.test(src)) {
    return grantedPowerNames('homecoming');
  }
  const names = new Set();
  for (const group of src.matchAll(/grantedPowers:\s*\[([^\]]*)\]/g)) {
    for (const name of group[1].matchAll(/'([^']+)'/g)) names.add(name[1].toLowerCase());
  }
  for (const parent of src.matchAll(/parentPower:\s*'([^']+)'/g)) names.add(parent[1].toLowerCase());
  return names;
}

/**
 * Slot ceiling, reading an explicit `max_boosts: 0` as the zero it is.
 *
 * `convert-powerset.cjs` computes `powerJson.max_boosts || 6`, which folds a
 * stated 0 into the 6-slot default because 0 is falsy. That is wrong for the
 * powers this script emits and wrong in a user-visible way: Thunderspy's
 * Placate states `max_boosts: 0` — it cannot be slotted — while its Hide omits
 * the field and takes the 6-slot default. The bug report that started this work
 * said exactly that ("Hide can be slotted, placate cannot"), so the export and
 * the player agree and only the `||` disagrees.
 *
 * The pool and epic-pool converters already read it correctly
 * (`max_boosts !== undefined && !== null ? max_boosts : 6`); this matches them.
 * The powerset converter's copy is left alone deliberately — 554 Thunderspy
 * powers state a 0 alongside a non-empty `boosts_allowed`, so correcting it
 * there is its own change with its own verification, not a side effect of this
 * one.
 */
function resolveMaxSlots(json, power) {
  if (!power.allowedEnhancements?.length) return 0;
  return json.max_boosts === undefined || json.max_boosts === null ? 6 : json.max_boosts;
}

function selectPowers() {
  if (!fs.existsSync(INHERENT_DIR)) {
    throw new Error(
      `No inherent export at ${INHERENT_DIR}. Re-run the bin-crawler for "${datasetId}" ` +
        'before this converter — an empty emit here would silently un-grant every power ' +
        'this file owns.',
    );
  }
  const registered = registeredArchetypeIds();
  const playerClasses = new Set(derivePlayerArchetypes(TABLES_DIR));
  const alreadyShown = powersetDisplayNames();
  const alreadyGranted = grantedPowerNames();

  const byArchetype = new Map();
  const files = fs
    .readdirSync(INHERENT_DIR)
    .filter((f) => f.endsWith('.json') && f !== 'index.json')
    .sort();

  for (const file of files) {
    const json = JSON.parse(fs.readFileSync(path.join(INHERENT_DIR, file), 'utf-8'));

    if (!json.auto_issue) continue; // 1
    const classes = [...String(json.requires || '').matchAll(/@Class_([A-Za-z0-9_-]+)/g)].map(
      (m) => m[1].toLowerCase(),
    );
    if (!classes.length || !classes.every((c) => playerClasses.has(c))) continue; // 2
    if (!Array.isArray(json.boosts_allowed) || !json.boosts_allowed.length) continue; // 3
    if (alreadyShown.has(String(json.display_name).toLowerCase())) continue; // 4
    if (alreadyGranted.has(String(json.name).toLowerCase())) continue; // 5

    for (const stem of classes) {
      const archetypeId = archetypeIdForClass(stem, registered);
      if (!archetypeId) {
        throw new Error(
          `${file} gates on player class "${stem}", which matches no archetype in ` +
            `${datasetId}'s registry. Reconcile the class catalogue and the archetype ` +
            'registry before emitting — dropping it would hide the power silently.',
        );
      }
      const power = convertPower(json, json.available_level, archetypeId, 'inherent');
      // Auto-issued and un-removable, and grouped under the expanded
      // "<AT> Inherent" heading rather than the collapsed Basic one — an
      // archetype power the server hands you is not discoverable down there.
      power.isLocked = true;
      power.category = 'archetype';
      power.fullName = json.full_name;
      power.maxSlots = resolveMaxSlots(json, power);
      if (!byArchetype.has(archetypeId)) byArchetype.set(archetypeId, []);
      byArchetype.get(archetypeId).push(power);
    }
  }

  for (const powers of byArchetype.values()) {
    powers.sort((a, b) => a.available - b.available || a.internalName.localeCompare(b.internalName));
  }
  return byArchetype;
}

function emit(byArchetype) {
  const entries = [...byArchetype.entries()].sort(([a], [b]) => a.localeCompare(b));
  const total = entries.reduce((n, [, powers]) => n + powers.length, 0);

  const body = entries
    .map(([archetypeId, powers]) => `  '${archetypeId}': ${JSON.stringify(powers, null, 2).replace(/\n/g, '\n  ')},`)
    .join('\n');

  const summary = entries.length
    ? entries.map(([id, powers]) => ` *   ${id}: ${powers.map((p) => p.name).join(', ')}`).join('\n')
    : ' *   (none — every archetype inherent on this server is already reachable)';

  const content = `/**
 * Archetype inherents — GENERATED LAYER
 * AUTO-GENERATED by \`node scripts/convert-archetype-inherents.cjs --dataset=${datasetId}\`.
 * Do not hand-edit.
 *
 * Auto-issued, archetype-gated powers that live in this server's
 * \`Inherent.Inherent\` set and are reachable from nowhere else — not from a
 * powerset, not from a granted-power group. See the converter's header for the
 * full selection rule and why each clause is there.
 *
 * ${total} power(s):
${summary}
 */

import type { InherentPowerDef } from '@/data/datasets/homecoming/levels';

export const GENERATED_ARCHETYPE_INHERENTS: Record<string, InherentPowerDef[]> = {
${body}
};
`;

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, content);
  console.log(`Wrote ${OUTPUT_FILE} — ${total} power(s) across ${entries.length} archetype(s)`);
  for (const [id, powers] of entries) {
    console.log(`  ${id}: ${powers.map((p) => `${p.name} (L${p.available + 1})`).join(', ')}`);
  }
}

if (require.main === module) {
  emit(selectPowers());
}

module.exports = { selectPowers };
