/**
 * audit-allowed-set-categories.cjs
 *
 * Validates the `allowedSetCategories` field on every archetype power by:
 *   1. Re-running `inferAllowedSetCategories` from convert-powerset.cjs against
 *      the source JSON and comparing to the composed (generated ⊕ override)
 *      value the planner actually uses. Any disagreement is "drift": either
 *      the generated layer needs regen or an override is silently masking an
 *      inference bug.
 *   2. Applying independent invariants to the composed value:
 *        - Damage boost → power has at least one damage-flavor category
 *        - Range ≥ 150 + Damage → has Sniper Attacks
 *        - Range 0 + Damage (no Range boost) → no Ranged/Sniper damage flavor
 *        - Ranged (Range boost + Damage) → no Melee/Melee AoE flavor
 *        - Heal boost → Healing (or Accurate Healing if Accuracy is also present)
 *        - Hold boost → Holds; Immobilize → Immobilize; etc.
 *        - Damaging AT power → carries that AT's archetype sets category
 *
 * Scope: the 26 archetype categories in CATEGORY_MAP (not pool/epic/incarnate).
 * Pool and epic powers have their own generators that the same logic mostly
 * applies to — can be added later.
 *
 * Usage:
 *   node scripts/audit-allowed-set-categories.cjs              # summary + first N of each
 *   node scripts/audit-allowed-set-categories.cjs --all        # full listings
 *   node scripts/audit-allowed-set-categories.cjs --drift      # drift only
 *   node scripts/audit-allowed-set-categories.cjs --invariants # invariants only
 */

const fs = require('fs');
const path = require('path');
const {
  inferAllowedSetCategories,
  inferEffectiveArea,
  CATEGORY_MAP,
  EFFECT_AREA_MAP,
  toKebabCase,
} = require('./convert-powerset.cjs');

const REPO_ROOT = path.resolve(__dirname, '..');
const RAW_DATA = path.join(REPO_ROOT, 'exported_powers');
const GEN_ROOT = path.join(REPO_ROOT, 'src', 'data', 'generated', 'powersets');
const OVR_ROOT = path.join(REPO_ROOT, 'src', 'data', 'overrides', 'powersets');

const args = process.argv.slice(2);
const SHOW_ALL = args.includes('--all');
const ONLY_DRIFT = args.includes('--drift');
const ONLY_INVARIANTS = args.includes('--invariants');
const LIMIT = SHOW_ALL ? Infinity : 30;

// ─── helpers ────────────────────────────────────────────────────────────────

