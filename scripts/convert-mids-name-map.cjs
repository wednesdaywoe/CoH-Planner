/**
 * Mids internal name → this dataset's internal name, per powerset (DATA-GAP MBDIMPORT-2).
 *
 * A `.mbd` names a power by its INTERNAL name and nothing else, and that namespace has
 * drifted: HC has rotated internal names underneath stable display names. Tactical Arrow's
 * `Gymnastics` is Oil Slick Arrow in the game data now, and the power the game displays as
 * "Gymnastics" is internally `Quickness`. Stalker Shield Defense is a clean three-cycle.
 * An importer that trusts an exact internal-name match therefore binds the wrong power
 * SILENTLY — the name it was handed does exist, it just means something else.
 *
 * The join is the DISPLAY name AND the unlock level together, and it takes both. Display
 * is the half that stayed put through every one of these reworks — Mids' `Lightning_Field`
 * carries Regeneration/Endurance/Damage and displays "Dynamo", and ours displaying "Dynamo"
 * is internally `Lightning_Clap`, the toggle DoT aura. Only the display name says so.
 *
 * But HC reuses display names too, so display alone mints false rows. Ninjitsu's old
 * Blinding Powder is called "Smoke Flash" now, which pairs it with Mids' unrelated Smoke
 * Flash — a coincidence that would have moved a real power's slots.
 *
 * The unlock level breaks that tie, and only that tie. A row is withdrawn when the power
 * it targets is already accounted for: Mids has a power of that exact internal name AND
 * the two unlock at the same level, which is an identity no display coincidence outranks.
 * Ninjitsu's `Blinding_Powder` is level 28 on both sides, so ours is spoken for and the
 * row goes. Willpower's `Reconstruction` is level 4 in Mids and 28 here — same spelling,
 * different power — so nothing is accounted for and the row stands.
 *
 * Deliberately a tie-breaker rather than a second gate. Requiring level agreement on every
 * row costs six real ones on Homecoming alone, because Mids' level for a granted power is
 * 0 where the export says 1, and because a fork's Mids database lags HC's own level moves.
 * Evidence AGAINST a pairing is what should withdraw it; absence of confirmation is not.
 *
 * Reading Mids here is not a Rule 0 breach. The question is not a game fact — it is what
 * Mids calls a power, and Mids is the sole authority on its own namespace. The export
 * cannot answer it, which is why the hand table this replaces (`MIDS_NAME_TYPOS`) existed
 * at all. Deriving it means the next HC rework flows through a regeneration instead of
 * waiting for a user to notice their slots landed on the wrong power.
 *
 * A row is emitted only where the display join lands on a DIFFERENT internal name than
 * the one Mids used. Names that already agree need no row, and names whose display has no
 * counterpart here (a power HC removed) get none either — those fall through to the
 * matcher's own ladder and, failing that, to a warning, which is the honest outcome.
 *
 * Usage:
 *   node scripts/convert-mids-name-map.cjs --dataset homecoming
 *   node scripts/convert-mids-name-map.cjs --dataset homecoming --dry-run
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');

const datasetId = parseDatasetArg();
const dryRun = process.argv.includes('--dry-run');

const REPO_ROOT = path.resolve(__dirname, '..');
/**
 * Which fork's Mids namespace a build for this dataset actually carries.
 *
 * Brainstorm is Homecoming's open beta and Mids ships no build for it, so a Brainstorm
 * planner's Mids file was authored in Mids' HOMECOMING database — Homecoming's names
 * joined against Brainstorm's own export is the true pairing, and an empty map would be
 * a silent skip dressed as "no data".
 */
const NAMES_DATASET = { brainstorm: 'homecoming' };
const namesDataset = NAMES_DATASET[datasetId] || datasetId;
const NAMES_PATH = path.join(REPO_ROOT, 'tools', 'mids-oracle', `mids-power-names.${namesDataset}.json`);
const EXPORT_BASE = path.join(REPO_ROOT, 'exported_powers');
const RAW_ROOT = (datasetId === 'homecoming' && !fs.existsSync(path.join(EXPORT_BASE, datasetId)))
  ? EXPORT_BASE
  : path.join(EXPORT_BASE, datasetId);
const OUTPUT_PATH = datasetPath(datasetId, 'generated', 'mids-name-map.ts');

/**
 * Display names compared with separators and case folded away, and nothing else.
 *
 * Deliberately not the matcher's `stripSep`, which deletes every non-alphanumeric: that
 * would make "Quick Sand" and "Quicksand" equal here and mint a row for a pair the
 * matcher already resolves on its own. A remap row is for a name that means a DIFFERENT
 * power, so the join has to be tight enough that a spelling drift does not qualify.
 */
function normalizeDisplay(s) {
  return String(s || '').replace(/[\s_-]+/g, ' ').trim().toLowerCase();
}

/** Every powerset in this dataset's export, as `group.set` → its powers in game order. */
function readExportPowersets() {
  const out = new Map();
  for (const group of fs.readdirSync(RAW_ROOT, { withFileTypes: true })) {
    if (!group.isDirectory()) continue;
    const groupDir = path.join(RAW_ROOT, group.name);
    for (const set of fs.readdirSync(groupDir, { withFileTypes: true })) {
      if (!set.isDirectory()) continue;
      const indexPath = path.join(groupDir, set.name, 'index.json');
      if (!fs.existsSync(indexPath)) continue;
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
      const powers = index.powers || [];
      if (powers.length === 0) continue;
      const displays = index.power_display_names || [];
      // The key comes from the powers' own fullName rather than the directory names:
      // a converter that keys on the path silently stops matching when a fork renames
      // a folder, and the fullName is what the .mbd path is compared against anyway.
      const segments = String(powers[0]).split('.');
      if (segments.length < 3) continue;
      const key = `${segments[0]}.${segments[1]}`.toLowerCase();
      const levels = index.available_level || [];
      out.set(key, powers.map((full, i) => ({
        internalName: String(full).split('.').pop(),
        displayName: displays[i] || '',
        // `available_level` is 0-based here and Mids' is 1-based; the +1 is the whole
        // difference, and getting it backwards would silently reject every row.
        level: typeof levels[i] === 'number' ? levels[i] + 1 : null,
      })));
    }
  }
  return out;
}

