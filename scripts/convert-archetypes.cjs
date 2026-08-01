/**
 * Convert binary-sourced archetype stats → archetype-stats.generated.ts
 *
 * Reads the per-archetype `attribs` block (HP curve, HP-cap curve, resistance
 * cap) that `tools/bin-crawler/bin_crawler/export_classes.py` writes into
 * `exported_powers/tables/<at>.json`, and emits a TypeScript map the hand-
 * curated `archetypes.ts` spreads into each AT's `stats`. This replaces the
 * drift-prone hand-typed HP tables / baseHP / maxHP / resistanceCap with
 * values derived straight from the game binary (a stale HP table can no longer
 * silently diverge from the live game — it regenerates).
 *
 * Phase 1 (classes.bin core): HP curve, HP cap, resistance cap.
 * Phase 2 (classes.bin header scalar): baseThreat (per-AT threat multiplier).
 * Phase 3 (classes.bin StrengthMax): damageCap (L50 of the damage-strength
 * curve — caught the hand-port under-capping Scrapper/Tanker/Sentinel/Corruptor/
 * Stalker at 400% when they are 500%; verified vs the HC 2020-01-23 patch notes).
 * Phase 6 (classes.bin AttribMax rows): the attribute ceilings the export used to
 * discard — toHit, regeneration, recovery, defense and max endurance
 * (DATA-GAP-REGISTER CAPS-1) — plus the endurance-discount ClampStrength pair.
 * Regeneration and recovery are reachable by a real build, so these are live
 * clamps, not just what-if guardrails.
 * Remaining hand-curated scalars (damageModifier, buffDebuffModifier,
 * baseEndurance, baseRecovery, defenseCap) aren't single binary quantities — the
 * load-bearing per-AT modifiers live in the binary named_tables (at-tables.ts),
 * which the calc already uses; these scalars are only fallbacks. See
 * ARCHETYPE-DEFS-BINARY-SOURCING.md (Phase 2/3).
 *
 * Usage: node scripts/convert-archetypes.cjs [--dataset <id>]
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');

const datasetId = parseDatasetArg();

// Mirror extract-at-tables.cjs: HC ships flat (exported_powers/tables/), other
// datasets are namespaced (exported_powers/<id>/tables/).
const RAW_DATA_BASE = path.join(__dirname, '..', 'exported_powers');
const RAW_DATA_PATH = (datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_DATA_BASE, datasetId, 'tables')))
  ? path.join(RAW_DATA_BASE, 'tables')
  : path.join(RAW_DATA_BASE, datasetId, 'tables');

const OUTPUT_PATH = datasetPath(datasetId, 'generated', 'archetype-stats.generated.ts');

// Player archetypes (file stem in tables/). Underscore form; the generated key
// is hyphenated to match the archetypes.ts ids (e.g. 'arachnos-soldier'). This
// is the UNION across datasets — `sentinel` is HC-only and `guardian` is
// Rebirth-only; each dataset's export simply lacks the other (warn + skip).
const PLAYER_ARCHETYPES = [
  'blaster', 'brute', 'controller', 'corruptor', 'defender', 'dominator',
  'guardian', 'mastermind', 'scrapper', 'sentinel', 'stalker', 'tanker',
  'peacebringer', 'warshade', 'arachnos_soldier', 'arachnos_widow',
  'primalist', // Thunderspy-only custom AT (warn+skip on HC/Rebirth)
];

const PLAYER_LEVELS = 50; // levels 1-50

// The attribute ceilings CAPS-1 recovered from AttribMaxTable, mapping the
// exporter's `_CEILED_ATTRIBS` export prefix onto the camelCase name the calc
// uses. Each contributes `<name>Base` (the AttribBase scalar) and
// `<name>CapTable` (the per-level ceiling ClampCur bounds it against). Both
// halves are needed: the ceiling is an ABSOLUTE attribute value, and the
// percentage a planner shows is only recoverable against that class's own base.
const CEILED_ATTRIBS = {
  to_hit: 'toHit',
  regeneration: 'regeneration',
  recovery: 'recovery',
};

/** Round to 4 decimals (the hand-port's precision) and drop float32 fuzz. */
function r4(n) {
  return Math.round(n * 1e4) / 1e4;
}

