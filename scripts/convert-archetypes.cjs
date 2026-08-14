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
 * Phase 4 (classes.bin AttribMaxMax Absorb row): absorbCap — the ceiling the
 * game clamps absorb shields against. Runs close to the HP curve but is its own
 * authored table, so it is read as its own row rather than derived from HP.
 * Phase 6 (classes.bin AttribMax rows): the attribute ceilings the export used
 * to discard — toHit, regeneration, recovery, defense and max endurance
 * (DATA-GAP-REGISTER CAPS-1). Regeneration and recovery are reachable by a real
 * build, so these are live clamps, not just what-if guardrails.
 * Remaining hand-curated scalars (damageModifier, buffDebuffModifier,
 * baseEndurance, baseRecovery, defenseCap) aren't single binary quantities — the
 * load-bearing per-AT modifiers live in the binary named_tables (at-tables.ts),
 * which the calc already uses; these scalars are only fallbacks.
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

// Player archetypes (file stem in tables/), derived from the export's
// membership signal. Underscore form; the generated key is hyphenated to match
// the archetypes.ts ids (e.g. 'arachnos-soldier').
const { derivePlayerArchetypes } = require('./_player-classes.cjs');
const PLAYER_ARCHETYPES = derivePlayerArchetypes(RAW_DATA_PATH);

const PLAYER_LEVELS = 50; // levels 1-50

/** Round to 4 decimals (the hand-port's precision) and drop float32 fuzz. */
function r4(n) {
  return Math.round(n * 1e4) / 1e4;
}

// The reduction aspects whose net strength ClampStrength bounds, matching the
// exporter's `_CLAMPED_STRENGTHS`. Each contributes `<aspect>Floor`/`<aspect>Cap`.
const CLAMPED_STRENGTHS = ['recharge', 'endurance'];

// The travel axes, mapping the exporter's `_MOVEMENT_ATTRIBS` keys onto the
// camelCase names the calc already uses for these totals (GlobalBonuses
// runSpeed/flySpeed/jumpSpeed/jumpHeight). One vocabulary, not two.
const MOVEMENT_AXES = {
  run_speed: 'runSpeed',
  fly_speed: 'flySpeed',
  jump_speed: 'jumpSpeed',
  jump_height: 'jumpHeight',
};

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

/**
 * The attribute ceilings and their bases (CAPS-1). Per-level rows, because the
 * ToHit, regeneration and defense curves all rise with level — exemplaring down
 * genuinely lowers what a build can reach, exactly as the travel ceilings do.
 *
 * `defenseCeilingTable` is a single curve the exporter already proved agrees with
 * every typed defense row the dataset authors, so there is one ceiling here and
 * not eleven. It is deliberately not called a "cap": the hand-curated
 * `stats.defenseCap` scalar already in `archetypes.ts` holds 0.45, which is the
 * purple-patch SOFTCAP under a wrong name — a level-diff threshold defense
 * legitimately exceeds. This is the real clamp, and it sits three to five times
 * above that threshold.
 *
 * `maxEnduranceTable` / `maxEnduranceCapTable` are HitPoints' shape — the base
 * is itself an AttribMaxTable row and the ceiling is the AttribMaxMaxTable row
 * over it.
 *
 * Returns null (with a warning naming the field) when the export is missing
 * one, so the caller drops the archetype rather than shipping a fabricated
 * ceiling.
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
  return out;
}

/**
 * The travel scales and their per-level ceilings, in movement SCALE units (the
 * multiplier the server hands the physics layer: 1.0 = 21 ft/s for the three
 * speeds, 4 ft for jump height). The ceiling is AttribMaxTable's row — flat on
 * Homecoming, per-level on both forks — so exemplaring down genuinely lowers
 * what a build can reach there.
 *
 * Returns null (with a warning naming the axis) when the export is missing one,
 * so the caller drops the archetype rather than shipping a fabricated ceiling.
 */
function movementScales(at, attribs) {
  const base = attribs.movement_base;
  const cap = attribs.movement_cap;
  if (!base || !cap) {
    console.warn(`Warning: ${at} missing movement_base/movement_cap — re-run export_classes.py — skipping`);
    return null;
  }
  const movementBase = {};
  const movementCapTable = {};
  for (const [exportKey, axis] of Object.entries(MOVEMENT_AXES)) {
    const scale = base[exportKey];
    const row = cap[exportKey];
    if (typeof scale !== 'number' || !(scale > 0)) {
      console.warn(`Warning: ${at} missing/invalid movement_base.${exportKey} (${scale}) — skipping`);
      return null;
    }
    if (!Array.isArray(row) || row.length < PLAYER_LEVELS) {
      console.warn(`Warning: ${at} movement_cap.${exportKey} has ${row?.length} levels (expected ${PLAYER_LEVELS}) — skipping`);
      return null;
    }
    movementBase[axis] = r4(scale);
    movementCapTable[axis] = row.slice(0, PLAYER_LEVELS).map(r4);
  }
  return { movementBase, movementCapTable };
}

