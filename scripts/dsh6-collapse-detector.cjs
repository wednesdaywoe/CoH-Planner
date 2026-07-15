/**
 * DSH6 general per-slot collapse detector.
 *
 * The DSH3 collapse detector could only check the resistible/unresistable twin
 * (it had no attrib→slot routing map — the converter output had already discarded
 * the attrib identity). DSH4 shipped that map (the `bridgeAttrib` bridge in
 * `src/data/core/atomic-effect.ts`), so a *general* per-slot detector is now
 * possible. This is that detector, and the gate the DSH6 converter rework drives
 * to zero one site at a time.
 *
 * SINGLE SOURCE: the input side reuses the DSH4 bridge (`ingestExportPower`) via
 * `tsx/cjs` — the attrib→(effectType,subType) map is never re-ported here.
 *
 * Per power: INPUT = bridge atoms from the source `exported_powers/**.json` (what
 * SHOULD survive); OUTPUT = every effect identity reachable anywhere in the generated
 * Power object (effects + damage + specialEffects + conditionalEffects). It runs TWO
 * complementary gates, both keyed to the DSH4 identity and both only firing when the
 * effectType is otherwise present ("class-present, sibling-missing" → cannot be
 * confused with the converter's legitimate whole-class target drops, which land in a
 * separate non-gating "class-absent" bucket):
 *
 *   BY-TYPE gate (DSH6a) — a by-type sub-type (Resistance|Fire, Mez|Hold, …) with no
 *     output slot. Folds pvMode/resistible/table out. FP-free (5 traced fixes).
 *     Finding: clean by-type collapse does NOT occur in HC (the by-type maps prevent
 *     it); the residual is target-directed / conditional, not last-write-wins.
 *   SCALAR gate (DSH6b) — the site-A table-variant collapse the by-type gate folds
 *     out: two same-(effectType,sign) SCALAR templates on DIFFERENT tables where
 *     last-write-wins keeps one (Lightning Field: -0.5 Melee_EndDrain dropped, -0.03
 *     Melee_Ones kept). A TRIAGE REPORT, not yet a CI-hard gate (some pairs are helper
 *     templates the bin resolves at DSH7-numeric). resistible folded out (buffs have no
 *     twin — DSH3 gates debuff twins).
 *
 * SINGLE SOURCE: both gates' input reuses the DSH4 bridge (`ingestExportPower`) via
 * `tsx/cjs` — the attrib→(effectType,subType) map is never re-ported here. Runs in CI
 * (all inputs committed, unlike DSH5's gitignored `.mhd`).
 *
 * Usage:
 *   node scripts/dsh6-collapse-detector.cjs                 # HC sweep, write worklist json
 *   node scripts/dsh6-collapse-detector.cjs --top 40        # + print top 40 groups per gate
 *   node scripts/dsh6-collapse-detector.cjs --power Flash    # only powers whose name matches
 */

require('tsx/cjs');
const fs = require('fs');
const path = require('path');
const { ingestExportPower } = require('../src/data/core/atomic-effect.ts');

const REPO = path.resolve(__dirname, '..');
const GEN_ROOT = path.join(REPO, 'src/data/datasets/homecoming/generated/powersets');
const EXPORT_BASE = path.join(REPO, 'exported_powers'); // HC flat layout
const OUT_PATH = path.join(REPO, 'scripts', 'dsh6-collapse-worklist.json');

const argv = process.argv.slice(2);
const argVal = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : undefined; };
const TOP = argVal('--top') ? parseInt(argVal('--top'), 10) : 0;
const POWER_FILTER = argVal('--power');

