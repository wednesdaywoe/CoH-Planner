/**
 * Convert Pet Entity & Power Data
 *
 * Reads entity files + their power files from raw data,
 * outputs a TypeScript data module with pet abilities for damage calculation.
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, dataPath, datasetPath } = require('./_dataset-paths.cjs');

const datasetId = parseDatasetArg();

// Read from the per-dataset bin-crawler export — the committed,
// manifest-guarded `exported_powers/` trees (HC at the root, Rebirth and
// Thunderspy in subdirectories). All are organized as
//   <root>/entities/*.json
//   <root>/<powerset_category>/<powerset>/<power>.json
// so we share the same `<root>` for both lookups. (HC previously read the
// gitignored `tools/bin-crawler/exported_powers/live/` local tree, which
// went stale against the committed export.)
const EXPORT_ROOTS = {
  homecoming: path.join(__dirname, '../exported_powers'),
  rebirth: path.join(__dirname, '../exported_powers/rebirth'),
  thunderspy: path.join(__dirname, '../exported_powers/thunderspy'),
};
const ROOT = EXPORT_ROOTS[datasetId];
if (!ROOT || !fs.existsSync(ROOT)) {
  throw new Error(`No bin-crawler export root for dataset '${datasetId}'. Looked at ${ROOT}`);
}
const ENTITIES_PATH = path.join(ROOT, 'entities');
const POWERS_PATH = ROOT;

// Absent is a real state (entity power references can point at powers the
// export doesn't carry); a corrupt file must surface, never read as "absent" —
// that silently omits the pet or its power from the committed output.
function readJsonFile(filePath) {
  let text;
  try {
    text = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`Corrupt JSON in ${filePath}: ${err.message}`);
  }
}

// pet-entities was migrated into datasets/<id>/pet-entities.ts during the
// first wave of Stage A. Both HC and Rebirth write through datasetPath().
const OUTPUT_PATH = datasetPath(datasetId, 'pet-entities.ts');

// Sidecar JSON of entity_def → lifespan_seconds, consumed by convert-powerset.cjs
// to populate summon.duration when a summoning power's EntCreate AttribMod has
// Duration=0 (the lifespan lives on the pet's bundled Self_Destruct power instead).
// Kept alongside the script so build pipelines that run convert-pet-entities first
// can require() it directly without parsing the generated TS.
const SIDECAR_LIFESPANS_PATH = datasetPath(datasetId, 'pet-lifespans.json');

// Sidecar JSON of fully-qualified Self_Destruct power name → delay seconds.
// Used for pseudopet summons (PL_StaticObject, Vines pseudo-pets) whose
// `params.redirects` array names a `*.Self_Destruct` redirect power — those
// pseudopets aren't backed by a pet entity file, so the entity-keyed sidecar
// can't reach them. Built by scanning every `self_destruct.json` in the bin
// export, regardless of which category it lives in.
const SIDECAR_SELF_DESTRUCT_PATH = datasetPath(datasetId, 'self-destruct-delays.json');

// Damage type attributes we care about
const DAMAGE_ATTRIBS = new Set([
  'smashing_dmg', 'lethal_dmg', 'fire_dmg', 'cold_dmg',
  'energy_dmg', 'negative_energy_dmg', 'toxic_dmg', 'psionic_dmg',
]);

// Thunderspy stores pet damage with a single generic `Damage` attrib on a
// `*_Damage` table (the element lives only in the shortHelp `DMG(...)`), and its
// AttribMod schema DROPS the aspect — so neither the specific-`*_Dmg`-attrib gate
// nor the `aspect === 'Absolute'` gate below can fire. Without a tspy branch every
// melee/attack pet extracted ZERO damage, so ~287 of 619 pets (the pure-attack ones
// like Howler Wolf, Demonlings, Knight Minion) were dropped as "no combat abilities"
// and their summoning power surfaced only the pet NAME. This mirrors the player-power
// `applyThunderspyDamageType` handling in convert-powerset.cjs.
const _TSPY = datasetId === 'thunderspy';
const _DMG_TYPE_MAP = {
  smash: 'Smashing', smashing: 'Smashing', lethal: 'Lethal', fire: 'Fire',
  cold: 'Cold', energy: 'Energy', negative: 'Negative', 'negative energy': 'Negative',
  psionic: 'Psionic', toxic: 'Toxic', special: 'Special',
};
// Primary damage element from a shortHelp `DMG(...)` clause (e.g.
// "Melee, Light DMG(Lethal)" → "Lethal"); null when absent. Multi-type collapses
// to the primary element, matching the player-power path (element label only —
// the scale/table drive the actual damage math).
function _tspyDamageType(shortHelp) {
  if (!shortHelp) return null;
  // `DoT(...)` as well as `DMG(...)`: a pure damage-over-time pet attack carries
  // its element only in the DoT clause, which the DMG-only match left `Special`.
  const m = shortHelp.match(/D(?:MG|oT)\(([^)]+)\)/i);
  if (!m) return null;
  const first = m[1].split(/[/,]/)[0].trim().toLowerCase();
  return _DMG_TYPE_MAP[first] || null;
}

// Mez/control attributes
const MEZ_ATTRIBS = {
  'sleep': 'Sleep',
  'held': 'Hold',
  'stunned': 'Stun',
  'terrorized': 'Fear',
  'afraid': 'Fear',
  'confused': 'Confuse',
  'immobilized': 'Immobilize',
  'knockback': 'Knockback',
  'knockup': 'Knockup',
  'taunt': 'Taunt',
};

// Debuff attributes (negative effects on targets)
const DEBUFF_ATTRIBS = {
  'endurance': 'EndDrain',
  'recovery': 'RecoveryDebuff',
  'tohit': 'ToHitDebuff',
  'base_defense': 'DefenseDebuff',
  'runningspeed': 'Slow',
  'flyingspeed': 'Slow',
  'jumpingspeed': 'Slow',
  'jumpheight': 'Slow',
  'rechargetime': 'Slow',
};

// Thunderspy pet debuff vocabulary. Its Parse6-derived schema names the APPLIED
// attrib directly (Slow, Debuff_Def, DeBuff_ToHit, Res_DMG, …) — NOT the HC
// position/resource attribs DEBUFF_ATTRIBS keys on — AND drops the per-template
// target. So the HC map never fires and every location/patch pseudo-pet
// (Freezing Rain, Sleet, Tar Patch, Caltrops, Ice Slick, Fallout, …) surfaced
// only its damage, dropping the -res / -def / -speed that IS the point of the
// power (the player power carries just Create_Entity; all the debuffs live on
// the summoned pet). Mez already works — tspy's Held/Stunned/Confused/… lower-
// case-match MEZ_ATTRIBS — so this covers only the debuffs. Mirrors the generic-
// `Damage` handling (extractDamage) and the player-power tspy path in
// convert-powerset.cjs (target-drop + sign-trap guards).
//
// Two families, discriminated the way the shipped player path does it (tspy
// drops the aspect, so name + table + sign are the only signals — GAME-DATA §3):
//  • Name-encoded foe debuffs — the attrib name itself carries the debuff, so
//    it is always foe-facing; surfaced at |scale| regardless of stored sign
//    (Caltrops stores Slow +0.8 but SpeedRunning -1.0 — both foe slows). Slow /
//    Speed* route to the app's single movement `Slow` (-Speed) bucket, matching
//    how convert-powerset.cjs classifies a mod on a `*_Slow` table.
//  • Sign-discriminated resource attribs — Res_DMG is +N for a pet SELF-buff
//    (survivability, e.g. blaster_time Res_DMG +2.0) and -N for a foe debuff
//    (Freezing Rain Res_DMG -1.0). Positive = self-buff → dropped (matches HC
//    dropping pet ResistAll self-buffs); negative = the foe debuff we surface.
//    These are further gated to a REAL magnitude table: Thunderspy also carries
//    Recovery / Endurance as bare MARKERS on a `*_Ones` placeholder table (the
//    actual -End rides the separate `EndDrain` attrib on a real `*_EndDrain`
//    table) whose scale is not a computable percentage — surfacing those printed
//    a meaningless ~100% (and mislabeled +Recovery ally-buffs like Adrenalin
//    Boost / Guardianship as "-Recovery"). The `*_Ones` guard drops the markers
//    while keeping the real-table debuffs (Res_DMG→ResistanceDebuff,
//    EndDrain→EndDrain). -Regeneration is intentionally absent: the pet panel has
//    no RegenDebuff display, so there's nothing to show.
// The `debuff_*` keys are CATEGORY tokens — what a tspy effect element carries at its
// front. Since the parser began reading each AttribMod's own index array (TSPY-4) most
// of these arrive under their real HC attrib name instead (`Base_Defense`, `ToHit`, the
// movement stats), so both spellings must map: the token for the elements that still
// front one, the real name for the mods that now name themselves. Without the real
// names every location/patch pseudo-pet lost the -Def half again — Sleet's
// `Base_Defense 3.0 Melee_Debuff_Def` is byte-identical to its HC and Rebirth twins.
const _TSPY_DEBUFF_NAMED = {
  'slow': 'Slow', 'speedrunning': 'Slow', 'speedflying': 'Slow', 'speedjumping': 'Slow',
  'debuff_def': 'DefenseDebuff', 'debuff_tohit': 'ToHitDebuff', 'debuff_dam': 'DamageDebuff',
  'base_defense': 'DefenseDebuff', 'tohit': 'ToHitDebuff',
  'runningspeed': 'Slow', 'flyingspeed': 'Slow', 'jumpingspeed': 'Slow',
  'jumpheight': 'Slow', 'rechargetime': 'Slow',
};
const _TSPY_DEBUFF_SIGNED = {
  'res_dmg': 'ResistanceDebuff', 'recovery': 'RecoveryDebuff',
  'endurance': 'EndDrain', 'enddrain': 'EndDrain',
};

// ---------------------------------------------------------------------------
// Ally-buff-aura vocabulary (buff-pets: Force Field Generator, Barrier Reef,
// Triage Beacon, Tree of Life, …). These "floaty" pets exist only to project a
// PBAoE buff onto the caster/team. The buff lives on the pet's own toggle/Auto
// power (FFG's Dispersion_Bubble) or on a Redirect power the entity references
// (Marine's Wellspring_Barrier_Def) — either way it reaches extractEffects as a
// template with target != Self (an aura), positive scale, and a buff aspect.
//
// The historical extractEffects vocabulary was ENTIRELY foe-facing (mez / debuff
// / -res) plus ally Heal, so these Def/Res/Absorb auras were parsed from the bin
// and then silently dropped on conversion — the root cause of "buff-pet stats
// can't be seen in your totals." A pet's OWN self-buff (FFG's ResistAll) stays
// dropped because it targets Self and never reaches this vocabulary.
//
// Defense attribs arrive as bare position/type names (Ranged/Melee/Area +
// Smashing/Lethal/…) on a `*_Buff_Def` table; normalize each to the calc's
// def sub-type key (matches DEFENSE_POSITIONS + the damage-type keys in
// character-totals' GlobalBonuses: defMelee/defRanged/defAoE/defSmashing/…).
const BUFF_DEF_TYPE_MAP = {
  melee: 'melee', ranged: 'ranged', area: 'aoe', aoe: 'aoe',
  smashing: 'smashing', lethal: 'lethal', fire: 'fire', cold: 'cold',
  energy: 'energy', negative_energy: 'negative', negative: 'negative',
  psionic: 'psionic', toxic: 'toxic',
};

// Resistance-buff attribs arrive as damage-type `*_Dmg` names on a resistance
// aspect; normalize to the calc's res sub-type key (resSmashing/resLethal/…).
const BUFF_RES_TYPE_MAP = {
  smashing_dmg: 'smashing', lethal_dmg: 'lethal', fire_dmg: 'fire', cold_dmg: 'cold',
  energy_dmg: 'energy', negative_energy_dmg: 'negative', psionic_dmg: 'psionic',
  toxic_dmg: 'toxic',
};

// Scalar ally-buff attribs (single-value stats). aspect=Current + positive scale.
// Several of these attribs ALSO key DEBUFF_ATTRIBS (a negative `recovery` is a
// -Recovery debuff, a negative `rechargetime` is a Slow) — so the caller must
// skip the debuff path for an attrib we've consumed here as a positive buff, or
// a Triage-Beacon-style +Regen aura would emit both a RegenBuff and a phantom
// debuff. Regeneration isn't in DEBUFF_ATTRIBS, but list it here for symmetry.
const BUFF_SCALAR_ATTRIBS = {
  regeneration: 'RegenBuff',
  recovery: 'RecoveryBuff',
  tohit: 'ToHitBuff',
  rechargetime: 'RechargeBuff',
};

/**
 * Classify an ally-buff-aura template (Defense / Resistance / Absorb / +Regen /
 * +Recovery / +ToHit / +Recharge — the vocabulary of "floaty" buff-pets: Force
 * Field Generator, Barrier Reef, Triage Beacon, …). Returns `{ effects, consumed }`:
 * `effects` is an array of buff PetEffect objects (Defense/Resistance collapse
 * their many sub-type attribs into ONE effect carrying a `defenseTypes`/
 * `resistanceTypes` list — one aura buffs all of them at the same scale/table);
 * `consumed` is the set of lowercased attrib names turned into buffs, which the
 * caller uses to suppress the overlapping DEBUFF_ATTRIBS classification. Both are
 * empty for a non-buff template, so the caller falls through to mez/debuff/heal.
 *
 * Gating (all datasets — keyed on table/aspect/attrib, which survive the tspy
 * aspect-drop for the table-based branches):
 *  • target != Self is already guaranteed by isDebuffTemplate at the call site.
 *  • scale > 0 — a negative scale here is a foe DEBUFF (a -Defense on a Buff_Def
 *    table, a -ToHit, a Slow), handled by the DEBUFF_ATTRIBS path, not here.
 */