function readJsonSafe(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

/**
 * Extract the `allowedSetCategories` array literal from a generated or override
 * .ts file. Both files are machine-formatted with a stable shape
 * (`"allowedSetCategories": [ ... ]`), so a simple regex suffices. Returns
 * null when the field isn't present.
 */
function extractAllowedCategories(tsPath) {
  if (!fs.existsSync(tsPath)) return null;
  const src = fs.readFileSync(tsPath, 'utf8');
  const m = src.match(/"allowedSetCategories":\s*(\[[^\]]*\])/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort(), sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

function diff(actual, expected) {
  const a = new Set(actual), e = new Set(expected);
  const missing = [...e].filter(x => !a.has(x));
  const extra = [...a].filter(x => !e.has(x));
  return { missing, extra };
}

// Replicate the AT-slug extraction convert-powerset.cjs uses at call time.
function resolveCategoryInfo(category) {
  const info = CATEGORY_MAP[category];
  if (info) return info;
  // Suffix-stripped aliases (_aux → core category) don't appear in
  // CATEGORY_MAP; skip those here — they feed into redirects, not picks.
  return null;
}

function composedPath(archetype, type, powersetSlug, powerSlug) {
  return path.join(GEN_ROOT, archetype, type, powersetSlug, powerSlug + '.ts');
}

function overridePath(archetype, type, powersetSlug, powerSlug) {
  return path.join(OVR_ROOT, archetype, type, powersetSlug, powerSlug + '.ts');
}

/**
 * Recreate the exact call that convert-powerset.cjs makes so the audit is
 * apples-to-apples, including the redirect probe (Head Splitter is marked
 * SingleTarget in the main file but redirects to a Cone AoE) and the
 * location-teleport special case (Shield Charge, Lightning Rod).
 */
function inferForPower(powerJson, archetypeId, type) {
  const powerType = type; // ignored by inferAllowedSetCategories today
  const redirectArea = inferEffectiveArea(powerJson);
  const hasTeleportAttrib = (powerJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
  );
  const isLocationTeleport = (powerJson.effect_area === 'Location' && hasTeleportAttrib);
  const effectiveArea = redirectArea
    ?? (isLocationTeleport ? 'AoE' : (EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area));
  const boosts = (redirectArea || isLocationTeleport)
    ? (powerJson.boosts_allowed || []).filter(b => b !== 'Range')
    : (powerJson.boosts_allowed || []);
  return inferAllowedSetCategories(
    boosts,
    archetypeId,
    powerType,
    effectiveArea,
    powerJson.range,
    powerJson.powerset || powerJson.full_name,
    hasTeleportAttrib,
  );
}

// ─── invariants ─────────────────────────────────────────────────────────────

const DAMAGE_FLAVOR_CATEGORIES = new Set([
  'Melee Damage', 'Ranged Damage', 'Melee AoE Damage', 'Ranged AoE Damage',
  'Sniper Attacks', 'Pet Damage',
]);
const RANGED_DAMAGE_CATEGORIES = new Set([
  'Ranged Damage', 'Ranged AoE Damage', 'Sniper Attacks',
]);
const MELEE_DAMAGE_CATEGORIES = new Set([
  'Melee Damage', 'Melee AoE Damage',
]);

const ARCHETYPE_DAMAGE_ATO = {
  blaster: 'Blaster Archetype Sets',
  brute: 'Brute Archetype Sets',
  corruptor: 'Corruptor Archetype Sets',
  defender: 'Defender Archetype Sets',
  scrapper: 'Scrapper Archetype Sets',
  sentinel: 'Sentinel Archetype Sets',
  stalker: 'Stalker Archetype Sets',
  tanker: 'Tanker Archetype Sets',
  'arachnos-soldier': 'Soldiers of Arachnos Archetype Sets',
  'arachnos-widow': 'Soldiers of Arachnos Archetype Sets',
  peacebringer: 'Kheldian Archetype Sets',
  warshade: 'Kheldian Archetype Sets',
};

const BOOST_REQUIRED_CATEGORY = {
  Heal: 'Healing',
  Healing: 'Healing',
  Hold: 'Holds',
  Stun: 'Stuns',
  Confuse: 'Confuse',
  Sleep: 'Sleep',
  Fear: 'Fear',
  Immobilize: 'Immobilize',
  Knockback: 'Knockback',
  Slow: 'Slow Movement',
  Taunt: 'Threat Duration',
  Debuff_Defense: 'Defense Debuff',
  Debuff_ToHit: 'To Hit Debuff',
  Buff_Defense: 'Defense Sets',
  Defense: 'Defense Sets',
  Res_Damage: 'Resist Damage',
  Resistance: 'Resist Damage',
  Buff_ToHit: 'To Hit Buff',
  ToHit: 'To Hit Buff',
};

function checkInvariants(powerJson, archetypeId, composed) {
  const issues = [];
  const boosts = new Set(powerJson.boosts_allowed || []);
  const cats = new Set(composed);
  const area = EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area;
  const range = powerJson.range || 0;
  const hasDamage = boosts.has('Damage');
  const hasRange = boosts.has('Range');

  // Leap / teleport / redirect-AoE attacks have a Range boost (for the leap
  // itself) but deliver damage as Melee AoE around the landing point.
  // Detect Teleport and Execute_Power attribs; when present, skip the
  // melee/ranged flavor-mismatch invariants.
  const hasTeleportAttrib = (powerJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
  );
  const hasExecutePower = (powerJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'execute_power')
  );
  const hasCreateEntity = (powerJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'create_entity')
  );
  const isLeapOrTeleportAttack = hasTeleportAttrib || hasExecutePower;
  // Pet summons / self-targeted placements (Auto Turret, Acid Mortar) have
  // range 0 and target_type Self, but the pet itself does ranged AoE. Skip
  // the melee/ranged flavor check on these — the category describes the
  // pet's output, not the placement power.
  const isPetOrSelfPlacement = hasCreateEntity || powerJson.target_type === 'Self';

  // Boost → category (exact pair). Accurate variants are context-dependent
  // and handled below.
  for (const b of boosts) {
    const req = BOOST_REQUIRED_CATEGORY[b];
    if (req && !cats.has(req)) {
      // Accuracy + debuff/heal powers may substitute the plain category with
      // the "Accurate" variant — allow that.
      if (b === 'Heal' || b === 'Healing') {
        if (boosts.has('Accuracy') && cats.has('Accurate Healing')) continue;
      }
      if (b === 'Debuff_Defense') {
        if (boosts.has('Accuracy') && cats.has('Accurate Defense Debuff')) continue;
      }
      if (b === 'Debuff_ToHit') {
        if (boosts.has('Accuracy') && cats.has('Accurate To-Hit Debuff')) continue;
      }
      issues.push(`boost ${b} → missing category "${req}"`);
    }
  }

  if (hasDamage) {
    // Must have at least one damage flavor (besides Universal)
    const hasFlavor = [...cats].some(c => DAMAGE_FLAVOR_CATEGORIES.has(c));
    if (!hasFlavor) issues.push('damage boost but no Melee/Ranged/AoE/Sniper flavor');

    // Universal Damage should always be present on damage powers
    if (!cats.has('Universal Damage Sets')) {
      issues.push('damage boost but missing "Universal Damage Sets"');
    }

    // Sniper gate: range >= 150 single-target with a Range boost (Assassin
    // Strikes have range 150 but no Range enhancement — they're melee,
    // not snipers).
    if (range >= 150 && hasRange && area === 'SingleTarget' && !cats.has('Sniper Attacks')) {
      issues.push(`range ${range} ST → missing "Sniper Attacks"`);
    }

    // Melee-only shouldn't carry Ranged flavor. Skip pet summons and
    // Execute_Power redirects (e.g. turrets that shoot ranged while the
    // host power is marked melee).
    if (!hasRange && range === 0 && !hasExecutePower && !isPetOrSelfPlacement) {
      for (const c of cats) {
        if (RANGED_DAMAGE_CATEGORIES.has(c)) issues.push(`melee power has ranged damage category "${c}"`);
      }
    }
    // Ranged shouldn't carry Melee flavor. Skip leap/teleport/redirect-AoE
    // attacks, which have a Range boost for travel but do melee damage on
    // arrival (Shield Charge, Lightning Rod, Savage Leap, etc.).
    if (hasRange && range > 0 && !isLeapOrTeleportAttack) {
      for (const c of cats) {
        if (MELEE_DAMAGE_CATEGORIES.has(c)) issues.push(`ranged power has melee damage category "${c}"`);
      }
    }

    // AT damage → AT archetype sets
    const ato = ARCHETYPE_DAMAGE_ATO[archetypeId];
    if (ato && !cats.has(ato)) {
      issues.push(`${archetypeId} damage power missing "${ato}"`);
    }
  }

  return issues;
}