// ---------------------------------------------------------------------------
// OUTPUT-side slot table: converter slot key → { effectType, sign, byType }.
// Mirrors the routing in extractEffects (convert-powerset.cjs). `sign` is set
// only for slots that inherently encode buff/debuff direction; null where the
// effect has no direction (mez/kb/movement/stealth/summon are inherently applied).
// byType: the slot value is a { subKey: {...} } map (one entry per damage/position/mez type).
// ---------------------------------------------------------------------------
const SLOT_TABLE = {
  // damage-output strength (aspect=Str) — excluded from INPUT check (DSH4 Enhancement
  // boundary) but still collected as representation to stay generous/FP-safe.
  damageBuff: { et: 'DamageBuff', sign: '+' },
  damageDebuff: { et: 'DamageBuff', sign: '-' },
  // resistance (by damage/position type)
  resistance: { et: 'Resistance', sign: '+', byType: true },
  resistanceDebuff: { et: 'Resistance', sign: '-', byType: true },
  // defense (scalar for base_defense OR by-type map — value shape varies; handled below)
  defenseBuff: { et: 'Defense', sign: '+', byTypeOrScalar: true },
  defenseDebuff: { et: 'Defense', sign: '-', byTypeOrScalar: true },
  defenseBuffSuppressible: { et: 'Defense', sign: '+', byTypeOrScalar: true },
  elusivity: { et: 'Elusivity', sign: null, byType: true },
  // mez (each mezType is its own top-level slot)
  hold: { et: 'Mez', sign: null, sub: 'Held' },
  stun: { et: 'Mez', sign: null, sub: 'Stunned' },
  sleep: { et: 'Mez', sign: null, sub: 'Sleep' },
  immobilize: { et: 'Mez', sign: null, sub: 'Immobilized' },
  confuse: { et: 'Mez', sign: null, sub: 'Confused' },
  fear: { et: 'Mez', sign: null, sub: 'Terrorized' },
  taunt: { et: 'Mez', sign: null, sub: 'Taunt' },
  placate: { et: 'Mez', sign: null, sub: 'Placate' },
  teleport: { et: 'Mez', sign: null, sub: 'Teleport' },
  untouchable: { et: 'Mez', sign: null, sub: 'Untouchable' },
  onlyAffectsSelf: { et: 'Mez', sign: null, sub: 'OnlyAffectsSelf' },
  knockback: { et: 'Mez', sign: null, sub: 'Knockback' },
  knockup: { et: 'Mez', sign: null, sub: 'Knockup' },
  repel: { et: 'Mez', sign: null, sub: 'Repel' },
  mezResistance: { et: 'MezResist', sign: null, byType: true },
  // movement (by axis) — buff (movement) vs slow both applied; sign null.
  // movementCapBump holds the aspect=Maximum speed-cap raises (Super Speed
  // +1.938 run cap etc.) split out of `movement` 2026-07-12 — same Movement
  // class, distinct output slot so the Current-aspect buff isn't clobbered.
  movement: { et: 'Movement', sign: null, byType: true },
  movementCapBump: { et: 'Movement', sign: null, byType: true },
  slow: { et: 'Movement', sign: null, byType: true },
  // resources
  maxHPBuff: { et: 'MaxHP', sign: '+' },
  maxHPBuffUnenhanced: { et: 'MaxHP', sign: '+' }, // IgnoreStrength half of the +MaxHP twin (Inexhaustible/High Pain Tolerance/Dull Pain)
  healing: { et: 'MaxHP', sign: '+' }, // heal shares MaxHP bridge? no — heal is effectType Heal; healing slot excluded from input check
  maxEndBuff: { et: 'MaxEndurance', sign: '+' },
  enduranceGain: { et: 'Endurance', sign: '+' },
  enduranceDrain: { et: 'Endurance', sign: '-' },
  recoveryBuff: { et: 'Recovery', sign: '+' },
  recoveryBuffUnenhanced: { et: 'Recovery', sign: '+' },
  recoveryDebuff: { et: 'Recovery', sign: '-' },
  regenBuff: { et: 'Regeneration', sign: '+' },
  regenBuffUnenhanced: { et: 'Regeneration', sign: '+' },
  regenDebuff: { et: 'Regeneration', sign: '-' },
  absorb: { et: 'Absorb', sign: '+' },
  // combat modifiers
  tohitBuff: { et: 'ToHit', sign: '+' },
  tohitBuffUnenhanced: { et: 'ToHit', sign: '+' },
  tohitDebuff: { et: 'ToHit', sign: '-' },
  accuracyBuff: { et: 'Accuracy', sign: '+' },
  accuracyDebuff: { et: 'Accuracy', sign: '-' },
  rechargeBuff: { et: 'RechargeTime', sign: '+' },
  rechargeDebuff: { et: 'RechargeTime', sign: '-' },
  threatBuff: { et: 'ThreatLevel', sign: '+' },
  threatDebuff: { et: 'ThreatLevel', sign: '-' },
  rangeBuff: { et: 'Range', sign: '+' },
  rangeDebuff: { et: 'Range', sign: '-' },
  enduranceDiscount: { et: 'EnduranceDiscount', sign: '+' },
  perceptionBuff: { et: 'Perception', sign: '+' },
  perceptionDebuff: { et: 'Perception', sign: '-' },
  stealth: { et: 'Stealth', sign: null, byType: true },
  // debuffResistance is a by-key map to MANY effectTypes (defense/recovery/regen/tohit/…):
  // collected specially below (each child key names the resisted effectType).
};