function extractBuffAura(template) {
  const out = [];
  const consumed = new Set();
  const scale = template.scale;
  if (!(typeof scale === 'number' && scale > 0) || !template.table) {
    return { effects: out, consumed };
  }
  const aspect = template.aspect;
  const tableLower = template.table.toLowerCase();
  const attribsLower = (template.attribs || []).map(a => a.toLowerCase());

  // Buff vs debuff is encoded in the TABLE name, not the sign: a foe -ToHit is
  // stored as a POSITIVE scale on a `*_Debuff_ToHit` table (verified: Liquefy
  // 2.856, Earthquake 1.0), and a -Recharge foe debuff rides a `*_Slow` table.
  // So an ally buff is a positive scale on a table that is neither (mirrors
  // convert-powerset's `isDebuff = scale < 0 || table.includes('debuff')`).
  const isBuffTable = !tableLower.includes('debuff') && !tableLower.endsWith('_slow');

  // Defense buff: `*_Buff_Def` table (aspect Current). Collect every def sub-type.
  // The leading underscore + debuff guard keeps `*_Debuff_Def` (a foe -Def) out.
  if (/_buff_def$/.test(tableLower) && isBuffTable) {
    const defenseTypes = [];
    for (const a of attribsLower) {
      const key = BUFF_DEF_TYPE_MAP[a];
      if (key && !defenseTypes.includes(key)) { defenseTypes.push(key); consumed.add(a); }
    }
    if (defenseTypes.length > 0) {
      out.push({ type: 'DefenseBuff', scale, table: template.table, defenseTypes });
    }
  }

  // Resistance buff to allies: positive aspect=Resistance on damage-type attribs.
  // (A pet's own +res is target=Self and never reaches here.)
  if (aspect === 'Resistance') {
    const resistanceTypes = [];
    for (const a of attribsLower) {
      const key = BUFF_RES_TYPE_MAP[a];
      if (key && !resistanceTypes.includes(key)) { resistanceTypes.push(key); consumed.add(a); }
    }
    if (resistanceTypes.length > 0) {
      out.push({ type: 'ResistanceBuff', scale, table: template.table, resistanceTypes });
    }
  }

  // Absorb: `Absorb` attrib. aspect=Maximum → the game folds this to a flat
  // absorb amount off a Heal table (the MaxHP-fraction form is an Expression the
  // pet parser doesn't carry; convert-powerset treats non-Expression Maximum
  // absorb as flat too). Carry the aspect for provenance; the calc resolves it
  // as a flat {scale,table} absorb.
  if (attribsLower.includes('absorb')) {
    out.push({ type: 'Absorb', scale, table: template.table, absorbAspect: aspect });
    consumed.add('absorb');
  }

  // Scalar buffs (+Regen / +Recovery / +ToHit / +Recharge). aspect=Current, on a
  // buff (non-debuff, non-slow) table — the table gate is what separates an ally
  // +ToHit aura from the many foe -ToHit debuff pseudo-pets (Liquefy, Earthquake,
  // Seekers) that store their debuff as a positive scale on a `*_Debuff_ToHit`
  // table.
  if (aspect === 'Current' && isBuffTable) {
    for (const a of attribsLower) {
      const type = BUFF_SCALAR_ATTRIBS[a];
      if (type) {
        out.push({ type, scale, table: template.table });
        consumed.add(a);
      }
    }
  }

  return { effects: out, consumed };
}