/**
 * The attribute ceilings and their bases (CAPS-1), plus the endurance-discount
 * ClampStrength pair. Per-level rows, because the ToHit, regeneration and
 * defense curves all rise with level — exemplaring down genuinely lowers what a
 * build can reach.
 *
 * `defenseCeilingTable` is a single curve the exporter already proved agrees
 * with every typed defense row the dataset authors, so there is one ceiling here
 * and not eleven. It is deliberately not called a "cap": the hand-curated
 * `stats.defenseCap` scalar already in `archetypes.ts` holds 0.45, which is the
 * purple-patch SOFTCAP under a wrong name — a level-diff threshold defense
 * legitimately exceeds. This is the real clamp, three to five times above it.
 *
 * `maxEnduranceTable` / `maxEnduranceCapTable` are HitPoints' shape — the base
 * is itself an AttribMaxTable row and the ceiling is the AttribMaxMaxTable row
 * over it.
 *
 * Returns null (with a warning naming the field) when the export is missing one,
 * so the caller drops the archetype rather than shipping a fabricated ceiling.
 */
function attributeCeilings(at, attribs) {
  const out = {};
  const perLevel = (key, name) => {
    const row = attribs[key];
    if (!Array.isArray(row) || row.length < PLAYER_LEVELS) {
      console.warn(`Warning: ${at} ${key} has ${row?.length} levels (expected ${PLAYER_LEVELS}) — re-run export_classes.py — skipping`);
      return false;
    }
    out[name] = row.slice(0, PLAYER_LEVELS).map(r4);
    return true;
  };
  for (const [exportKey, name] of Object.entries(CEILED_ATTRIBS)) {
    const base = attribs[`${exportKey}_base`];
    if (typeof base !== 'number' || !(base > 0)) {
      console.warn(`Warning: ${at} missing/invalid ${exportKey}_base (${base}) — re-run export_classes.py — skipping`);
      return null;
    }
    out[`${name}Base`] = r4(base);
    if (!perLevel(`${exportKey}_cap`, `${name}CapTable`)) return null;
  }
  if (!perLevel('defense_cap', 'defenseCeilingTable')) return null;
  if (!perLevel('max_endurance', 'maxEnduranceTable')) return null;
  if (!perLevel('max_endurance_cap', 'maxEnduranceCapTable')) return null;
  // The endurance-discount twin of rechargeFloor/rechargeCap. Its floor is the
  // epsilon the server adds to the divisor rather than a real floor, so an
  // endurance debuff is unbounded where a recharge one is not.
  const floor = attribs.endurance_floor;
  const cap = attribs.endurance_cap;
  if (typeof floor !== 'number' || !(floor > 0 && floor <= 1)) {
    console.warn(`Warning: ${at} missing/invalid endurance_floor (${floor}) — re-run export_classes.py — skipping`);
    return null;
  }
  if (typeof cap !== 'number' || !(cap >= 1 && cap <= 10)) {
    console.warn(`Warning: ${at} missing/invalid endurance_cap (${cap}) — re-run export_classes.py — skipping`);
    return null;
  }
  out.enduranceFloor = r4(floor);
  out.enduranceCap = r4(cap);
  return out;
}

