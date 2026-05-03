/**
 * Extract Rebirth IO Sets — subset of HC's IO_SETS_RAW filtered by the
 * set names that actually exist in Rebirth's `boostsets.bin`.
 *
 * Background: full IO set definitions (piece aspects + bonus tier values)
 * come from a Mids-curated source upstream of `legacy/js/data/io-sets.js`.
 * Rebirth doesn't have a parallel community-curated data source; we'd need
 * to build a Parse6-aware parser for `boost_effect_*.bin` to extract the
 * data ourselves (significant Parse6 binary work).
 *
 * Audit (2026-05-03) shows Rebirth's set list is a strict subset of HC's:
 *   - 210 sets shared between HC and Rebirth
 *   - 17 HC-only sets (post-i24 additions, mostly Sentinel ATOs)
 *   - 0 Rebirth-only sets
 *
 * So the pragmatic generator: filter HC's `IO_SETS_RAW` to keep only the
 * 210 sets Rebirth actually has, and emit a Rebirth-specific
 * `io-sets-raw.ts`. Bonus values come from HC's data and may have minor
 * numerical drift from Rebirth's actual i24-era values; document this in
 * the file header. The full Parse6 boost_effect parser can land later as
 * a follow-up.
 *
 * Usage:
 *   node scripts/extract-rebirth-io-sets.cjs
 *
 * Reads:
 *   - tools/bin-crawler/exported_powers/rebirth/boostsets.json (set names
 *     parsed from Rebirth's boostsets.bin) — produced by the Python helper
 *     below if not present.
 *   - src/data/io-sets-raw.ts (HC's curated set definitions)
 *
 * Writes:
 *   - src/data/datasets/rebirth/io-sets-raw.ts
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const REBIRTH_BOOSTSETS_JSON = path.join(
  PROJECT_ROOT, 'tools/bin-crawler/exported_powers/rebirth/boostsets.json'
);
const HC_IO_SETS_RAW = path.join(PROJECT_ROOT, 'src/data/datasets/homecoming/io-sets-raw.ts');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'src/data/datasets/rebirth/io-sets-raw.ts');

// ----------------------------------------------------------------------
// Step 1: Get Rebirth set names from boostsets.bin via the parser.
// ----------------------------------------------------------------------

if (!fs.existsSync(REBIRTH_BOOSTSETS_JSON)) {
  console.log('Rebirth boostsets.json missing — running parser…');
  // Drop the Python helper to a temp file so newlines survive shell parsing
  // (PowerShell + node child_process flattens multi-line strings).
  const pyScriptPath = path.join(PROJECT_ROOT, 'tools/bin-crawler/exported_powers/rebirth/_dump_boostsets.py');
  const py = `import sys, json
sys.path.insert(0, r'${path.join(PROJECT_ROOT, 'tools/bin-crawler').replace(/\\/g, '/')}')
from bin_crawler.parser._pigg import BinResolver
from bin_crawler.parser._boostsets import parse_boostsets
resolver = BinResolver(r'C:/Users/jiiwi/OneDrive/Desktop/CoH/i2401-bin-server-develop/piggs')
p = resolver.read_to_tempfile('boostsets.bin')
sets = parse_boostsets(str(p))
out = [{'name': s.name, 'display_name': s.display_name, 'rarity': s.rarity, 'category': s.category} for s in sets]
print(json.dumps(out))
`;
  fs.mkdirSync(path.dirname(pyScriptPath), { recursive: true });
  fs.writeFileSync(pyScriptPath, py);
  const result = execSync(`py -3 "${pyScriptPath}"`, {
    encoding: 'utf-8',
    cwd: PROJECT_ROOT,
  });
  fs.writeFileSync(REBIRTH_BOOSTSETS_JSON, result);
}

const rebirthSets = JSON.parse(fs.readFileSync(REBIRTH_BOOSTSETS_JSON, 'utf-8'));
console.log(`Loaded ${rebirthSets.length} sets from Rebirth's boostsets.bin`);

// Normalise to lowercased keys matching HC's IO_SETS_RAW indexing.
// Rebirth set name comes through as "Absolute_Amazement"; HC's file keys
// it as "absolute_amazement". Some sets diverge on punctuation (Rebirth's
// `gaussians_synchronized_fire-control` vs HC's
// `gaussians_synchronized_firecontrol`) — strip dashes and double
// underscores to a canonical form so the lookup hits.
function normaliseKey(name) {
  return name.toLowerCase().replace(/-/g, '').replace(/_+/g, '_');
}
const rebirthKeys = new Set(rebirthSets.map((s) => normaliseKey(s.name)));

// ----------------------------------------------------------------------
// Step 2: Read HC's io-sets-raw.ts and extract the IO_SETS_RAW object.
// ----------------------------------------------------------------------

const hcContent = fs.readFileSync(HC_IO_SETS_RAW, 'utf-8');
const hcMatch = hcContent.match(/export const IO_SETS_RAW: LegacyIOSetRegistry = (\{[\s\S]*?\});\s*$/);
if (!hcMatch) {
  console.error('Could not find IO_SETS_RAW object in HC io-sets-raw.ts');
  process.exit(1);
}

let hcSets;
try {
  // The file is plain JSON-ish — wrap in parens so eval treats it as an expression.
  hcSets = eval(`(${hcMatch[1]})`);
} catch (e) {
  console.error('Failed to parse HC IO_SETS_RAW:', e.message);
  process.exit(1);
}
const hcKeys = Object.keys(hcSets);
console.log(`Loaded ${hcKeys.length} sets from HC's io-sets-raw.ts`);

// ----------------------------------------------------------------------
// Step 3: Filter HC's data to only the sets Rebirth actually has.
// ----------------------------------------------------------------------

const rebirthSetData = {};
const missing = [];
for (const key of rebirthKeys) {
  if (hcSets[key]) {
    rebirthSetData[key] = hcSets[key];
  } else {
    missing.push(key);
  }
}
const rebirthOutKeys = Object.keys(rebirthSetData).sort();
console.log(`Filtered to ${rebirthOutKeys.length} Rebirth sets`);
if (missing.length > 0) {
  console.log(`  ${missing.length} Rebirth sets missing from HC's data (will be omitted): ${missing.slice(0, 5).join(', ')}${missing.length > 5 ? ' …' : ''}`);
}

// Categorise for the header summary
const categoryCounts = {};
for (const key of rebirthOutKeys) {
  const cat = rebirthSetData[key].category || 'unknown';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

// ----------------------------------------------------------------------
// Step 4: Emit the output file.
// ----------------------------------------------------------------------

const orderedSets = {};
for (const key of rebirthOutKeys) orderedSets[key] = rebirthSetData[key];

const header = `/**
 * Rebirth IO Set data — filtered subset of HC's IO_SETS_RAW.
 *
 * Auto-generated by \`scripts/extract-rebirth-io-sets.cjs\`. Do not hand-edit.
 *
 * Generation strategy: every set name parsed from Rebirth's
 * \`boostsets.bin\` (${rebirthKeys.size} sets) is looked up in HC's
 * curated \`src/data/io-sets-raw.ts\`. Rebirth's set list is a strict
 * subset of HC's (210 shared, 17 HC-only post-i24 additions, 0
 * Rebirth-only), so this filter cleanly produces a Rebirth-specific
 * registry without losing any Rebirth sets.
 *
 * Caveat — bonus values: HC's curated data uses Mids-sourced bonus
 * tier values that match the modern HC era. Rebirth (i24 snapshot)
 * may have minor numerical drift on some bonus values. Audit ad-hoc
 * if a specific set's numbers are reported as wrong; the long-term
 * fix is a Parse6 \`boost_effect_*.bin\` parser that can extract
 * Rebirth's actual bonus tiers from binary.
 *
 * Total sets: ${rebirthOutKeys.length}
 * Categories: ${JSON.stringify(categoryCounts)}
 */

// Type definition for legacy format (used by io-sets.ts transformer)
interface LegacyIOSetPiece {
  num: number;
  name: string;
  aspects: string[];
  proc: boolean;
  unique: boolean;
  totalAspects?: number;
}

interface LegacySetBonusEffect {
  stat: string;
  value: number;
  desc: string;
  pvp?: boolean;
}

interface LegacySetBonus {
  pieces: number;
  effects: LegacySetBonusEffect[];
}

interface LegacyIOSet {
  name: string;
  category: string;
  type: string;
  minLevel: number;
  maxLevel: number;
  bonuses: LegacySetBonus[];
  pieces: LegacyIOSetPiece[];
  icon: string;
}

type LegacyIOSetRegistry = Record<string, LegacyIOSet>;

export const IO_SETS_RAW: LegacyIOSetRegistry = ${JSON.stringify(orderedSets, null, 2)};
`;

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, header);
console.log(`Wrote ${OUTPUT_PATH}`);