// Attrib cache values that indicate non-attack utility powers
const UTILITY_ATTRIBS = new Set([
  'fly', 'untouchable', 'translucency', 'stealth',
  'grant_power', 'revoke_power', 'set_mode', 'set_costume',
  'teleport', 'entcreate',
]);

// Power names that are always utility
const UTILITY_POWER_PATTERNS = [
  /^resistall$/i,
  /^invisible$/i,
  /^immobilize$/i,  // Self-immobilize for stationary pets
  /^fly$/i,
  /^hover$/i,
  /^phase$/i,
  /^stealth$/i,
  /^teleport$/i,
  /^grant_/i,
  /^set_mode/i,
];

/**
 * Check if a power is a utility/non-combat power we should skip
 */
function isUtilityPower(powerData) {
  const name = powerData.name.toLowerCase();

  // Check name patterns
  for (const pattern of UTILITY_POWER_PATTERNS) {
    if (pattern.test(name)) return true;
  }

  // If attrib_cache only has utility attribs, skip
  // But keep powers that have combat-relevant effects (damage, mez, debuffs)
  const attribCache = (powerData.attrib_cache || []).map(a => a.toLowerCase());
  if (attribCache.length > 0) {
    const hasCombatAttrib = attribCache.some(a =>
      DAMAGE_ATTRIBS.has(a) ||
      MEZ_ATTRIBS[a] !== undefined ||
      DEBUFF_ATTRIBS[a] !== undefined
    );
    if (!hasCombatAttrib && attribCache.every(a =>
      UTILITY_ATTRIBS.has(a) ||
      a === 'null' ||
      a.startsWith('resist') ||
      a.startsWith('defense') ||
      a === 'fly' ||
      a === 'translucency' ||
      a === 'stealth'
    )) {
      return true;
    }
  }

  // Self-targeting immobilize (stationary pets)
  if (name === 'immobilize' && powerData.target_type === 'Self') return true;

  return false;
}

// A PvE/PvP `enttype` pair is split into `enttype target> critter eq` (PvE) and
// `enttype target> player eq` (PvP) groups, BOTH tagged is_pvp='EITHER', so the
// PVP_ONLY flag never catches the PvP half — this requires clause does. Same
// helper (and same RPN spelling) as convert-powerset.cjs `isPvpEnttypeVariant`
// and validate-converter-output.cjs. This converter previously matched the
// CoD2 *infix* spelling `target>enttype eq 'player'`, which the parser never
// emits, so the guard was dead: every summoned rain/storm pet kept BOTH halves
// of its damage pair. Blizzard read four sources (Lethal 0.05 + PvE Cold 0.05 +
// PvP Cold 0.01 + PvP Cold 0.09) instead of two; Ice Storm and Rain of Fire
// read three instead of one.
function isPvpEnttypeVariant(requiresExpression) {
  return /\benttype\s+target>\s+player\s+eq/i.test(requiresExpression || '');
}

// Thunderspy spells the same split as an `isPVPMap?` check (negated for the PvE
// half), so read both idioms — reading only one leaves tspy pets double-counted.
function isPvpMapOnly(requiresExpression) {
  return /\bisPVPMap\?(?!\s+!)/i.test(requiresExpression || '');
}

/** True for any effect group that only applies on a PvP map / to a player
 *  target. The planner has no PvP mode, so the PvE twin is always preferred
 *  (GAME-DATA-PRINCIPLES §3). Dropping the whole group also drops its
 *  child_effects subtree, matching convert-powerset.cjs `collectTemplatesDeep`. */
function isPvpOnlyGroup(effectGroup) {
  if (!effectGroup) return false;
  if (effectGroup.is_pvp === 'PVP_ONLY') return true;
  const req = effectGroup.requires_expression || '';
  return isPvpEnttypeVariant(req) || isPvpMapOnly(req);
}