function extract() {
  const out = {};
  for (const at of PLAYER_ARCHETYPES) {
    const file = path.join(RAW_DATA_PATH, `${at}.json`);
    if (!fs.existsSync(file)) {
      console.warn(`Warning: ${at}.json not found`);
      continue;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const a = data.attribs;
    if (!a || !Array.isArray(a.hit_points) || !Array.isArray(a.hp_cap)) {
      console.warn(`Warning: ${at} has no attribs block (parser/export gap) — skipping`);
      continue;
    }
    const hpTable = a.hit_points.slice(0, PLAYER_LEVELS).map(r4);
    const hpCapTable = a.hp_cap.slice(0, PLAYER_LEVELS).map(r4);
    if (hpTable.length !== PLAYER_LEVELS || hpCapTable.length !== PLAYER_LEVELS) {
      console.warn(`Warning: ${at} HP curve length ${hpTable.length}/${hpCapTable.length} (expected ${PLAYER_LEVELS}) — skipping`);
      continue;
    }
    if (typeof a.base_threat !== 'number' || !(a.base_threat > 0)) {
      console.warn(`Warning: ${at} missing/invalid base_threat (${a.base_threat}) — re-run export_classes.py — skipping`);
      continue;
    }
    if (typeof a.damage_cap !== 'number' || !(a.damage_cap >= 3 && a.damage_cap <= 10)) {
      console.warn(`Warning: ${at} missing/invalid damage_cap (${a.damage_cap}) — re-run export_classes.py — skipping`);
      continue;
    }
    // The RechargeTime net-strength clamp bounds (ClampStrength, character_attribs.c):
    // StrengthMin and StrengthMaxTable[50]. The chain builder's what-if slider divides by
    // `1 + enh + global`, and without these it clamped the low side against a hardcoded 0.25
    // and the high side against nothing at all — so the slider could drive a power past the
    // +400% recharge cap the game enforces (WHAT-IF-BUFFS-PLAN WIF19).
    const rechargeFloor = a.recharge_floor;
    const rechargeCap = a.recharge_cap;
    if (typeof rechargeFloor !== 'number' || !(rechargeFloor > 0 && rechargeFloor <= 1)) {
      console.warn(`Warning: ${at} missing/invalid recharge_floor (${rechargeFloor}) — re-run export_classes.py — skipping`);
      continue;
    }
    if (typeof rechargeCap !== 'number' || !(rechargeCap >= 1 && rechargeCap <= 10)) {
      console.warn(`Warning: ${at} missing/invalid recharge_cap (${rechargeCap}) — re-run export_classes.py — skipping`);
      continue;
    }
    const ceilings = attributeCeilings(at, a);
    if (!ceilings) {
      continue;
    }
    const key = at.replace(/_/g, '-');
    out[key] = {
      baseHP: hpTable[PLAYER_LEVELS - 1],
      maxHP: hpCapTable[PLAYER_LEVELS - 1],
      resistanceCap: r4(a.resistance_cap),
      baseThreat: r4(a.base_threat),
      damageCap: r4(a.damage_cap),
      rechargeFloor: r4(rechargeFloor),
      rechargeCap: r4(rechargeCap),
      ...ceilings,
      hpTable,
      hpCapTable,
    };
    console.log(`  ${key}: baseHP=${out[key].baseHP} maxHP=${out[key].maxHP} resCap=${out[key].resistanceCap} threat=${out[key].baseThreat} dmgCap=${out[key].damageCap}`);
  }
  return out;
}

function fmtArray(arr) {
  const perLine = 10;
  const lines = ['['];
  for (let i = 0; i < arr.length; i += perLine) {
    const chunk = arr.slice(i, i + perLine).join(', ');
    lines.push(`      ${chunk}${i + perLine < arr.length ? ',' : ''}`);
  }
  lines.push('    ]');
  return lines.join('\n');
}

function generate(stats) {
  const L = [];
  L.push('/**');
  L.push(' * Archetype binary-sourced stats — AUTO-GENERATED, DO NOT EDIT.');
  L.push(' *');
  L.push(' * Source: exported_powers/tables/<at>.json `attribs` block (from');
  L.push(' * classes.bin via export_classes.py). Regenerate with:');
  L.push(` *   node scripts/convert-archetypes.cjs --dataset ${datasetId}`);
  L.push(' *');
  L.push(' * Spread into each archetype\'s `stats` in archetypes.ts. Fields:');
  L.push(' * HP curve, HP cap, baseHP/maxHP (level 50), resistance cap (Phase 1),');
  L.push(' * baseThreat (Phase 2 header scalar), damageCap (Phase 3 StrengthMax), the\n * RechargeTime and EnduranceDiscount net-strength clamp bounds (ClampStrength\n * StrengthMin / StrengthMaxTable — the −75% debuff floor and the +400% cap), and\n * the Phase 6 attribute ceilings with their bases (CAPS-1: ToHit, regeneration,\n * recovery, defense, and the endurance pool).');
  L.push(' */');
  L.push('');
  L.push('export interface ArchetypeBinaryStats {');
  L.push('  baseHP: number;');
  L.push('  maxHP: number;');
  L.push('  resistanceCap: number;');
  L.push('  baseThreat: number;');
  L.push('  damageCap: number;');
  L.push('  rechargeFloor: number;');
  L.push('  rechargeCap: number;');
  L.push('  enduranceFloor: number;');
  L.push('  enduranceCap: number;');
  L.push('  /** AttribBase, absolute attribute units — a ceiling only means something over it. */');
  L.push('  toHitBase: number;');
  L.push('  regenerationBase: number;');
  L.push('  recoveryBase: number;');
  L.push('  /** Per-level AttribMax rows: the ceilings ClampCur binds these attributes to. */');
  L.push('  toHitCapTable: number[];');
  L.push('  regenerationCapTable: number[];');
  L.push('  recoveryCapTable: number[];');
  L.push('  /** The real defense clamp — NOT the 0.45 softcap `stats.defenseCap` holds. */');
  L.push('  defenseCeilingTable: number[];');
  L.push('  /** The endurance pool itself and its ceiling, in absolute endurance points. */');
  L.push('  maxEnduranceTable: number[];');
  L.push('  maxEnduranceCapTable: number[];');
  L.push('  hpTable: number[];');
  L.push('  hpCapTable: number[];');
  L.push('}');
  L.push('');
  L.push('export const ARCHETYPE_BINARY_STATS: Record<string, ArchetypeBinaryStats> = {');
  for (const [key, s] of Object.entries(stats)) {
    L.push(`  '${key}': {`);
    L.push(`    baseHP: ${s.baseHP},`);
    L.push(`    maxHP: ${s.maxHP},`);
    L.push(`    resistanceCap: ${s.resistanceCap},`);
    L.push(`    baseThreat: ${s.baseThreat},`);
    L.push(`    damageCap: ${s.damageCap},`);
    L.push(`    rechargeFloor: ${s.rechargeFloor},`);
    L.push(`    rechargeCap: ${s.rechargeCap},`);
    L.push(`    enduranceFloor: ${s.enduranceFloor},`);
    L.push(`    enduranceCap: ${s.enduranceCap},`);
    L.push(`    toHitBase: ${s.toHitBase},`);
    L.push(`    regenerationBase: ${s.regenerationBase},`);
    L.push(`    recoveryBase: ${s.recoveryBase},`);
    L.push(`    toHitCapTable: ${fmtArray(s.toHitCapTable)},`);
    L.push(`    regenerationCapTable: ${fmtArray(s.regenerationCapTable)},`);
    L.push(`    recoveryCapTable: ${fmtArray(s.recoveryCapTable)},`);
    L.push(`    defenseCeilingTable: ${fmtArray(s.defenseCeilingTable)},`);
    L.push(`    maxEnduranceTable: ${fmtArray(s.maxEnduranceTable)},`);
    L.push(`    maxEnduranceCapTable: ${fmtArray(s.maxEnduranceCapTable)},`);
    L.push(`    hpTable: ${fmtArray(s.hpTable)},`);
    L.push(`    hpCapTable: ${fmtArray(s.hpCapTable)},`);
    L.push('  },');
  }
  L.push('};');
  L.push('');
  return L.join('\n');
}

console.log(`Converting archetype stats (dataset: ${datasetId})...`);
const stats = extract();
const count = Object.keys(stats).length;
if (count === 0) {
  // No attribs in this dataset's export yet. Homecoming (Parse7) carries them;
  // Rebirth (Parse6) attrib extraction is not implemented yet, so skip rather
  // than fail the regen pipeline. Correctness of HC is guarded by
  // src/data/archetype-stats.test.ts (which reads the export directly), so a
  // genuine HC attrib regression surfaces there, not here.
  console.warn(`No archetype attribs in ${RAW_DATA_PATH} — skipping (expected for datasets without Parse7 attrib support).`);
  process.exit(0);
}
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, generate(stats));
console.log(`\nWrote ${OUTPUT_PATH} (${count} archetypes)`);
