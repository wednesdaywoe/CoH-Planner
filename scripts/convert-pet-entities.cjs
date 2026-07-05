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

// Read from the per-dataset bin-crawler export. HC's export lives under
// `tools/bin-crawler/exported_powers/live/`, Rebirth's under
// `exported_powers/rebirth/`. Both are organized as
//   <root>/entities/*.json
//   <root>/<powerset_category>/<powerset>/<power>.json
// so we share the same `<root>` for both lookups.
const EXPORT_ROOTS = {
  homecoming: path.join(__dirname, '../tools/bin-crawler/exported_powers/live'),
  rebirth: path.join(__dirname, '../exported_powers/rebirth'),
  thunderspy: path.join(__dirname, '../exported_powers/thunderspy'),
};
const ROOT = EXPORT_ROOTS[datasetId];
if (!ROOT || !fs.existsSync(ROOT)) {
  throw new Error(`No bin-crawler export root for dataset '${datasetId}'. Looked at ${ROOT}`);
}
const ENTITIES_PATH = path.join(ROOT, 'entities');
const POWERS_PATH = ROOT;

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
  const m = shortHelp.match(/DMG\(([^)]+)\)/i);
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
const _TSPY_DEBUFF_NAMED = {
  'slow': 'Slow', 'speedrunning': 'Slow', 'speedflying': 'Slow', 'speedjumping': 'Slow',
  'debuff_def': 'DefenseDebuff', 'debuff_tohit': 'ToHitDebuff', 'debuff_dam': 'DamageDebuff',
};
const _TSPY_DEBUFF_SIGNED = {
  'res_dmg': 'ResistanceDebuff', 'recovery': 'RecoveryDebuff',
  'endurance': 'EndDrain', 'enddrain': 'EndDrain',
};

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
    if (effectGroup.is_pvp === 'PVP_ONLY') return false;
    return /_damage$/i.test(template.table || '') && template.scale > 0;
  }

  // Must be a damage attribute
  if (!attribs.some(a => DAMAGE_ATTRIBS.has(a))) return false;

  // Must be absolute aspect (actual damage, not resistance/strength)
  if (template.aspect !== 'Absolute') return false;

  // Skip PvP-only effects
  if (effectGroup.is_pvp === 'PVP_ONLY') return false;

  // Skip PvP-specific requires
  const req = effectGroup.requires_expression || '';
  if (req.includes("target>enttype eq 'player'")) return false;

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
    // Skip PvP-only effect groups
    if (effectGroup.is_pvp === 'PVP_ONLY') continue;

    for (const template of (effectGroup.templates || [])) {
      if (isPvEDamageTemplate(template, effectGroup)) {
        for (const attrib of template.attribs) {
          const attribLower = attrib.toLowerCase();
          if (DAMAGE_ATTRIBS.has(attribLower)) {
            // Convert attrib name to display type: "Energy_Dmg" -> "Energy"
            const damageType = attrib.replace(/_Dmg$/i, '').replace(/_/g, ' ');
            damageEntries.push({
              damageType,
              scale: template.scale,
              table: template.table || 'Melee_Damage',
            });
          } else if (_TSPY && attribLower === 'damage') {
            // Generic tspy Damage — element from the shortHelp (falls back to
            // Special when the tooltip has no DMG(...) clause).
            damageEntries.push({
              damageType: tspyType,
              scale: template.scale,
              table: template.table || 'Melee_Damage',
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
  // Skip PvP-only effects
  if (effectGroup.is_pvp === 'PVP_ONLY') return false;
  const req = effectGroup.requires_expression || '';
  if (req.includes("target>enttype eq 'player'")) return false;

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
    if (effectGroup.is_pvp === 'PVP_ONLY') continue;

    const processTemplates = (templates, chance) => {
      for (const template of (templates || [])) {
        if (!isDebuffTemplate(template, effectGroup)) continue;

        for (const attrib of (template.attribs || [])) {
          const attribLower = attrib.toLowerCase();

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
      if (child.is_pvp === 'PVP_ONLY') continue;
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
    try {
      powerData = JSON.parse(fs.readFileSync(powerFilePath, 'utf-8'));
    } catch {
      return null;
    }
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

/** Walk a directory tree and collect every file whose basename matches. */
function findFilesRecursive(rootDir, basename) {
  const out = [];
  function walk(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
    catch { return; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.isFile() && e.name === basename) out.push(full);
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
 * In the bin export the Silent_Kill AttribMod is labeled `Create_Entity`
 * (both share enum index 117). We disambiguate by signature: target=Self,
 * stack=Stack, table='Melee_Ones', no EntCreate params. Permanent pets
 * (mastermind primaries that last until killed) either have no Self_Destruct
 * power at all or have one with delay=0.
 */
function extractLifespan(powerFilePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(powerFilePath, 'utf-8'));
  } catch {
    return null;
  }
  for (const effectGroup of (data.effects || [])) {
    for (const t of (effectGroup.templates || [])) {
      const attribs = t.attribs || [];
      if (!attribs.includes('Create_Entity')) continue;
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
 * Read an entity file and extract its powers
 */
function processEntity(entityFilePath) {
  let entityData;
  try {
    entityData = JSON.parse(fs.readFileSync(entityFilePath, 'utf-8'));
  } catch {
    return null;
  }

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
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const fullName = data.full_name;
      if (fullName) selfDestructDelays[fullName] = delay;
    } catch {
      // skip unparseable
    }
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
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetEffect {`);
  lines.push(`  type: string;`);
  lines.push(`  magnitude?: number;`);
  lines.push(`  chance?: number;`);
  lines.push(`  scale?: number;`);
  lines.push(`  table?: string;`);
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