/**
 * True for a bonus-damage group gated on a target-state window the pet does not
 * always satisfy: `now <Token> target.TokenTime> - <N> <` ("the target was hit by
 * <Token> in the last N seconds").
 *
 * Singularity's Lift carries Gravity Control's Impact group (`GravityDistortion`,
 * 12s, scale 0.33 on top of the 1.32 base). This converter has no conditional-gate
 * filter at all, so it summed both and showed Lift as ALWAYS dealing 1.65 — a +25%
 * over-count, the exact mirror of the powerset converter dropping the same group
 * entirely (see `_isUntoggleableGate` in convert-powerset.cjs). A pet's powers carry
 * no user toggles, so the honest reading is base damage only.
 *
 * Deliberately narrow: this converter still lacks the general
 * `_isConditionalGate` pass that convert-powerset.cjs applies, so other gated pet
 * bonuses remain summed. Widening it needs its own audit of every pet damage number
 * — tracked in docs/HOMECOMING_PARSER.md.
 */
function isTargetTokenWindowGroup(effectGroup) {
  const req = effectGroup?.requires_expression || '';
  return /\btarget\.TokenTime>/.test(req);
}

/**
 * Check if an effect template is PvE-relevant damage
 */
function isPvEDamageTemplate(template, effectGroup) {
  const attribs = (template.attribs || []).map(a => a.toLowerCase());

  // Thunderspy: generic `Damage` attrib with the aspect dropped. Accept a
  // positive-scale `Damage` on a `*_Damage` table — this excludes the negative
  // `*_Ones` summon-shell / -res templates, the scale-0 strength meta-templates,
  // and the `CritActive` crit rider (not a `damage` attrib). Element is resolved
  // from the shortHelp at extract time.
  if (_TSPY && attribs.includes('damage')) {
    if (isPvpOnlyGroup(effectGroup)) return false;
    if (isTargetTokenWindowGroup(effectGroup)) return false;
    return /_damage$/i.test(template.table || '') && template.scale > 0;
  }

  // Must be a damage attribute
  if (!attribs.some(a => DAMAGE_ATTRIBS.has(a))) return false;

  // Must be absolute aspect (actual damage, not resistance/strength)
  if (template.aspect !== 'Absolute') return false;

  // Skip PvP-only effects and the PvP half of a PvE/PvP pair
  if (isPvpOnlyGroup(effectGroup)) return false;

  // Skip conditional bonus damage the pet doesn't always land (Singularity's
  // Lift + Gravity Distortion Impact).
  if (isTargetTokenWindowGroup(effectGroup)) return false;

  return true;
}

/**
 * Extract damage entries from a pet power's effects
 */
function extractDamage(powerData) {
  const damageEntries = [];
  // Thunderspy: element for the generic `Damage` attrib lives in the shortHelp.
  const tspyType = _TSPY ? (_tspyDamageType(powerData.display_short_help) || 'Special') : null;

  for (const effectGroup of (powerData.effects || [])) {
    // Skip PvP-only effect groups (and the `player eq` half of a PvE/PvP pair)
    if (isPvpOnlyGroup(effectGroup)) continue;

    for (const template of (effectGroup.templates || [])) {
      if (isPvEDamageTemplate(template, effectGroup)) {
        // A sub-1.0 group chance is a probabilistic hit, not a guaranteed one
        // (Trip Mine's third Fire template lands 50% of the time). `extractEffects`
        // has always carried this through; damage silently did not, so every such
        // entry was summed at face value — Trip Mine read ~14% high before the
        // fires-per-spawn bug even entered into it.
        //
        // Zero is excluded because it is not a probability here: a chance:0 group
        // carrying a payload is a mode GATE, the same sentinel `collectTemplatesDeep`
        // reads in convert-powerset.cjs and `pet-damage.ts` already honours for
        // ability-level damage (`damageChance > 0 ? … : undefined`). Consuming it as
        // a literal 0 multiplies the component away: all three datasets author the
        // Howler Wolf's third Lethal bite (scale 0.42) under a chance:0 group, and
        // it was being dropped from the pet's damage entirely.
        const chance = typeof effectGroup.chance === 'number'
          && effectGroup.chance > 0 && effectGroup.chance < 1
          ? effectGroup.chance
          : undefined;
        for (const attrib of template.attribs) {
          const attribLower = attrib.toLowerCase();
          if (DAMAGE_ATTRIBS.has(attribLower)) {
            // Convert attrib name to display type: "Energy_Dmg" -> "Energy"
            const damageType = attrib.replace(/_Dmg$/i, '').replace(/_/g, ' ');
            damageEntries.push({
              damageType,
              scale: template.scale,
              table: template.table || 'Melee_Damage',
              ...(chance !== undefined ? { chance } : {}),
            });
          } else if (_TSPY && attribLower === 'damage') {
            // Generic tspy Damage — element from the shortHelp (falls back to
            // Special when the tooltip has no DMG(...) clause).
            damageEntries.push({
              damageType: tspyType,
              scale: template.scale,
              table: template.table || 'Melee_Damage',
              ...(chance !== undefined ? { chance } : {}),
            });
          }
        }
      }
    }

    // Also check child effects (e.g., Containment bonus damage)
    // Skip these for base DPS - they are conditional
  }

  return damageEntries;
}

/**
 * Check if a template applies a debuff (negative value on target)
 */
function isDebuffTemplate(template, effectGroup) {
  // Skip PvP-only effects and the PvP half of a PvE/PvP pair
  if (isPvpOnlyGroup(effectGroup)) return false;

  // Must target foes (not self buffs)
  if (template.target === 'Self') return false;

  return true;
}

/**
 * Extract non-damage effects (mez, debuffs) from a pet power
 */