/**
 * The net-strength clamp bounds (ClampStrength, Common/entity/character_attribs.c):
 * how far a debuff can push net strength down, and how far buffs can push it up.
 * Recharge is 0.25 / 5.0 — the −75% debuff floor and the +400% recharge cap.
 * Endurance is 0.0001 / 5.0, where the floor is the same epsilon the server adds
 * to the divisor rather than a real floor, so an endurance debuff is unbounded
 * where a recharge one is not.
 *
 * Returns null (with a warning naming the aspect) when the export is missing or
 * has mangled a bound, so the caller drops the archetype rather than shipping a
 * fabricated ceiling.
 */
function clampBounds(at, attribs) {
  const bounds = {};
  for (const aspect of CLAMPED_STRENGTHS) {
    const floor = attribs[`${aspect}_floor`];
    const cap = attribs[`${aspect}_cap`];
    if (typeof floor !== 'number' || !(floor > 0 && floor <= 1)) {
      console.warn(`Warning: ${at} missing/invalid ${aspect}_floor (${floor}) — re-run export_classes.py — skipping`);
      return null;
    }
    if (typeof cap !== 'number' || !(cap >= 1 && cap <= 10)) {
      console.warn(`Warning: ${at} missing/invalid ${aspect}_cap (${cap}) — re-run export_classes.py — skipping`);
      return null;
    }
    bounds[`${aspect}Floor`] = r4(floor);
    bounds[`${aspect}Cap`] = r4(cap);
  }
  return bounds;
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
    if (!Array.isArray(a.absorb_cap) || a.absorb_cap.length < PLAYER_LEVELS) {
      console.warn(`Warning: ${at} missing absorb_cap curve — re-run export_classes.py — skipping`);
      continue;
    }
    const absorbCapTable = a.absorb_cap.slice(0, PLAYER_LEVELS).map(r4);
    if (typeof a.base_threat !== 'number' || !(a.base_threat > 0)) {
      console.warn(`Warning: ${at} missing/invalid base_threat (${a.base_threat}) — re-run export_classes.py — skipping`);
      continue;
    }
    if (typeof a.damage_cap !== 'number' || !(a.damage_cap >= 3 && a.damage_cap <= 10)) {
      console.warn(`Warning: ${at} missing/invalid damage_cap (${a.damage_cap}) — re-run export_classes.py — skipping`);
      continue;
    }
    const bounds = clampBounds(at, a);
    if (!bounds) {
      continue;
    }
    const movement = movementScales(at, a);
    if (!movement) {
      continue;
    }
    const ceilings = attributeCeilings(at, a);
    if (!ceilings) {
      continue;
    }
    const key = at.replace(/_/g, '-');
    if (typeof data.name !== 'string' || !data.name) {
      console.warn(`Warning: ${at} has no class name — re-run export_classes.py — skipping`);
      continue;
    }
    out[key] = {
      // The game's own token for this archetype (`Class_Blaster`). Carried
      // because the effect gates compare against it directly — an archetype-
      // forked atom names the classes it applies to in this spelling, and the
      // engine matches a build against it (AT-FORK-1). Reconstructing it from
      // the hyphenated id would be authoring a naming convention the export
      // already states.
      className: data.name,
      baseHP: hpTable[PLAYER_LEVELS - 1],
      maxHP: hpCapTable[PLAYER_LEVELS - 1],
      absorbCap: absorbCapTable[PLAYER_LEVELS - 1],
      resistanceCap: r4(a.resistance_cap),
      baseThreat: r4(a.base_threat),
      damageCap: r4(a.damage_cap),
      ...bounds,
      ...movement,
      ...ceilings,
      hpTable,
      hpCapTable,
      absorbCapTable,
    };
    console.log(`  ${key}: baseHP=${out[key].baseHP} maxHP=${out[key].maxHP} resCap=${out[key].resistanceCap} threat=${out[key].baseThreat} dmgCap=${out[key].damageCap}`);
  }
  return out;
}

function fmtArray(arr, indent = 4) {
  const perLine = 10;
  const pad = ' '.repeat(indent);
  const lines = ['['];
  for (let i = 0; i < arr.length; i += perLine) {
    const chunk = arr.slice(i, i + perLine).join(', ');
    lines.push(`${pad}  ${chunk}${i + perLine < arr.length ? ',' : ''}`);
  }
  lines.push(`${pad}]`);
  return lines.join('\n');
}