// ─── walk ───────────────────────────────────────────────────────────────────

const driftRows = []; // { category, powerset, power, missing, extra, hasOverride }
const invariantRows = []; // { category, powerset, power, issues }
const stats = {
  powersScanned: 0,
  skippedNoTs: 0,
  overriddenCats: 0,
};

for (const category of fs.readdirSync(RAW_DATA).sort()) {
  const catInfo = resolveCategoryInfo(category);
  if (!catInfo) continue; // skip pool/epic/redirect/etc. for now
  const catDir = path.join(RAW_DATA, category);
  if (!fs.statSync(catDir).isDirectory()) continue;

  for (const powerset of fs.readdirSync(catDir).sort()) {
    const psDir = path.join(catDir, powerset);
    if (!fs.statSync(psDir).isDirectory()) continue;
    const indexJson = readJsonSafe(path.join(psDir, 'index.json'));
    if (!indexJson) continue;
    const psSlug = toKebabCase(indexJson.display_name);

    for (const file of fs.readdirSync(psDir)) {
      if (file === 'index.json' || !file.endsWith('.json')) continue;
      const pJson = readJsonSafe(path.join(psDir, file));
      if (!pJson) continue;
      const powerSlug = toKebabCase(pJson.name);

      const genPath = composedPath(catInfo.archetype, catInfo.type, psSlug, powerSlug);
      const ovrPath = overridePath(catInfo.archetype, catInfo.type, psSlug, powerSlug);
      const generated = extractAllowedCategories(genPath);
      if (generated === null) { stats.skippedNoTs++; continue; }
      const override = extractAllowedCategories(ovrPath);
      const composed = override ?? generated;
      const hasOverride = override !== null;
      if (hasOverride) stats.overriddenCats++;
      stats.powersScanned++;

      // DRIFT — inference vs composed
      const inferred = inferForPower(pJson, catInfo.archetype, catInfo.type);
      if (!arraysEqual(inferred, composed)) {
        const { missing, extra } = diff(composed, inferred);
        driftRows.push({
          category, powerset: psSlug, power: powerSlug,
          missing, extra, hasOverride,
        });
      }

      // INVARIANTS — on the composed (final) value
      const issues = checkInvariants(pJson, catInfo.archetype, composed);
      if (issues.length > 0) {
        invariantRows.push({ category, powerset: psSlug, power: powerSlug, issues });
      }
    }
  }
}