// debuffResistance child key → the effectType it represents resistance to.
const DEBUFFRES_CHILD_ET = {
  defense: 'Defense', movement: 'Movement', endurance: 'Endurance',
  recovery: 'Recovery', regeneration: 'Regeneration', tohit: 'ToHit',
  accuracy: 'Accuracy', recharge: 'RechargeTime', range: 'Range', perception: 'Perception',
};

// Meta keys inside an effects bag that carry no effect identity.
const META_SLOT = new Set([
  'durations', 'buffDuration', 'effectDuration', 'maxStacks', 'stacksLinear',
  'stackInterval', 'stackCaps', 'selfPenalty', 'summon',
]);

// ---------------------------------------------------------------------------
// INPUT-side scope. v1 targets ONLY by-type sibling collapse (the multi-type
// explosion — the biggest, cleanest collapse class), over effectTypes with a
// clean, aspect-stable, table-independent bridge↔converter correspondence.
// Excluded from v1 (tracked as coverage, never mis-flagged):
//   - aspect=Str  → the Power-Boost→specialBuff Enhancement boundary (DSH4/DSH6).
//   - aspect=Res base-defense (Resistance|All) → converter's debuffResistance (DDR).
//   - exotic resist types the converter's DAMAGE_TYPES map omits (radiation/…).
//   - KB subtypes (foe KB-protection has documented target-conditional drops).
//   - all SCALAR effectTypes (ToHit/Recovery/…) — their collapse is same-key
//     last-write-wins across pvMode/table, which needs pvMode/table in the key
//     (a later detector pass), not the by-type key used here.
// ---------------------------------------------------------------------------
const CHECKABLE_ET = new Set(['Defense', 'Resistance', 'Elusivity', 'Mez', 'MezResist', 'Movement']);
// effectTypes whose slots encode sign (buff/debuff split) — match sign strictly.
const SIGNED_ET = new Set(['Defense', 'Resistance']);

// Canonical subtype token: map BOTH the bridge subType names and the converter
// slot keys onto one token, so `Run`(bridge) and `runSpeed`(slot) — or
// `Confused`/`confuse` — compare equal.
const CANON_SUB = {
  // damage types
  smashing: 'smashing', lethal: 'lethal', fire: 'fire', cold: 'cold', energy: 'energy',
  negative: 'negative', toxic: 'toxic', psionic: 'psionic',
  // positions
  melee: 'melee', ranged: 'ranged', aoe: 'aoe', area: 'aoe',
  // mez: bridge name AND converter slot key → canonical (converter key)
  held: 'hold', hold: 'hold', stunned: 'stun', stun: 'stun', sleep: 'sleep', slept: 'sleep',
  immobilized: 'immobilize', immobilize: 'immobilize', confused: 'confuse', confuse: 'confuse',
  terrorized: 'fear', afraid: 'fear', fear: 'fear', taunt: 'taunt', placate: 'placate',
  teleport: 'teleport', untouchable: 'untouchable', onlyaffectsself: 'onlyaffectsself',
  // movement: bridge Run/Fly/Jump AND converter runSpeed/flySpeed/jumpSpeed → canonical
  run: 'run', runspeed: 'run', fly: 'fly', flyspeed: 'fly', jump: 'jump', jumpspeed: 'jump',
  jumpheight: 'jumpheight', control: 'control', movementcontrol: 'control',
  friction: 'friction', movementfriction: 'friction',
  all: 'all',
};
const normSub = (s) => (s == null ? '' : (CANON_SUB[String(s).toLowerCase()] ?? String(s).toLowerCase()));
const tableNorm = (t) => (t == null ? '' : String(t).toLowerCase());

// Mirror the converter's PvP-variant drop EXACTLY (convert-powerset.cjs:667,1037):
// HC splits many powers into `enttype target> critter eq` (PvE) and
// `enttype target> player eq` (PvP) groups, BOTH tagged is_pvp='EITHER', so the
// is_pvp='PVP_ONLY' flag doesn't catch them — the requires clause does. The bridge
// doesn't evaluate requires, so without this every such PvP twin false-positives
// (Lightning Field's -0.5 Melee_EndDrain is the `player eq` variant; the -0.03
// Melee_Ones `critter eq` PvE value is what correctly survives).
//
// A second PvP-split shape gates on `isPVPMap?` — a template that only applies on
// PvP maps. The PvE twin negates it (`isPVPMap? !`); the PvP twin uses it straight.
// The PvE planner shows the PvE branch, so drop the straight (non-negated) form.
// Enforced Morale is the exemplar: its confuse/fear/hold/immob/stun mez-RESISTANCE
// lives ONLY on the `isPVPMap?` branch (+3), while PvE keeps just sleep-resist (+5,
// `isPVPMap? !`) — the converter drops the former, so the detector must too or every
// one of those 5 resist attribs false-positives. The negative lookahead `(?!\s+!)`
// matches `isPVPMap?` used positively (PvP) and spares the negated `isPVPMap? !` (PvE).
const isPvpVariant = (a) => {
  const req = a.requiresExpression || '';
  return /\benttype\s+target>\s+player\s+eq/.test(req) || /\bisPVPMap\?(?!\s+!)/.test(req);
};