const midsNames = JSON.parse(fs.readFileSync(NAMES_PATH, 'utf-8'));
const exportSets = readExportPowersets();

const map = {};
const stats = { shared: 0, rows: 0, ambiguous: [], merges: [], levelRejected: [] };

for (const [key, midsPowers] of Object.entries(midsNames.powersets || {})) {
  const ours = exportSets.get(key);
  if (!ours) continue;
  stats.shared++;

  // Display → our powers. A list, not a single entry: a set with two powers under one
  // display name (the Nature Affinity pet's "Rebirth" heal and rez) cannot be joined on
  // display, and picking either arm would be a coin flip dressed as a decode.
  const byDisplay = new Map();
  for (const power of ours) {
    const k = normalizeDisplay(power.displayName);
    if (!k) continue;
    if (!byDisplay.has(k)) byDisplay.set(k, []);
    byDisplay.get(k).push(power);
  }

  const midsByName = new Map(midsPowers.map((row) => [String(row[0]).toLowerCase(), row]));
  const rows = {};
  const claimed = new Map();
  for (const [midsInternal, midsDisplay] of midsPowers) {
    const candidates = byDisplay.get(normalizeDisplay(midsDisplay)) || [];
    if (candidates.length === 0) continue;
    if (candidates.length > 1) {
      stats.ambiguous.push(`${key}: "${midsDisplay}" names ${candidates.length} powers here`);
      continue;
    }
    const ourInternal = candidates[0].internalName;
    if (ourInternal.toLowerCase() === String(midsInternal).toLowerCase()) continue;

    // Withdraw the row if our target is already spoken for by an identity: Mids carries a
    // power of that exact name, unlocking at the same level. See the header.
    const incumbent = midsByName.get(ourInternal.toLowerCase());
    if (incumbent && incumbent[2] !== null && candidates[0].level === incumbent[2]) {
      stats.levelRejected.push(
        `${key}: "${midsDisplay}" — ${ourInternal} is Mids' own ${incumbent[0]} `
        + `(both level ${incumbent[2]}), not ${midsInternal}`,
      );
      continue;
    }
    rows[String(midsInternal).toLowerCase()] = ourInternal;
    // Two Mids names resolving onto one of ours is a MERGE, not a rotation, and a remap
    // row would silently drop whichever entry the build listed second. Recorded so the
    // gate can see it; the row still stands, because the alternative is the mis-bind.
    if (claimed.has(ourInternal)) {
      stats.merges.push(`${key}: ${claimed.get(ourInternal)} and ${midsInternal} both → ${ourInternal}`);
    }
    claimed.set(ourInternal, midsInternal);
  }

  if (Object.keys(rows).length > 0) {
    map[key] = Object.fromEntries(Object.entries(rows).sort(([a], [b]) => a.localeCompare(b)));
    stats.rows += Object.keys(rows).length;
  }
}

const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));

const source = `Mids Reborn ${namesDataset} database ${midsNames.version} `
  + `(sha256 ${String(midsNames.sha256).slice(0, 12)}…)`
  + (namesDataset === datasetId ? '' : ` — Mids ships no ${datasetId} build, so a ${datasetId} .mbd carries ${namesDataset}'s namespace`);

const body = `/**
 * Mids internal name → this dataset's internal name — AUTO-GENERATED, DO NOT EDIT.
 *
 * Keyed by \`group.powerset\` (lower-cased, as the .mbd spells it), then by the Mids
 * internal name (lower-cased). The value is this dataset's internal name for the SAME
 * power, joined on the display name — the identity that survived HC's internal-name
 * rotations. See DATA-GAP MBDIMPORT-2.
 *
 * Source: ${source}
 * Powersets shared with the export: ${stats.shared}. Remapped names: ${stats.rows}.
 *
 * Regenerate: node scripts/convert-mids-name-map.cjs --dataset ${datasetId}
 */

export const MIDS_NAME_MAP: Readonly<Record<string, Readonly<Record<string, string>>>> = ${JSON.stringify(sorted, null, 2)};
`;

if (dryRun) {
  process.stdout.write(body);
} else {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, body);
}

console.error(
  `[convert-mids-name-map] ${datasetId}: ${stats.rows} remapped names across ` +
  `${Object.keys(sorted).length} powersets (of ${stats.shared} shared)` +
  (dryRun ? ' [dry run]' : ` -> ${path.relpath ? '' : ''}${path.relative(REPO_ROOT, OUTPUT_PATH)}`),
);
for (const line of stats.merges) console.error(`  merge: ${line}`);
for (const line of stats.levelRejected) console.error(`  level-rejected: ${line}`);
for (const line of stats.ambiguous.slice(0, 10)) console.error(`  ambiguous: ${line}`);
if (stats.ambiguous.length > 10) console.error(`  ambiguous: … +${stats.ambiguous.length - 10} more`);