function fmtAxes(axes) {
  const body = Object.entries(axes).map(([axis, v]) => `${axis}: ${v}`).join(', ');
  return `{ ${body} }`;
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
  L.push(' * baseThreat (Phase 2 header scalar), damageCap (Phase 3 StrengthMax),');
  L.push(' * the absorb ceiling (AttribMaxMax Absorb row — the clamp on absorb shields),');
  L.push(' * and the net-strength clamp bounds (StrengthMin / StrengthMax) of the two');
  L.push(' * reduction aspects: rechargeFloor/rechargeCap (the −75% debuff floor and the');
  L.push(' * +400% recharge cap) and enduranceFloor/enduranceCap (a divide-guard epsilon');
  L.push(' * and the +400% endurance-discount cap), plus movementBase/movementCapTable');
  L.push(' * (Phase 5 — the travel scales and the per-level ceilings ClampCur bounds them');
  L.push(' * against, in scale units: 1.0 = 21 ft/s for the speeds, 4 ft for jump height),');
  L.push(' * and the attribute ceilings of Phase 6 (DATA-GAP-REGISTER CAPS-1): toHit/');
  L.push(' * regeneration/recovery as a base scalar plus a per-level cap table, the single');
  L.push(' * per-level defenseCeilingTable (a real clamp far ABOVE the purple-patch softcap,');
  L.push(' * which is a threshold and stays separate), and maxEndurance base/cap.');
  L.push(' */');
  L.push('');
  L.push('/** One value per travel axis, keyed as the calc totals key them. */');
  L.push('export interface MovementAxes {');
  L.push('  runSpeed: number;');
  L.push('  flySpeed: number;');
  L.push('  jumpSpeed: number;');
  L.push('  jumpHeight: number;');
  L.push('}');
  L.push('');
  L.push('/** Per-level ceiling per travel axis (index = level − 1). */');
  L.push('export interface MovementAxisTables {');
  L.push('  runSpeed: number[];');
  L.push('  flySpeed: number[];');
  L.push('  jumpSpeed: number[];');
  L.push('  jumpHeight: number[];');
  L.push('}');
  L.push('');
  L.push('export interface ArchetypeBinaryStats {');
  L.push('  baseHP: number;');
  L.push('  maxHP: number;');
  L.push('  absorbCap: number;');
  L.push('  resistanceCap: number;');
  L.push('  baseThreat: number;');
  L.push('  damageCap: number;');
  L.push('  rechargeFloor: number;');
  L.push('  rechargeCap: number;');
  L.push('  enduranceFloor: number;');
  L.push('  enduranceCap: number;');
  L.push('  movementBase: MovementAxes;');
  L.push('  movementCapTable: MovementAxisTables;');
  L.push('  toHitBase: number;');
  L.push('  toHitCapTable: number[];');
  L.push('  regenerationBase: number;');
  L.push('  regenerationCapTable: number[];');
  L.push('  recoveryBase: number;');
  L.push('  recoveryCapTable: number[];');
  L.push('  defenseCeilingTable: number[];');
  L.push('  maxEnduranceTable: number[];');
  L.push('  maxEnduranceCapTable: number[];');
  L.push('  hpTable: number[];');
  L.push('  hpCapTable: number[];');
  L.push('  absorbCapTable: number[];');
  L.push('  /** The game\'s own class token (`Class_Blaster`) — what the effect gates');
  L.push('   *  compare against, so an archetype-forked atom can be matched to a build. */');
  L.push('  className: string;');
  L.push('}');
  L.push('');
  L.push('export const ARCHETYPE_BINARY_STATS: Record<string, ArchetypeBinaryStats> = {');
  for (const [key, s] of Object.entries(stats)) {
    L.push(`  '${key}': {`);
    L.push(`    className: '${s.className}',`);
    L.push(`    baseHP: ${s.baseHP},`);
    L.push(`    maxHP: ${s.maxHP},`);
    L.push(`    absorbCap: ${s.absorbCap},`);
    L.push(`    resistanceCap: ${s.resistanceCap},`);
    L.push(`    baseThreat: ${s.baseThreat},`);
    L.push(`    damageCap: ${s.damageCap},`);
    L.push(`    rechargeFloor: ${s.rechargeFloor},`);
    L.push(`    rechargeCap: ${s.rechargeCap},`);
    L.push(`    enduranceFloor: ${s.enduranceFloor},`);
    L.push(`    enduranceCap: ${s.enduranceCap},`);
    L.push(`    movementBase: ${fmtAxes(s.movementBase)},`);
    L.push('    movementCapTable: {');
    for (const [axis, row] of Object.entries(s.movementCapTable)) {
      L.push(`      ${axis}: ${fmtArray(row, 6)},`);
    }
    L.push('    },');
    L.push(`    toHitBase: ${s.toHitBase},`);
    L.push(`    toHitCapTable: ${fmtArray(s.toHitCapTable)},`);
    L.push(`    regenerationBase: ${s.regenerationBase},`);
    L.push(`    regenerationCapTable: ${fmtArray(s.regenerationCapTable)},`);
    L.push(`    recoveryBase: ${s.recoveryBase},`);
    L.push(`    recoveryCapTable: ${fmtArray(s.recoveryCapTable)},`);
    L.push(`    defenseCeilingTable: ${fmtArray(s.defenseCeilingTable)},`);
    L.push(`    maxEnduranceTable: ${fmtArray(s.maxEnduranceTable)},`);
    L.push(`    maxEnduranceCapTable: ${fmtArray(s.maxEnduranceCapTable)},`);
    L.push(`    hpTable: ${fmtArray(s.hpTable)},`);
    L.push(`    hpCapTable: ${fmtArray(s.hpCapTable)},`);
    L.push(`    absorbCapTable: ${fmtArray(s.absorbCapTable)},`);
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