// Allowed (checkable) subtypes per effectType — anything else is coverage, not a flag.
const STD_TYPE = new Set(['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'toxic', 'psionic', 'melee', 'ranged', 'aoe']);
const MEZ_SUB = new Set(['hold', 'stun', 'sleep', 'immobilize', 'confuse', 'fear', 'taunt', 'placate', 'teleport', 'untouchable', 'onlyaffectsself']);
const MOVE_AXIS = new Set(['run', 'fly', 'jump', 'jumpheight', 'control', 'friction']);
function checkableSub(et, canon) {
  if (et === 'Resistance') return STD_TYPE.has(canon);            // NOT 'all' (that is base-defense DDR)
  if (et === 'Defense') return STD_TYPE.has(canon) || canon === 'all';
  if (et === 'Elusivity') return STD_TYPE.has(canon) || canon === 'all';
  if (et === 'Mez' || et === 'MezResist') return MEZ_SUB.has(canon);
  if (et === 'Movement') return MOVE_AXIS.has(canon);
  return false;
}

// ---------------------------------------------------------------------------
// Collect the set of represented identities from a whole generated Power object.
// Identity = `effectType|subType|sign`, with sign '' where unsigned. Also record a
// set of effectTypes that appear at all (class-present test).
// ---------------------------------------------------------------------------
function collectRepresented(power) {
  const ids = new Set();       // `et|sub|sign`
  const classes = new Set();   // et present anywhere
  const scalar = new Set();    // `et|sign|R/U|table`  (scalar-identity gate, DSH6b)
  const add = (et, sub, sign) => {
    const s = normSub(sub);
    classes.add(et);
    ids.add(`${et}|${s}|${sign ?? ''}`);
    if (sign) ids.add(`${et}|${s}|`); // also index sign-agnostic for unsigned matching
  };
  // Record a scalar slot's structural identity `(effectType, sign, table)`.
  // resistible is folded OUT: the converter only surfaces it for DEBUFF twins
  // (via the `unresistable` flag, already gated by DSH3), never for buffs — so
  // keying on it here would false-positive every self-buff. This gate targets the
  // site-A *table*-variant collapse (two same-(et,sign) templates on different
  // tables → last-write-wins keeps one).
  const addScalar = (et, sign, val) => {
    if (!val || typeof val !== 'object') return;
    classes.add(et);
    scalar.add(`${et}|${sign}|${tableNorm(val.table)}`);
  };

  const walkBag = (bag) => {
    if (!bag || typeof bag !== 'object') return;
    for (const [key, val] of Object.entries(bag)) {
      if (META_SLOT.has(key)) continue;
      if (key === 'debuffResistance' && val && typeof val === 'object') {
        for (const child of Object.keys(val)) {
          const et = DEBUFFRES_CHILD_ET[child.toLowerCase()];
          if (et) add(et, '', null); // resistance-to-X: represents effectType X (unsigned)
        }
        continue;
      }
      const slot = SLOT_TABLE[key];
      if (!slot) continue;
      if (slot.byType && val && typeof val === 'object') {
        for (const sub of Object.keys(val)) add(slot.et, sub, slot.sign);
      } else if (slot.byTypeOrScalar && val && typeof val === 'object') {
        // base_defense scalar → {scale,table}; by-type → {smashing:{...}}.
        const childKeys = Object.keys(val);
        const isScalar = 'scale' in val || 'table' in val || 'unresistable' in val;
        if (isScalar) add(slot.et, 'All', slot.sign);
        else for (const sub of childKeys) add(slot.et, sub, slot.sign);
      } else if (slot.sub) {
        add(slot.et, slot.sub, slot.sign);
      } else {
        add(slot.et, '', slot.sign);
        addScalar(slot.et, slot.sign, val); // pure scalar slot → scalar-identity gate
      }
    }
  };

  // 1) base effects bag
  walkBag(power.effects);
  // 2) any sibling container that holds effects bags (specialEffects,
  //    conditionalEffects, ammo variants, …). Deep-walk generically: any nested
  //    object with an `effects` bag, or that itself looks like an effects bag.
  const deep = (node, depth) => {
    if (!node || typeof node !== 'object' || depth > 6) return;
    if (Array.isArray(node)) { for (const n of node) deep(n, depth + 1); return; }
    if (node.effects && typeof node.effects === 'object') walkBag(node.effects);
    // also treat any object whose keys are known slots as a bag
    for (const [k, v] of Object.entries(node)) {
      if (SLOT_TABLE[k] || k === 'debuffResistance') { walkBag(node); break; }
    }
    for (const v of Object.values(node)) if (v && typeof v === 'object') deep(v, depth + 1);
  };
  for (const k of ['specialEffects', 'conditionalEffects', 'grantedDamageProcs']) {
    if (power[k]) deep(power[k], 0);
  }
  // 3) damage field: represents effectType Damage for the listed types.
  if (Array.isArray(power.damage)) {
    for (const d of power.damage) if (d && d.type) add('Damage', '', '+');
  } else if (power.damage && typeof power.damage === 'object') {
    for (const t of Object.keys(power.damage)) add('Damage', '', '+');
  }
  return { ids, classes, scalar };
}

// ---------------------------------------------------------------------------
// SCALAR-identity gate (DSH6b). The by-type gate above folds pvMode/resistible/
// table out; the historical collapse family (site A last-write-wins, twin, PvP,
// duration) lives on exactly those axes for SCALAR effectTypes (one slot, no
// subType). Key each scalar atom by `(effectType, sign, resistible, table)` —
// mirroring DSH5's structuralKey — and flag when that identity is absent from
// output while the effectType is present. aspect=Str (→specialBuff) and aspect=Res
// (→debuffResistance) are excluded (separate relabel families, as in by-type).
// ---------------------------------------------------------------------------
const SCALAR_CHECK_ET = new Set([
  'ToHit', 'Accuracy', 'RechargeTime', 'Range', 'ThreatLevel', 'Perception',
  'Recovery', 'Regeneration', 'Endurance', 'MaxHP', 'MaxEndurance', 'Absorb',
  'EnduranceDiscount',
]);
function scalarInputIdentities(sourceJson) {
  let atoms;
  try { atoms = ingestExportPower(sourceJson); } catch { return []; }
  const out = [];
  for (const a of atoms) {
    if (a.pvMode === 'PvP' || isPvpVariant(a)) continue;      // PvP-only group (flag OR `player eq` requires)
    if (!a.scale) continue;
    if (a.attribType === 'Expression') continue;
    // aspect=Str is the Power-Boost→specialBuff relabel family — EXCEPT for
    // Range and Accuracy, which have no Current variant: their Strength aspect
    // IS the primary buff/debuff form and routes to real slots (rangeBuff/
    // rangeDebuff/accuracyBuff — see the COMBAT section of extractEffects).
    // Excluding them blinded this gate to the Power of the Depths class of
    // drop (ally +Range silently skipped, CI green for ~2 months): PotD's
    // +37.5% Range atom is aspect=Str, so it never entered the check at all.
    const strIsPrimary = a.effectType === 'Range' || a.effectType === 'Accuracy';
    if ((a.aspect === 'Str' && !strIsPrimary) || a.aspect === 'Res') continue; // specialBuff / debuffResistance families
    if (!SCALAR_CHECK_ET.has(a.effectType)) continue;
    const isDebuff = a.scale < 0 || /debuff/i.test(a.modifierTable || '');
    const sign = isDebuff ? '-' : '+';
    out.push({ et: a.effectType, sign, table: tableNorm(a.modifierTable),
               sourceAttrib: a.sourceAttrib, scale: a.scale });
  }
  return out;
}

// ---------------------------------------------------------------------------
// INPUT-side: source atoms → checkable surviving identities.
// ---------------------------------------------------------------------------
function inputIdentities(sourceJson) {
  let atoms;
  try { atoms = ingestExportPower(sourceJson); } catch { return []; }
  const out = [];
  for (const a of atoms) {
    // ---- by-design drop filter (generous → FP-safe) ----
    if (a.pvMode === 'PvP' || isPvpVariant(a)) continue; // PvP-only group (flag OR `player eq` requires)
    if (!a.scale) continue;                            // scale 0 = marker/no-op
    if (a.attribType === 'Expression') continue;       // engine phantoms / caps
    if (a.aspect === 'Str') continue;                  // Power-Boost → specialBuff (Enhancement boundary)
    if (a.aspect === 'Res' && a.effectType === 'Movement') continue; // slow-RES → debuffResistance.movement
    if (!CHECKABLE_ET.has(a.effectType)) continue;     // scalar/DamageBuff/Heal/Damage/engine/Unmapped
    const subL = normSub(a.subType);
    if (!checkableSub(a.effectType, subL)) continue;   // exotic type / KB / base-defense DDR / unrouted mez
    // Sign matches the converter's own `isDebuff` rule: a foe -Def/-Res debuff is
    // stored as POSITIVE scale on a `*_Debuff_*` table (the table carries the
    // direction, not the scale). Deriving sign from scale alone mis-splits those.
    const isDebuff = a.scale < 0 || /debuff/i.test(a.modifierTable || '');
    const sign = SIGNED_ET.has(a.effectType) ? (isDebuff ? '-' : '+') : null;
    out.push({ et: a.effectType, sub: subL, sign, sourceAttrib: a.sourceAttrib, table: a.modifierTable, scale: a.scale });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Walk generated tree, dedupe by source path, run the check.
// ---------------------------------------------------------------------------
function findGenerated() {
  const bySource = new Map(); // sourceRel → generated file path (first seen)
  const stack = [GEN_ROOT];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.name.endsWith('.ts')) {
        const head = fs.readFileSync(p, 'utf-8').slice(0, 600);
        const m = head.match(/Source:\s*(\S+\.json)/);
        if (m && !bySource.has(m[1])) bySource.set(m[1], p);
      }
    }
  }
  return bySource;
}

function main() {
  const bySource = findGenerated();
  const collapses = [];   // {power, et, sub, sign, sourceAttrib, table, scale}
  const classAbsent = []; // {power, et, sub, sign, ...}  (whole effectType missing — non-gating)
  const scalarCollapses = [];   // scalar-identity gate: class-present, (sign,resistible,table) variant missing
  const scalarClassAbsent = []; // scalar effectType wholly absent (non-gating)
  const cov = { powersTotal: 0, powersChecked: 0, sourceMissing: 0, requireFail: 0,
                atomsChecked: 0, scalarChecked: 0 };

  for (const [sourceRel, genPath] of bySource) {
    cov.powersTotal++;
    const srcPath = path.join(EXPORT_BASE, sourceRel);
    if (!fs.existsSync(srcPath)) { cov.sourceMissing++; continue; }
    let genMod, sourceJson;
    try { genMod = require(genPath); } catch { cov.requireFail++; continue; }
    try { sourceJson = JSON.parse(fs.readFileSync(srcPath, 'utf-8')); } catch { cov.sourceMissing++; continue; }
    const power = Object.values(genMod).find((v) => v && typeof v === 'object' && v.effects) || {};
    const powerName = power.name || sourceRel;
    if (POWER_FILTER && !powerName.toLowerCase().includes(POWER_FILTER.toLowerCase())) continue;
    cov.powersChecked++;

    const { ids, classes, scalar } = collectRepresented(power);
    const inputs = inputIdentities(sourceJson);
    // de-dupe input identities (a power lists many equal atoms)
    const seen = new Set();
    for (const inp of inputs) {
      const idSigned = `${inp.et}|${inp.sub}|${inp.sign ?? ''}`;
      const idUnsigned = `${inp.et}|${inp.sub}|`;
      if (seen.has(idSigned)) continue;
      seen.add(idSigned);
      cov.atomsChecked++;
      const represented = inp.sign ? ids.has(idSigned) : ids.has(idUnsigned);
      if (represented) continue;
      const rec = { power: powerName, source: sourceRel, et: inp.et, sub: inp.sub,
                    sign: inp.sign, sourceAttrib: inp.sourceAttrib, table: inp.table, scale: inp.scale };
      if (classes.has(inp.et)) collapses.push(rec);   // class-present, sibling-missing = HIGH-confidence collapse
      else classAbsent.push(rec);                     // whole class absent = ambiguous (non-gating)
    }

    // ---- scalar-identity gate (DSH6b) ----
    const seenS = new Set();
    for (const inp of scalarInputIdentities(sourceJson)) {
      const id = `${inp.et}|${inp.sign}|${inp.table}`;
      if (seenS.has(id)) continue;
      seenS.add(id);
      cov.scalarChecked++;
      if (scalar.has(id)) continue;                   // exact (et,sign,table) present
      const rec = { power: powerName, source: sourceRel, et: inp.et, sign: inp.sign,
                    table: inp.table, sourceAttrib: inp.sourceAttrib, scale: inp.scale };
      if (classes.has(inp.et)) scalarCollapses.push(rec); // class-present, table-variant missing
      else scalarClassAbsent.push(rec);
    }
  }

  // group collapses by (et, sub, sign) signature
  const groups = new Map();
  for (const c of collapses) {
    const k = `${c.et}|${c.sub}|${c.sign ?? ''}`;
    if (!groups.has(k)) groups.set(k, { et: c.et, sub: c.sub, sign: c.sign, count: 0, powers: [] });
    const g = groups.get(k); g.count++; if (g.powers.length < 12) g.powers.push(c.power);
  }
  const groupList = [...groups.values()].sort((a, b) => b.count - a.count);
  const absentGroups = new Map();
  for (const c of classAbsent) {
    const k = `${c.et}|${c.sub}|${c.sign ?? ''}`;
    if (!absentGroups.has(k)) absentGroups.set(k, { et: c.et, sub: c.sub, sign: c.sign, count: 0, powers: [] });
    const g = absentGroups.get(k); g.count++; if (g.powers.length < 8) g.powers.push(c.power);
  }
  // group scalar collapses by (et, sign) — the missing-table varies per power
  const sGroups = new Map();
  for (const c of scalarCollapses) {
    const k = `${c.et}|${c.sign}`;
    if (!sGroups.has(k)) sGroups.set(k, { et: c.et, sign: c.sign, count: 0, powers: [], tables: new Set() });
    const g = sGroups.get(k); g.count++; g.tables.add(c.table); if (g.powers.length < 12) g.powers.push(c.power);
  }
  const sGroupList = [...sGroups.values()].map((g) => ({ ...g, tables: [...g.tables].slice(0, 6) }))
    .sort((a, b) => b.count - a.count);
  // group scalar class-absent by (et, sign) — now first-class output: the
  // completeness gate makes whole-class-absent GATING (the PotD blind spot).
  const sAbsentGroups = new Map();
  for (const c of scalarClassAbsent) {
    const k = `${c.et}|${c.sign}`;
    if (!sAbsentGroups.has(k)) sAbsentGroups.set(k, { et: c.et, sign: c.sign, count: 0, powers: [] });
    const g = sAbsentGroups.get(k); g.count++; if (g.powers.length < 8) g.powers.push(c.power);
  }
  const sAbsentList = [...sAbsentGroups.values()].sort((a, b) => b.count - a.count);

  const result = {
    schema: 'dsh6-collapse-worklist/1',
    scope: {
      byTypeGate: 'by-type sibling collapse (multi-type explosion) over Defense/Resistance/' +
              'Elusivity/Mez/MezResist/Movement — an input sub-type with no output slot while ' +
              'the effectType is present. FP-free (5 traced fixes). Finding: clean by-type ' +
              'collapse does not occur in HC; residual is target-directed / conditional. ' +
              '2026-07-05: ally/team MOVEMENT buffs are now emitted (converter movement branch ' +
              'routes non-Self aspect=Current buffs to effects.movement — Speed Boost/Accelerate ' +
              'Metabolism +run/fly, Inertial Reduction +jump, Group Fly team fly; calc ' +
              'ALLY_ONLY_TARGET_TYPES gate keeps ally-only powers off caster totals), clearing the ' +
              'Movement flags. isPVPMap? PvP-map atoms now filtered like `player eq` (Enforced ' +
              'Morale mez-RESIST is PvP-map-only; its PvE sleep-resist + full mez PROTECTION already ' +
              'render). Remaining 2 collapses = display-name aggregation across NPC variants ' +
              '(Focused Fighting/ESD Arrow), not player last-write-wins; class-absent = control/ ' +
              'combo/self-conditional edge cases (Telekinesis, Genetic Corruption, Savage Leap).',
      scalarGate: 'site-A table-variant collapse over scalar effectTypes (ToHit/Recovery/Regen/' +
              'Endurance/…): two same-(effectType,sign) templates on DIFFERENT tables where ' +
              'last-write-wins keeps one. resistible folded OUT (buffs have no twin; DSH3 gates ' +
              'debuff twins); the PvP `enttype target> player eq` variant is dropped exactly as ' +
              'the converter does (mirrors convert-powerset.cjs:667). NOW AT ZERO: this surfaced ' +
              'one real bug — the conditional pipeline (collectConditionalsGrouped) omitted that ' +
              'PvP-drop, so Beam Rifle Disintegrate kept the PvP -3/Ranged_Res_Boolean regen over ' +
              'the PvE -0.75/Ranged_Ones (Mids-confirmed). Fixed 2026-07-05 → gate green (0).',
      excluded: 'aspect=Str (→specialBuff Enhancement), aspect=Res (→debuffResistance), PvP-only, ' +
                'scale-0 markers, Expression phantoms, exotic resist types, KB protection.',
      signRule: 'sign follows the converter (scale<0 OR table matches /debuff/), not scale alone.',
    },
    coverage: cov,
    summary: {
      highConfidenceCollapses: collapses.length,
      distinctCollapseGroups: groupList.length,
      classAbsent: classAbsent.length,
      scalarCollapses: scalarCollapses.length,
      scalarDistinctGroups: sGroupList.length,
      scalarClassAbsent: scalarClassAbsent.length,
    },
    collapseGroups: groupList,
    classAbsentGroups: [...absentGroups.values()].sort((a, b) => b.count - a.count),
    scalarCollapseGroups: sGroupList,
    scalarClassAbsentGroups: sAbsentList,
    scalarCollapses,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));

  console.log(`\nDSH6 collapse detector — HC sweep`);
  console.log(`  powers: ${cov.powersChecked}/${cov.powersTotal} checked (source-missing ${cov.sourceMissing}, require-fail ${cov.requireFail})`);
  console.log(`  BY-TYPE gate  : atoms ${cov.atomsChecked} · collapses ${collapses.length} (${groupList.length} groups) · class-absent ${classAbsent.length}`);
  console.log(`  SCALAR gate   : atoms ${cov.scalarChecked} · collapses ${scalarCollapses.length} (${sGroupList.length} groups) · class-absent ${scalarClassAbsent.length}`);
  console.log(`  worklist → ${path.relative(REPO, OUT_PATH)}`);

  // -------------------------------------------------------------------------
  // COMPLETENESS GATE (DSH6 Phase 0b, --gate). The PotD lesson: a whole-
  // effect-type drop landed in the non-gating class-absent bucket and stayed
  // CI-green for two months. Under --gate, EVERY group — collapse AND
  // class-absent, by-type AND scalar — must appear in the frozen, reason-
  // annotated allowlist (scripts/dsh6-gate-allowlist.json) or the run fails.
  // Growing the allowlist requires a commit that explains WHY the drop is by
  // design, which is exactly the review moment the old bucket skipped.
  // -------------------------------------------------------------------------
  if (argv.includes('--gate')) {
    let allow;
    try {
      allow = JSON.parse(fs.readFileSync(path.join(__dirname, 'dsh6-gate-allowlist.json'), 'utf-8'));
    } catch (e) {
      console.error('GATE ERROR — cannot read scripts/dsh6-gate-allowlist.json:', e.message);
      process.exit(1);
    }
    const violations = [];
    const check = (list, keyFn, allowMap, label) => {
      for (const g of list) {
        const k = keyFn(g);
        if (!allowMap || !(k in allowMap)) {
          violations.push(`${label}: ${k} ×${g.count}  (e.g. ${g.powers.slice(0, 3).join(', ')})`);
        }
      }
    };
    check(groupList, (g) => `${g.et}|${g.sub}|${g.sign ?? ''}`, allow.byTypeCollapse, 'by-type COLLAPSE');
    check([...absentGroups.values()], (g) => `${g.et}|${g.sub}|${g.sign ?? ''}`, allow.classAbsent, 'by-type CLASS-ABSENT');
    check(sGroupList, (g) => `${g.et}|${g.sign}`, allow.scalarCollapse, 'scalar COLLAPSE');
    check(sAbsentList, (g) => `${g.et}|${g.sign}`, allow.scalarClassAbsent, 'scalar CLASS-ABSENT');
    if (violations.length > 0) {
      console.error(`\nGATE FAIL — ${violations.length} group(s) not in the frozen allowlist:`);
      for (const v of violations) console.error(`  ${v}`);
      console.error('\nEither the converter dropped something it should emit (fix the converter),');
      console.error('or the drop is by design (add the key to scripts/dsh6-gate-allowlist.json');
      console.error('with a reason — that addition is the review the gate exists to force).');
      process.exit(1);
    }
    console.log('  GATE PASS — every group is enumerated in dsh6-gate-allowlist.json.');
  }
  if (TOP) {
    console.log(`\n  top ${TOP} BY-TYPE collapse groups (effectType|subType|sign  ×count  e.g. powers):`);
    for (const g of groupList.slice(0, TOP)) {
      console.log(`   ${String(g.count).padStart(4)}  ${g.et}|${g.sub}|${g.sign ?? ''}   ${g.powers.slice(0, 5).join(', ')}`);
    }
    console.log(`\n  top ${TOP} SCALAR collapse groups (effectType|sign  ×count  e.g. powers · missing tables):`);
    for (const g of sGroupList.slice(0, TOP)) {
      console.log(`   ${String(g.count).padStart(4)}  ${g.et}|${g.sign}   ${g.powers.slice(0, 4).join(', ')}   [${g.tables.slice(0, 3).join(', ')}]`);
    }
  }
}

main();