// ─── report ─────────────────────────────────────────────────────────────────

function printRows(title, rows, formatRow) {
  console.log(`\n=== ${title} (${rows.length}) ===`);
  const shown = rows.slice(0, LIMIT);
  for (const r of shown) console.log(formatRow(r));
  if (rows.length > shown.length) {
    console.log(`... ${rows.length - shown.length} more (run with --all to see)`);
  }
}

console.log(`Scanned ${stats.powersScanned} archetype powers ` +
            `(${stats.overriddenCats} with allowedSetCategories override, ` +
            `${stats.skippedNoTs} skipped — no generated .ts).`);

if (!ONLY_INVARIANTS) {
  // Split drift: overrides are expected drift between inference and composed;
  // lift them into their own section so they don't drown the real bugs.
  const bugs = driftRows.filter(r => !r.hasOverride);
  const overridden = driftRows.filter(r => r.hasOverride);

  printRows('DRIFT — inference disagrees with generated (regen candidates)', bugs, r =>
    `  ${r.category}/${r.powerset}/${r.power}` +
    (r.missing.length ? `\n    + add:    ${r.missing.join(', ')}` : '') +
    (r.extra.length   ? `\n    - remove: ${r.extra.join(', ')}` : '')
  );
  printRows('DRIFT — masked by an override (review if override is still needed)', overridden, r =>
    `  ${r.category}/${r.powerset}/${r.power}` +
    (r.missing.length ? `\n    + add:    ${r.missing.join(', ')}` : '') +
    (r.extra.length   ? `\n    - remove: ${r.extra.join(', ')}` : '')
  );
}

if (!ONLY_DRIFT) {
  printRows('INVARIANT VIOLATIONS — composed value fails a sanity check', invariantRows, r =>
    `  ${r.category}/${r.powerset}/${r.power}\n    - ${r.issues.join('\n    - ')}`
  );
}

const exitCode = (driftRows.some(r => !r.hasOverride) || invariantRows.length > 0) ? 1 : 0;
process.exit(exitCode);