function extractEffects(powerData) {
  const effects = [];
  const seenTypes = new Set(); // Avoid duplicate effect types per power

  for (const effectGroup of (powerData.effects || [])) {
    if (isPvpOnlyGroup(effectGroup)) continue;

    const processTemplates = (templates, chance) => {
      for (const template of (templates || [])) {
        if (!isDebuffTemplate(template, effectGroup)) continue;

        // Ally-buff auras (Def/Res/Absorb/+Regen/…) — the whole point of a buff-pet.
        // Runs for all datasets (table/aspect/attrib based). Deduped per type so a
        // single power contributes at most one Defense + one Absorb + … effect.
        // `buffConsumed` names the attribs turned into positive buffs so the
        // debuff loop below skips them (a positive `recovery`/`rechargetime` must
        // not ALSO surface as a -Recovery/Slow debuff).
        const { effects: buffAuras, consumed: buffConsumed } = extractBuffAura(template);
        for (const buff of buffAuras) {
          if (seenTypes.has(buff.type)) continue;
          seenTypes.add(buff.type);
          if (chance < 1.0) buff.chance = chance;
          effects.push(buff);
        }

        for (const attrib of (template.attribs || [])) {
          const attribLower = attrib.toLowerCase();
          if (buffConsumed.has(attribLower)) continue;

          // Check mez effects
          const mezType = MEZ_ATTRIBS[attribLower];
          if (mezType && !seenTypes.has(mezType)) {
            seenTypes.add(mezType);
            const effect = { type: mezType };
            if (template.magnitude && template.magnitude > 0) {
              effect.magnitude = template.magnitude;
            }
            if (chance < 1.0) {
              effect.chance = chance;
            }
            if (template.scale && template.table) {
              effect.scale = template.scale;
              effect.table = template.table;
            }
            effects.push(effect);
          }

          // Check debuff effects. Thunderspy uses its own attrib vocabulary and
          // drops the target, so it takes a dedicated classification (name-encoded
          // debuffs at |scale|; resource debuffs only when negative — see the
          // _TSPY_DEBUFF_* maps) INSTEAD of the HC DEBUFF_ATTRIBS block, so a pet
          // self-buff (Res_DMG +N) can't leak in as a foe -Resistance.
          if (_TSPY) {
            let debuffType = _TSPY_DEBUFF_NAMED[attribLower];
            if (!debuffType) {
              const signed = _TSPY_DEBUFF_SIGNED[attribLower];
              // Resource attrib: only the draining/foe direction (negative scale)
              // is a debuff; the positive direction is a pet self-buff (dropped).
              // AND only when it rides a real magnitude table — a `*_Ones`
              // placeholder is a marker, not a computable percent (see the map).
              if (signed && template.scale < 0
                  && !/_ones$/i.test(template.table || '')) debuffType = signed;
            }
            // Surfaced per-type resistance: the powers parser now expands a
            // `Res_DMG`-front template into its real `*_Dmg` index attribs and
            // synthesizes aspect='Resistance' (Mind Over Body, Freezing Rain, Tar
            // Patch, …). This replaces the bare `res_dmg`-front `_TSPY_DEBUFF_SIGNED`
            // path above, so recognize the new shape here with the SAME semantics:
            // negative = the foe -Resistance debuff we surface (once, deduped across
            // the per-type rows); positive = a pet self-buff, dropped. Gated to a
            // real magnitude table, mirroring the `*_Ones`-marker exclusion above.
            if (!debuffType && template.aspect === 'Resistance'
                && attribLower.endsWith('_dmg') && template.scale < 0
                && !/_ones$/i.test(template.table || '')) {
              debuffType = 'ResistanceDebuff';
            }
            if (debuffType && !seenTypes.has(debuffType)) {
              // Skip a scale-0 slow tag row (a marker, not a real slow).
              if (!(debuffType === 'Slow' && Math.abs(template.scale || 0) < 0.001)) {
                seenTypes.add(debuffType);
                const effect = { type: debuffType };
                if (chance < 1.0) effect.chance = chance;
                if (template.scale && template.table) {
                  effect.scale = Math.abs(template.scale);
                  effect.table = template.table;
                }
                effects.push(effect);
              }
            }
            // tspy ally heal (support pseudo-pets) — positive-scale `Heal` attrib.
            if (attribLower === 'heal' && template.scale > 0 && !seenTypes.has('Heal')) {
              seenTypes.add('Heal');
              const effect = { type: 'Heal' };
              if (chance < 1.0) effect.chance = chance;
              if (template.scale && template.table) {
                effect.scale = Math.abs(template.scale);
                effect.table = template.table;
              }
              effects.push(effect);
            }
            continue; // tspy handled; skip the HC debuff/heal blocks below
          }

          // Check debuff effects
          const debuffType = DEBUFF_ATTRIBS[attribLower];
          if (debuffType && !seenTypes.has(debuffType)) {
            // For endurance drain, check the scale is negative (draining, not granting)
            if (attribLower === 'endurance' && template.scale >= 0) continue;
            // For slow effects, skip if scale is 0 (just a tag)
            if (debuffType === 'Slow' && Math.abs(template.scale || 0) < 0.001) continue;

            seenTypes.add(debuffType);
            const effect = { type: debuffType };
            if (chance < 1.0) {
              effect.chance = chance;
            }
            if (template.scale && template.table) {
              effect.scale = Math.abs(template.scale);
              effect.table = template.table;
            }
            effects.push(effect);
          }

          // Check healing effects (Heal_Dmg = direct ally heal)
          if (attribLower === 'heal_dmg' && !seenTypes.has('Heal')) {
            seenTypes.add('Heal');
            const effect = { type: 'Heal' };
            if (chance < 1.0) {
              effect.chance = chance;
            }
            if (template.scale && template.table) {
              effect.scale = Math.abs(template.scale);
              effect.table = template.table;
            }
            effects.push(effect);
          }
        }
      }
    };

    // Process main templates
    processTemplates(effectGroup.templates, effectGroup.chance);

    // Process child effects
    for (const child of (effectGroup.child_effects || [])) {
      if (isPvpOnlyGroup(child)) continue;
      processTemplates(child.templates, effectGroup.chance * child.chance);
    }
  }

  return effects;
}

/**
 * Read and process a pet power file
 */
function processPetPower(powerFilePath, powerData) {
  if (!powerData) {
    powerData = readJsonFile(powerFilePath);
    if (!powerData) return null;
  }

  // Skip utility powers
  if (isUtilityPower(powerData)) return null;

  // Extract damage and effects
  const damage = extractDamage(powerData);
  const effects = extractEffects(powerData);

  // A power with neither damage nor effects isn't useful - skip it
  if (damage.length === 0 && effects.length === 0) return null;

  const rechargeUnaffected = (powerData.strengths_disallowed || [])
    .some(s => s.toLowerCase() === 'rechargetime');

  return {
    name: powerData.name,
    displayName: powerData.display_name || powerData.name.replace(/_/g, ' '),
    type: powerData.type, // Click, Auto, Toggle
    damage,
    effects: effects.length > 0 ? effects : undefined,
    recharge: powerData.recharge_time || 0,
    castTime: powerData.activation_time || 0,
    activatePeriod: powerData.activate_period || undefined,
    effectArea: powerData.effect_area || 'SingleTarget',
    range: powerData.range > 0 ? powerData.range : undefined,
    radius: powerData.radius > 0 ? powerData.radius : undefined,
    maxTargets: powerData.max_targets_hit > 0 ? powerData.max_targets_hit : undefined,
    // bin-crawler currently exports attack_types as raw enum integers; the
    // PetAbility type expects string tags ("Lethal", "Area", "Incarnate", …).
    // Drop numeric entries until the enum mapping is added to export_powers.
    attackTypes: (() => {
      const at = powerData.attack_types;
      if (!at || at.length === 0) return undefined;
      const strings = at.filter(v => typeof v === 'string');
      return strings.length > 0 ? strings : undefined;
    })(),
    rechargeUnaffected: rechargeUnaffected || undefined,
  };
}

/**
 * Scan a power directory and process all power files in it
 * Returns an array of PetAbility objects
 */
function processUpgradeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return [];

  const abilities = [];
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'index.json');

  for (const file of files) {
    const ability = processPetPower(path.join(dirPath, file));
    if (ability) {
      abilities.push(ability);
    }
  }

  return abilities;
}

// The HC export root physically contains the other datasets' export trees
// as subdirectories — never let a whole-tree walk cross into them.
const SIBLING_DATASET_DIRS = new Set(['rebirth', 'thunderspy']);

/** Walk a directory tree and collect every file whose basename matches. */
function findFilesRecursive(rootDir, basename) {
  const out = [];
  function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (dir === rootDir && SIBLING_DATASET_DIRS.has(e.name)) continue;
        walk(full);
      } else if (e.isFile() && e.name === basename) out.push(full);
    }
  }
  walk(rootDir);
  return out;
}

/**
 * Pull the pet's lifespan (seconds) out of its Self_Destruct power.
 *
 * Pet lifespans aren't stored on the entity record. They're encoded as a
 * Silent_Kill AttribMod inside each pet's bundled Self_Destruct Auto power:
 * the pet auto-fires Self_Destruct on spawn, and the Silent_Kill's `Delay`
 * field is when the despawn actually triggers.
 *
 * The HC (Parse7) export labels it `Silent_Kill` since the special-attrib
 * sub-index fix; the Rebirth (Parse6) export still decodes the shared index
 * 117 as `Create_Entity`, so we accept both and disambiguate by signature:
 * target=Self, stack=Stack, table='Melee_Ones', no EntCreate params.
 * Permanent pets (mastermind primaries that last until killed) either have
 * no Self_Destruct power at all or have one with delay=0. (Thunderspy
 * labels it `Ones` with empty target/stack — TSPY4, not handled here.)
 */
function extractLifespan(powerFilePath) {
  const data = readJsonFile(powerFilePath);
  if (!data) return null;
  for (const effectGroup of (data.effects || [])) {
    for (const t of (effectGroup.templates || [])) {
      const attribs = t.attribs || [];
      if (!attribs.includes('Silent_Kill') && !attribs.includes('Create_Entity')) continue;
      if (t.target !== 'Self') continue;
      if (t.stack !== 'Stack') continue;
      if (t.table !== 'Melee_Ones') continue;
      if (t.params) continue; // real Create_Entity has EntCreate params
      const delay = typeof t.delay === 'number' ? t.delay : 0;
      if (delay > 0) return delay;
    }
  }
  return null;
}

/**
 * The delay on a pet's bundled Self_Destruct `Silent_Kill`, or null when it has
 * none. Unlike `extractLifespan` this KEEPS a zero delay: an immediate self-kill
 * is exactly the case that matters for `oneShot` below, and it is the case
 * `extractLifespan` deliberately discards (0 means "no finite lifespan").
 *
 * Accepts the same Parse7 `Silent_Kill` / Parse6 `Create_Entity` aliasing as
 * `extractLifespan`, disambiguated the same way (target=Self, no EntCreate params).
 */
function extractSelfDestructDelay(powerFilePath) {
  const data = readJsonFile(powerFilePath);
  if (!data) return null;
  for (const effectGroup of (data.effects || [])) {
    for (const t of (effectGroup.templates || [])) {
      const attribs = t.attribs || [];
      if (!attribs.includes('Silent_Kill') && !attribs.includes('Create_Entity')) continue;
      if (t.target !== 'Self') continue;
      if (t.params) continue; // real Create_Entity has EntCreate params
      return typeof t.delay === 'number' ? t.delay : 0;
    }
  }
  return null;
}

/**
 * Does this pet detonate exactly once?
 *
 * Trip Mine, Time Bomb, Seeker Drone and High Explosives are bombs: they sit
 * armed for the whole summon window, fire once when triggered, and are destroyed
 * by their own bundled Self_Destruct. The damage layer otherwise models fires
 * -per-spawn as `summonDuration / (castTime + recharge)`, which for a Blaster's
 * Trip Mine (260s window, 20s attack recharge) says the mine detonates THIRTEEN
 * times (report 2026-07-26: "the damage is incorrectly very high"). Only the
 * Controller/Corruptor/Mastermind mine escaped, because its shared entity carries
 * a 1000s recharge that happens to round the same formula down to one.
 *
 * The recharge is the wrong basis either way — a destroyed pet cannot recharge —
 * so mark the shape and let the damage layer cap it at one.
 *
 * Two conditions, both required, because neither alone is safe:
 *   • an IMMEDIATE self-targeted Silent_Kill (delay ≤ 1s), i.e. the pet dies with
 *     its detonation rather than living out a lifespan (Enflame's is 5s, Oil
 *     Slick's 15s — those really do tick for their whole delay); and
 *   • its whole offensive kit is ONE damaging Click and no damaging Auto/Toggle.
 *     Mastermind henchmen and VEAT pets also carry a delay-0 Self_Destruct — it
 *     is their *dismiss* power, not a detonation — but they field several attacks
 *     and an AI that keeps using them, so the ability-count test excludes them.
 *
 * Verified against the whole pet corpus: flags 18 entities — the trip mines, time
 * bombs, Seeker Drone flashpulses and High Explosives — and no repeat attacker
 * (arachnobots, widows, Mu pets, coral guardians, psionic nexus all excluded).
 */
function detectOneShot(abilities, selfDestructDelay) {
  if (selfDestructDelay === null || selfDestructDelay > 1) return false;
  const damaging = abilities.filter(a => a.damage.length > 0);
  if (damaging.length !== 1) return false;
  return damaging[0].type === 'Click';
}

/**
 * Read an entity file and extract its powers
 */
function processEntity(entityFilePath) {
  const entityData = readJsonFile(entityFilePath);
  if (!entityData) return null;

  const defaults = entityData.defaults || {};
  const powerFullNames = defaults.power_full_names || [];
  const displayNames = defaults.power_display_names || [];

  // Get display name from levels
  let displayName = entityData.name.replace(/^(Pets_|MastermindPets_|IncarnatePets_)/i, '').replace(/_/g, ' ');
  if (entityData.levels?.length > 0 && entityData.levels[0].display_names?.length > 0) {
    displayName = entityData.levels[0].display_names[0];
  }

  // Process each power and track powerset paths for upgrade tier scanning
  const abilities = [];
  const powersetPaths = new Set(); // Track unique powerset directories
  let lifespan = null;
  let selfDestructDelay = null;

  for (let i = 0; i < powerFullNames.length; i++) {
    const fullName = powerFullNames[i]; // e.g., "Pets.Tornado.Tornado_Attack"
    const parts = fullName.split('.');
    if (parts.length < 3) continue;

    const category = parts[0].toLowerCase(); // "pets"
    const powerset = parts[1].toLowerCase(); // "tornado"
    const power = parts[2].toLowerCase();    // "tornado_attack"

    // Track powerset directory path for upgrade scanning
    powersetPaths.add(path.join(POWERS_PATH, category, powerset));

    // Build the file path
    const powerFilePath = path.join(POWERS_PATH, category, powerset, `${power}.json`);

    if (!fs.existsSync(powerFilePath)) {
      // Try without underscores
      const altPath = path.join(POWERS_PATH, category, powerset, `${power.replace(/ /g, '_')}.json`);
      if (!fs.existsSync(altPath)) continue;
    }

    // Pet lifespan: harvested from the bundled Self_Destruct power's
    // Silent_Kill delay. Recorded once per entity. Pets without a finite
    // lifespan (Mastermind primaries that die only to enemy damage) either
    // have no Self_Destruct or its delay is 0 — leave `lifespan` null.
    if (power === 'self_destruct' && lifespan === null) {
      lifespan = extractLifespan(powerFilePath);
    }
    // Same power, different question: `oneShot` needs the raw delay including
    // zero, which `extractLifespan` throws away. Matched on the power NAME
    // ending in self_destruct so the Dominator/Epic mines' `TripMine_SelfDestruct`
    // is seen too (they prefix the powerset onto every power name).
    if (/self_?destruct$/.test(power) && selfDestructDelay === null) {
      selfDestructDelay = extractSelfDestructDelay(powerFilePath);
    }

    const ability = processPetPower(powerFilePath);
    if (ability) {
      abilities.push(ability);
    }
  }

  // Scan for upgrade tier directories (_2 and _3)
  const upgradeTiers = [];
  for (const psPath of powersetPaths) {
    const tier2Dir = psPath + '_2';
    const tier3Dir = psPath + '_3';

    const tier2Abilities = processUpgradeDirectory(tier2Dir);
    if (tier2Abilities.length > 0) {
      upgradeTiers.push({ tier: 2, abilities: tier2Abilities });
    }

    const tier3Abilities = processUpgradeDirectory(tier3Dir);
    if (tier3Abilities.length > 0) {
      upgradeTiers.push({ tier: 3, abilities: tier3Abilities });
    }
  }

  return {
    name: entityData.name,
    displayName,
    characterClass: defaults.character_class_name || 'minion_pets',
    commandable: entityData.commandable_pet === 1,
    copyCreatorMods: entityData.copy_creator_mods === true,
    abilities,
    lifespan: lifespan ?? undefined,
    oneShot: detectOneShot(abilities, selfDestructDelay) || undefined,
    upgradeTiers: upgradeTiers.length > 0 ? upgradeTiers : undefined,
  };
}

/**
 * Main execution
 */
function main() {
  console.log('Converting pet entity data...\n');

  const entities = {};
  let totalAbilities = 0;
  let skippedNoAbilities = 0;

  // Process all pet entity files
  const entityFiles = fs.readdirSync(ENTITIES_PATH)
    .filter(f => f.endsWith('.json') && (
      f.startsWith('pets_') ||
      f.startsWith('mastermindpets_') ||
      f.startsWith('incarnatepets_')
    ))
    .sort();

  console.log(`Found ${entityFiles.length} pet entity files\n`);

  for (const file of entityFiles) {
    const filePath = path.join(ENTITIES_PATH, file);
    const entity = processEntity(filePath);

    if (!entity) continue;

    if (entity.abilities.length === 0) {
      skippedNoAbilities++;
      continue;
    }

    entities[entity.name] = entity;
    totalAbilities += entity.abilities.length;
  }

  console.log(`\nProcessed ${Object.keys(entities).length} entities with ${totalAbilities} abilities`);
  console.log(`Skipped ${skippedNoAbilities} entities with no combat abilities\n`);

  // Generate TypeScript
  const tsContent = generateTypeScript(entities);
  fs.writeFileSync(OUTPUT_PATH, tsContent);
  console.log(`Wrote ${OUTPUT_PATH}`);

  // Emit sidecar JSON of pet lifespans for convert-powerset to consume.
  // Only entities with a real positive lifespan land here; permanent pets are absent.
  const lifespans = {};
  for (const [name, entity] of Object.entries(entities)) {
    if (typeof entity.lifespan === 'number' && entity.lifespan > 0) {
      lifespans[name] = entity.lifespan;
    }
  }
  fs.writeFileSync(SIDECAR_LIFESPANS_PATH, JSON.stringify(lifespans, null, 2) + '\n');
  console.log(`Wrote ${SIDECAR_LIFESPANS_PATH} (${Object.keys(lifespans).length} entries)`);

  // Build the Self_Destruct delay map by walking every category for
  // `self_destruct.json` files. The pseudopet pathway (PL_StaticObject,
  // Vines) routes through `params.redirects` rather than the entity record,
  // so convert-powerset needs to resolve a dotted redirect name (e.g.
  // `Redirects.Gravity_Control.Self_Destruct`) to its delay independently
  // of the pet entity table.
  const selfDestructDelays = {};
  const allSelfDestructFiles = findFilesRecursive(POWERS_PATH, 'self_destruct.json');
  for (const filePath of allSelfDestructFiles) {
    const delay = extractLifespan(filePath);
    if (delay === null) continue;
    const data = readJsonFile(filePath);
    const fullName = data && data.full_name;
    if (fullName) selfDestructDelays[fullName] = delay;
  }
  fs.writeFileSync(SIDECAR_SELF_DESTRUCT_PATH, JSON.stringify(selfDestructDelays, null, 2) + '\n');
  console.log(`Wrote ${SIDECAR_SELF_DESTRUCT_PATH} (${Object.keys(selfDestructDelays).length} entries)`);

  // Print summary for our 3 target entities
  const targets = ['Pets_Tornado', 'Pets_LightningStorm', 'Pets_Gremlin_Controller'];
  console.log('\nTarget entities:');
  for (const name of targets) {
    const entity = entities[name];
    if (entity) {
      console.log(`  ${name}: ${entity.abilities.length} abilities (class: ${entity.characterClass}, copyMods: ${entity.copyCreatorMods})`);
      for (const ability of entity.abilities) {
        const dmgStr = ability.damage.length > 0
          ? ability.damage.map(d => `${d.damageType} s${d.scale}@${d.table}`).join(', ')
          : 'no damage';
        console.log(`    - ${ability.displayName} (${ability.type}): ${dmgStr} | recharge=${ability.recharge}s cast=${ability.castTime}s`);
      }
    } else {
      console.log(`  ${name}: NOT FOUND`);
    }
  }
}

function generateTypeScript(entities) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * Pet Entity Data`);
  lines.push(` * Auto-generated from Homecoming raw data`);
  lines.push(` *`);
  lines.push(` * Contains pet abilities for damage calculation.`);
  lines.push(` * Use with PET_TABLES from at-tables.ts for damage lookups.`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`export interface PetDamageEntry {`);
  lines.push(`  damageType: string;`);
  lines.push(`  scale: number;`);
  lines.push(`  table: string;`);
  lines.push(`  /** Sub-1.0 hit chance from the effect group (Trip Mine's third Fire`);
  lines.push(`   *  template lands 50% of the time). Absent = guaranteed. Damage layers`);
  lines.push(`   *  must weight by this; summing at face value overstates the power. */`);
  lines.push(`  chance?: number;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetEffect {`);
  lines.push(`  type: string;`);
  lines.push(`  magnitude?: number;`);
  lines.push(`  chance?: number;`);
  lines.push(`  scale?: number;`);
  lines.push(`  table?: string;`);
  lines.push(`  /** Ally-buff auras (buff-pets like Force Field Generator / Barrier Reef).`);
  lines.push(`   *  A DefenseBuff/ResistanceBuff aura buffs every listed sub-type at the`);
  lines.push(`   *  same scale/table; absorbAspect distinguishes MaxHP-fraction (Maximum)`);
  lines.push(`   *  from flat (Absolute) absorb. Folded into character totals when the`);
  lines.push(`   *  summon's buff-pet toggle is enabled. */`);
  lines.push(`  defenseTypes?: string[];`);
  lines.push(`  resistanceTypes?: string[];`);
  lines.push(`  absorbAspect?: string;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetAbility {`);
  lines.push(`  name: string;`);
  lines.push(`  displayName: string;`);
  lines.push(`  type: 'Click' | 'Auto' | 'Toggle';`);
  lines.push(`  damage: PetDamageEntry[];`);
  lines.push(`  effects?: PetEffect[];`);
  lines.push(`  recharge: number;`);
  lines.push(`  castTime: number;`);
  lines.push(`  activatePeriod?: number;`);
  lines.push(`  effectArea: string;`);
  lines.push(`  range?: number;`);
  lines.push(`  radius?: number;`);
  lines.push(`  maxTargets?: number;`);
  lines.push(`  attackTypes?: string[];`);
  lines.push(`  rechargeUnaffected?: boolean;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetUpgradeTier {`);
  lines.push(`  tier: number;`);
  lines.push(`  abilities: PetAbility[];`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetEntity {`);
  lines.push(`  name: string;`);
  lines.push(`  displayName: string;`);
  lines.push(`  characterClass: string;`);
  lines.push(`  commandable: boolean;`);
  lines.push(`  copyCreatorMods: boolean;`);
  lines.push(`  abilities: PetAbility[];`);
  lines.push(`  /** Pet lifespan in seconds (from bundled Self_Destruct power's Silent_Kill delay).`);
  lines.push(`   *  Omitted for permanent pets (mastermind primaries, etc.) that despawn only`);
  lines.push(`   *  when killed or unsummoned. Used by convert-powerset to populate`);
  lines.push(`   *  \`summon.duration\` for summoning powers whose EntCreate Duration is 0. */`);
  lines.push(`  lifespan?: number;`);
  lines.push(`  /** This pet detonates ONCE: it is destroyed by its own bundled`);
  lines.push(`   *  Self_Destruct the moment it fires (trip mines, time bombs, seeker`);
  lines.push(`   *  drones, high explosives). Its attack's recharge is therefore not a`);
  lines.push(`   *  repeat cadence — damage layers must cap fires-per-spawn at 1 rather`);
  lines.push(`   *  than dividing the summon window by the cycle time. */`);
  lines.push(`  oneShot?: boolean;`);
  lines.push(`  upgradeTiers?: PetUpgradeTier[];`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const PET_ENTITIES: Record<string, PetEntity> = {`);

  for (const [name, entity] of Object.entries(entities)) {
    lines.push(`  ${JSON.stringify(name)}: {`);
    lines.push(`    name: ${JSON.stringify(entity.name)},`);
    lines.push(`    displayName: ${JSON.stringify(entity.displayName)},`);
    lines.push(`    characterClass: ${JSON.stringify(entity.characterClass)},`);
    lines.push(`    commandable: ${entity.commandable},`);
    lines.push(`    copyCreatorMods: ${entity.copyCreatorMods},`);
    if (typeof entity.lifespan === 'number' && entity.lifespan > 0) {
      lines.push(`    lifespan: ${entity.lifespan},`);
    }
    if (entity.oneShot) lines.push(`    oneShot: true,`);
    lines.push(`    abilities: [`);

    for (const ability of entity.abilities) {
      lines.push(`      {`);
      lines.push(`        name: ${JSON.stringify(ability.name)},`);
      lines.push(`        displayName: ${JSON.stringify(ability.displayName)},`);
      lines.push(`        type: ${JSON.stringify(ability.type)},`);
      lines.push(`        damage: ${JSON.stringify(ability.damage)},`);
      if (ability.effects) lines.push(`        effects: ${JSON.stringify(ability.effects)},`);
      lines.push(`        recharge: ${ability.recharge},`);
      lines.push(`        castTime: ${ability.castTime},`);
      if (ability.activatePeriod) lines.push(`        activatePeriod: ${ability.activatePeriod},`);
      lines.push(`        effectArea: ${JSON.stringify(ability.effectArea)},`);
      if (ability.range) lines.push(`        range: ${ability.range},`);
      if (ability.radius) lines.push(`        radius: ${ability.radius},`);
      if (ability.maxTargets) lines.push(`        maxTargets: ${ability.maxTargets},`);
      if (ability.attackTypes) lines.push(`        attackTypes: ${JSON.stringify(ability.attackTypes)},`);
      if (ability.rechargeUnaffected) lines.push(`        rechargeUnaffected: true,`);
      lines.push(`      },`);
    }

    lines.push(`    ],`);

    // Upgrade tiers (for Mastermind pets)
    if (entity.upgradeTiers) {
      lines.push(`    upgradeTiers: [`);
      for (const tier of entity.upgradeTiers) {
        lines.push(`      {`);
        lines.push(`        tier: ${tier.tier},`);
        lines.push(`        abilities: [`);
        for (const ability of tier.abilities) {
          lines.push(`          {`);
          lines.push(`            name: ${JSON.stringify(ability.name)},`);
          lines.push(`            displayName: ${JSON.stringify(ability.displayName)},`);
          lines.push(`            type: ${JSON.stringify(ability.type)},`);
          lines.push(`            damage: ${JSON.stringify(ability.damage)},`);
          if (ability.effects) lines.push(`            effects: ${JSON.stringify(ability.effects)},`);
          lines.push(`            recharge: ${ability.recharge},`);
          lines.push(`            castTime: ${ability.castTime},`);
          if (ability.activatePeriod) lines.push(`            activatePeriod: ${ability.activatePeriod},`);
          lines.push(`            effectArea: ${JSON.stringify(ability.effectArea)},`);
          if (ability.range) lines.push(`            range: ${ability.range},`);
          if (ability.radius) lines.push(`            radius: ${ability.radius},`);
          if (ability.maxTargets) lines.push(`            maxTargets: ${ability.maxTargets},`);
          if (ability.attackTypes) lines.push(`            attackTypes: ${JSON.stringify(ability.attackTypes)},`);
          if (ability.rechargeUnaffected) lines.push(`            rechargeUnaffected: true,`);
          lines.push(`          },`);
        }
        lines.push(`        ],`);
        lines.push(`      },`);
      }
      lines.push(`    ],`);
    }

    lines.push(`  },`);
  }

  lines.push(`};`);
  lines.push(``);

  return lines.join('\n');
}

main();
