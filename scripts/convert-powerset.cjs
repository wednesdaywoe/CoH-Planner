/**
 * Powerset Conversion Script
 *
 * Converts raw Homecoming power data to the new modular structure.
 * Usage: node scripts/convert-powerset.js <category> <powerset>
 * Example: node scripts/convert-powerset.js defender_buff radiation_emission
 */

const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../raw_data_homecoming-20251209_7415');
const OUTPUT_PATH = './src/data/powersets';

// Map raw category names to our folder structure
const CATEGORY_MAP = {
  // Heroes
  'defender_buff': { archetype: 'defender', type: 'primary' },
  'defender_ranged': { archetype: 'defender', type: 'secondary' },
  'controller_control': { archetype: 'controller', type: 'primary' },
  'controller_buff': { archetype: 'controller', type: 'secondary' },
  'blaster_ranged': { archetype: 'blaster', type: 'primary' },
  'blaster_support': { archetype: 'blaster', type: 'secondary' },
  'tanker_defense': { archetype: 'tanker', type: 'primary' },
  'tanker_melee': { archetype: 'tanker', type: 'secondary' },
  'scrapper_melee': { archetype: 'scrapper', type: 'primary' },
  'scrapper_defense': { archetype: 'scrapper', type: 'secondary' },
  // Villains
  'corruptor_ranged': { archetype: 'corruptor', type: 'primary' },
  'corruptor_buff': { archetype: 'corruptor', type: 'secondary' },
  'brute_melee': { archetype: 'brute', type: 'primary' },
  'brute_defense': { archetype: 'brute', type: 'secondary' },
  'dominator_control': { archetype: 'dominator', type: 'primary' },
  'dominator_assault': { archetype: 'dominator', type: 'secondary' },
  'mastermind_summon': { archetype: 'mastermind', type: 'primary' },
  'mastermind_buff': { archetype: 'mastermind', type: 'secondary' },
  'stalker_melee': { archetype: 'stalker', type: 'primary' },
  'stalker_defense': { archetype: 'stalker', type: 'secondary' },
  // Praetorian
  'sentinel_ranged': { archetype: 'sentinel', type: 'primary' },
  'sentinel_defense': { archetype: 'sentinel', type: 'secondary' },
};

// Enhancement type mapping
const BOOST_TYPE_MAP = {
  'Reduce Endurance Cost': 'EnduranceReduction',
  'Enhance Recharge Speed': 'Recharge',
  'Enhance Accuracy': 'Accuracy',
  'Enhance Range': 'Range',
  'Enhance Damage': 'Damage',
  'Enhance ToHit DeBuffs': 'ToHit Debuff',
  'Enhance Defense DeBuff': 'Defense Debuff',
  'Enhance Heal': 'Healing',
  'Enhance Defense Buff': 'Defense',
  'Enhance Resist Damage': 'Resistance',
  'Enhance Hold': 'Hold',
  'Enhance Hold Duration': 'Hold',
  'Enhance Stun': 'Stun',
  'Enhance Stun Duration': 'Stun',
  'Enhance Disorient': 'Stun',
  'Enhance Disorient Duration': 'Stun',
  'Enhance Immobilize': 'Immobilize',
  'Enhance Immobilize Duration': 'Immobilize',
  'Enhance Sleep': 'Sleep',
  'Enhance Sleep Duration': 'Sleep',
  'Enhance Confuse': 'Confuse',
  'Enhance Confuse Duration': 'Confuse',
  'Enhance Fear': 'Fear',
  'Enhance Fear Duration': 'Fear',
  'Enhance Knockback': 'Knockback',
  'Enhance ToHit Buff': 'ToHit',
  'Enhance Slow': 'Slow',
  'Enhance Slow Movement': 'Slow',
  'Enhance Fly Speed': 'Fly',
  'Enhance Run Speed': 'Run Speed',
  'Enhance Jump': 'Jump',
  'Enhance Intangible Duration': 'Intangible',
  'Enhance Taunt': 'Taunt',
  // Additional mappings found via audit (variant raw names)
  'Enhance Threat Duration': 'Taunt',
  'Enhance KnockBack': 'Knockback',
  'Enhance Endurance Modification': 'EnduranceModification',
  'Enhance Damage Resistance': 'Resistance',
  'Enhance Defense': 'Defense',
  'Enhance ToHit Buffs': 'ToHit',
  'Enhance Immobilization': 'Immobilize',
  'Reduce Interrupt Time': 'Interrupt',
  'Enhance Running Speed': 'Run Speed',
  'Enhance Flying Speed': 'Fly',
};

// IO Set category mapping
const SET_CATEGORY_MAP = {
  'Accurate Defense Debuff': 'Accurate Defense Debuff',
  'Accurate Healing': 'Accurate Healing',
  'Accurate ToHit Debuff': 'Accurate To-Hit Debuff',
  'Blaster Archetype Sets': 'Blaster Archetype Sets',
  'Confuse': 'Confuse',
  'Controller Archetype Sets': 'Controller Archetype Sets',
  'Corruptor Archetype Sets': 'Corruptor Archetype Sets',
  'Defender Archetype Sets': 'Defender Archetype Sets',
  'Defense': 'Defense Sets',
  'Defense Debuff': 'Defense Debuff',
  'Dominator Archetype Sets': 'Dominator Archetype Sets',
  'Endurance Modification': 'Endurance Modification',
  'Fear': 'Fear',
  'Flight': 'Flight',
  'Healing': 'Healing',
  'Hold': 'Hold',
  'Immobilize': 'Immobilize',
  'Jumping': 'Jumping',
  'Knockback': 'Knockback',
  'Mastermind Archetype Sets': 'Mastermind Archetype Sets',
  'Melee Damage': 'Melee Damage',
  'PBAoE Damage': 'PBAoE Damage',
  'Pet Damage': 'Pet Damage',
  'Ranged Damage': 'Ranged Damage',
  'Ranged AoE Damage': 'Ranged AoE Damage',
  'Resist Damage': 'Resist Damage',
  'Running': 'Running',
  'Running & Sprints': 'Running & Sprints',
  'Sleep': 'Sleep',
  'Slow Movement': 'Slow Movement',
  'Sniper Attacks': 'Sniper Attacks',
  'Stuns': 'Stuns',
  'Targeted AoE Damage': 'Targeted AoE Damage',
  'Taunt': 'Taunt',
  'To Hit Buff': 'To Hit Buff',
  'To Hit Debuff': 'To Hit Debuff',
  'Travel': 'Travel',
  'Universal Damage Sets': 'Universal Damage Sets',
  'Universal Travel': 'Universal Travel',
};

// Map IO set categories to enhancement types that should be allowed
// Used to infer allowedEnhancements when raw data doesn't provide boosts_allowed
const SET_CATEGORY_TO_ENHANCEMENT = {
  // Damage categories
  'Ranged Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee Damage': ['Damage', 'Accuracy'],
  'Ranged AoE Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee AoE Damage': ['Damage', 'Accuracy'],
  'Universal Damage Sets': ['Damage', 'Accuracy'],
  'Sniper Attacks': ['Damage', 'Accuracy', 'Range'],
  'Pet Damage': ['Damage', 'Accuracy', 'Recharge'],
  'PBAoE Damage': ['Damage', 'Accuracy'],
  'Targeted AoE Damage': ['Damage', 'Accuracy', 'Range'],
  // Defense/Resistance
  'Resist Damage': ['Resistance'],
  'Defense Sets': ['Defense'],
  // Control (Mez)
  'Holds': ['Hold'],
  'Hold': ['Hold'],
  'Stuns': ['Stun'],
  'Immobilize': ['Immobilize'],
  'Sleep': ['Sleep'],
  'Confuse': ['Confuse'],
  'Fear': ['Fear'],
  'Knockback': ['Knockback'],
  // Support/Debuff
  'Healing': ['Healing'],
  'To Hit Buff': ['ToHit'],
  'To Hit Debuff': ['ToHit Debuff'],
  'Defense Debuff': ['Defense Debuff'],
  'Accurate Healing': ['Healing', 'Accuracy'],
  'Accurate To-Hit Debuff': ['ToHit Debuff', 'Accuracy'],
  'Accurate Defense Debuff': ['Defense Debuff', 'Accuracy'],
  'Slow Movement': ['Slow'],
  'Threat Duration': ['Taunt'],
  'Taunt': ['Taunt'],
  'Endurance Modification': ['EnduranceReduction'],
  // Movement
  'Running': ['Run Speed'],
  'Running & Sprints': ['Run Speed'],
  'Leaping': ['Jump'],
  'Jumping': ['Jump'],
  'Leaping & Sprints': ['Jump'],
  'Flight': ['Fly'],
  'Teleport': ['Range'],
  'Universal Travel': ['Run Speed', 'Jump', 'Fly'],
  'Travel': ['Run Speed', 'Jump', 'Fly'],
  // Pet sets
  'Recharge Intensive Pets': ['Damage', 'Accuracy', 'Recharge'],
  // Archetype sets
  'Blaster Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Brute Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Controller Archetype Sets': ['Hold', 'Confuse', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Corruptor Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Defender Archetype Sets': ['Healing', 'Defense', 'Recharge', 'EnduranceReduction'],
  'Dominator Archetype Sets': ['Hold', 'Accuracy', 'Damage', 'Recharge', 'EnduranceReduction'],
  'Mastermind Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Scrapper Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Stalker Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Tanker Archetype Sets': ['Defense', 'Resistance', 'Recharge', 'EnduranceReduction'],
  'Sentinel Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Kheldian Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
  'Soldiers of Arachnos Archetype Sets': ['Damage', 'Accuracy', 'Recharge', 'EnduranceReduction'],
};

/**
 * Convert a power name to kebab-case filename
 */
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Valid target types (mapped from raw data to our TypeScript types)
const TARGET_TYPE_MAP = {
  'Self': 'Self',
  'Foe': 'Foe',
  'Ally': 'Ally',
  'Ally (Alive)': 'Ally (Alive)',
  'Enemy': 'Foe',
  'Teammate': 'Teammate',
  'Teammate (Alive)': 'Teammate (Alive)',
  'Location': 'Location',
  'DeadFoe': 'DeadFoe',
  'DeadOrAlive Teammate': 'DeadOrAlive Teammate',
  'Any': 'Any',
  'Dead Teammate': 'Dead Teammate',
  'Teleport': 'Teleport',
  // Map invalid types to closest valid equivalent
  'Anything': 'Location',
  'Leaguemate': 'Teammate',
  'Leaguemate (Alive)': 'Teammate (Alive)',
  'Dead Leaguemate': 'Dead Teammate',
};

// ============================================
// COMPREHENSIVE ATTRIBUTE MAPPING
// ============================================

// Damage type attributes (with and without _Dmg suffix)
const DAMAGE_TYPES = {
  'smashing_dmg': 'Smashing', 'smashing': 'Smashing',
  'lethal_dmg': 'Lethal', 'lethal': 'Lethal',
  'fire_dmg': 'Fire', 'fire': 'Fire',
  'cold_dmg': 'Cold', 'cold': 'Cold',
  'energy_dmg': 'Energy', 'energy': 'Energy',
  'negative_energy_dmg': 'Negative', 'negative_energy': 'Negative',
  'psionic_dmg': 'Psionic', 'psionic': 'Psionic',
  'toxic_dmg': 'Toxic', 'toxic': 'Toxic',
  'special_dmg': 'Special',
  'heal_dmg': 'Heal', // Used for -regen effects sometimes
};

// Defense position types (not damage types)
const DEFENSE_POSITIONS = {
  'melee': 'Melee',
  'ranged': 'Ranged',
  'area': 'AoE',
  'aoe': 'AoE',
};

// Elusivity attributes (defense debuff resistance)
const ELUSIVITY_TYPES = {
  'smashing_elusivity': 'Smashing', 'lethal_elusivity': 'Lethal',
  'fire_elusivity': 'Fire', 'cold_elusivity': 'Cold',
  'energy_elusivity': 'Energy', 'negative_energy_elusivity': 'Negative',
  'psionic_elusivity': 'Psionic', 'melee_elusivity': 'Melee',
  'ranged_elusivity': 'Ranged', 'area_elusivity': 'AoE',
  'elusivitybase': 'All',
};

// Mez effect types (with magnitude) - maps raw attrib to our effect name
const MEZ_TYPES = {
  'held': 'hold', 'hold': 'hold',
  'stunned': 'stun', 'stun': 'stun', 'disorient': 'stun',
  'sleep': 'sleep', 'sleeping': 'sleep', 'slept': 'sleep',
  'immobilized': 'immobilize', 'immobilize': 'immobilize',
  'confused': 'confuse', 'confuse': 'confuse',
  'afraid': 'fear', 'terrorized': 'fear', 'fear': 'fear', 'terrorize': 'fear',
};

// Knockback-type effects (no magnitude, just scale/table)
const KNOCKBACK_TYPES = {
  'knockback': 'knockback',
  'knockup': 'knockup',
  'repel': 'repel',
};

// Movement attributes
const MOVEMENT_TYPES = {
  'runningspeed': 'runSpeed', 'speed_running': 'runSpeed',
  'flyingspeed': 'flySpeed', 'speed_flying': 'flySpeed', 'fly': 'fly',
  'jumpheight': 'jumpHeight',
  'jumpingspeed': 'jumpSpeed', 'speed_jumping': 'jumpSpeed',
  'movementcontrol': 'movementControl',
  'movementfriction': 'movementFriction',
};

// Resource attributes
const RESOURCE_TYPES = {
  'hitpoints': 'hitPoints', 'hit_points': 'hitPoints',
  'endurance': 'endurance',
  'recovery': 'recovery',
  'regeneration': 'regeneration', 'regen': 'regeneration',
  'absorb': 'absorb',
};

// Combat modifier attributes
const COMBAT_MODIFIERS = {
  'tohit': 'toHit', 'to_hit': 'toHit',
  'base_defense': 'defense', 'defense': 'defense',
  'threatlevel': 'threatLevel', 'threat_level': 'threatLevel',
  'rechargetime': 'rechargeTime', 'recharge_time': 'rechargeTime', 'speed_recharge': 'rechargeTime',
  'range': 'range',
  'endurancediscount': 'enduranceDiscount',
};

// Stealth/Perception attributes
const STEALTH_TYPES = {
  'perceptionradius': 'perception',
  'stealthradius_pve': 'stealthPvE',
  'stealthradius_pvp': 'stealthPvP',
  'translucency': 'translucency',
};

// Control attributes
const CONTROL_TYPES = {
  'taunt': 'taunt', 'taunted': 'taunt',
  'placate': 'placate',
  'untouchable': 'untouchable',
  'onlyaffectsself': 'onlyAffectsSelf',
  'teleport': 'teleport',
};

// Special/meta attributes we generally skip (not create_entity - we handle that separately)
const SPECIAL_ATTRIBS = new Set([
  'null', 'grant_power', 'grant_boosted_power',
  'execute_power', 'revoke_power', 'cancel_effects', 'set_mode',
  'set_costume', 'add_token', 'designer_status', 'debt_protection',
  'silent_kill', 'global_chance_mod', 'recharge_power', 'jump pack',
]);

/**
 * Check if an attrib is a damage type
 */
function isDamageTypeAttrib(attrib) {
  return attrib && DAMAGE_TYPES[attrib.toLowerCase()] !== undefined;
}

/**
 * Get normalized damage type name
 */
function getDamageType(attrib) {
  return DAMAGE_TYPES[attrib.toLowerCase()];
}

/**
 * Check if an attrib is a defense position type
 */
function isDefensePosition(attrib) {
  return attrib && DEFENSE_POSITIONS[attrib.toLowerCase()] !== undefined;
}

/**
 * Recursively collect all templates from an effects array, including child_effects.
 * Filters out PVP_ONLY effects and effects with chance=0 (conditional procs).
 *
 * @param {Array} effects - Array of effect objects
 * @returns {Array} - Flat array of all template objects
 */
function collectAllTemplates(effects) {
  const templates = [];

  for (const effect of effects) {
    // Skip PVP-only effects
    if (effect.is_pvp === 'PVP_ONLY') continue;

    // Skip effects with chance=0 (conditional procs that don't normally fire)
    if (effect.chance === 0 || effect.chance === 0.0) continue;

    // Collect templates from this level
    if (effect.templates && effect.templates.length > 0) {
      templates.push(...effect.templates);
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAllTemplates(effect.child_effects));
    }
  }

  return templates;
}

/**
 * Extract damage effects from raw effect templates
 * Only extracts ACTUAL damage (aspect "Cur" or "Abs"), not damage buffs/debuffs
 */
function extractDamage(templates) {
  const damages = [];

  for (const template of templates) {
    if (!template.attribs || !template.scale) continue;

    const attrib = template.attribs[0]?.toLowerCase();
    const damageType = DAMAGE_TYPES[attrib];
    const aspect = template.aspect?.toLowerCase();

    // Only extract as "damage" if:
    // 1. It's a damage type attribute
    // 2. The aspect indicates actual damage: "Absolute", "Current", "Cur", "Abs"
    // 3. NOT "Strength" (damage buff/debuff) or "Resistance" (resistance debuff)
    const isDamageAspect = !aspect ||
      aspect === 'absolute' ||
      aspect === 'current' ||
      aspect === 'cur' ||
      aspect === 'abs';

    if (damageType && isDamageAspect) {
      // Skip if this is clearly a buff/debuff (check table name)
      if (template.table?.toLowerCase().includes('debuff') ||
          template.table?.toLowerCase().includes('buff')) {
        continue;
      }

      const dmg = {
        type: damageType,
        scale: template.scale,
        table: template.table,
      };

      // Check for DoT
      if (template.duration && template.duration !== '0 seconds') {
        const durationMatch = template.duration.match(/([\d.]+)\s*seconds?/i);
        if (durationMatch) {
          dmg.duration = parseFloat(durationMatch[1]);
        }
      }

      // Check for ticks (periodic damage)
      if (template.application_period && template.application_period > 0) {
        dmg.tickRate = template.application_period;
      }

      damages.push(dmg);
    }
  }

  return damages.length > 0 ? (damages.length === 1 ? damages[0] : damages) : undefined;
}

/**
 * Extract ALL effects from raw effect templates
 *
 * Aspect meanings:
 * - "Strength" = affects target's OUTPUT (damage dealt, etc.) - buff/debuff
 * - "Resistance" = affects target's RESISTANCE to that type - buff/debuff
 * - "Current" / "Absolute" = affects current/absolute value (actual damage, healing)
 * - "Maximum" = affects max value (max HP, max endurance)
 *
 * Template.type meanings:
 * - "Magnitude" = magnitude-based effect
 * - "Duration" = duration-based effect (used for mez)
 */
function extractEffects(templates) {
  const effects = {};
  const unmappedAttribs = new Set();

  for (const template of templates) {
    if (!template.attribs || template.attribs.length === 0) continue;

    const aspect = template.aspect?.toLowerCase();
    const scale = template.scale || 0;
    const table = template.table;
    const magnitude = template.magnitude || 1;
    const isDebuff = scale < 0 || table?.toLowerCase().includes('debuff');

    // Parse duration if present
    let duration = null;
    if (template.duration && template.duration !== '0 seconds') {
      const match = template.duration.match(/([\d.]+)\s*seconds?/i);
      if (match) duration = parseFloat(match[1]);
    }

    // Helper to create effect object
    const makeEffect = (s = scale, t = table) => ({ scale: Math.abs(s), table: t });
    const makeMezEffect = () => ({ mag: magnitude, scale: Math.abs(scale), table });

    // Process ALL attribs in this template (not just the first)
    for (const rawAttrib of template.attribs) {
      const attrib = rawAttrib?.toLowerCase();
      if (!attrib) continue;

      // Skip special/meta attributes
      if (SPECIAL_ATTRIBS.has(attrib)) continue;

      // ========== ENTITY CREATION (Pets/Pseudopets) ==========
      if (attrib === 'create_entity') {
        const params = template.params;
        if (params && params.type === 'EntCreate') {
          const isPseudoPet = template.flags?.some(f => f.includes('PseudoPet')) || false;
          const hasCopyBoosts = template.flags?.some(f => f.includes('CopyBoosts')) || false;

          if (!effects.summon) {
            // First entity encountered
            const entityInfo = { isPseudoPet };
            if (params.entity_def) entityInfo.entity = params.entity_def;
            if (params.display_name) entityInfo.displayName = params.display_name;
            if (params.redirects?.length > 0) entityInfo.powers = params.redirects;
            if (duration) entityInfo.duration = duration;
            if (hasCopyBoosts) entityInfo.copyBoosts = true;
            effects.summon = entityInfo;
          } else if (effects.summon.entities) {
            // Already tracking multiple entity types - add or increment
            const existing = effects.summon.entities.find(e => e.entity === params.entity_def);
            if (existing) {
              existing.count++;
            } else {
              effects.summon.entities.push({ entity: params.entity_def, count: 1 });
            }
          } else if (effects.summon.entity === params.entity_def) {
            // Same entity_def appearing again = multiple entities summoned
            effects.summon.entityCount = (effects.summon.entityCount || 1) + 1;
          } else if (params.entity_def && !isPseudoPet && effects.summon.entity) {
            // Different entity_def for a real pet - start multi-entity tracking
            effects.summon.entities = [
              { entity: effects.summon.entity, count: effects.summon.entityCount || 1 },
              { entity: params.entity_def, count: 1 },
            ];
            delete effects.summon.entity;
            delete effects.summon.entityCount;
          }
        }
        continue;
      }

      // ========== DAMAGE TYPE ATTRIBUTES ==========
      if (isDamageTypeAttrib(attrib)) {
        const dmgType = getDamageType(attrib);
        const tableLower = table?.toLowerCase() || '';

        // Check if this is a defense buff/debuff (table contains Buff_Def or Debuff_Def)
        const isDefenseEffect = tableLower.includes('buff_def') || tableLower.includes('debuff_def');

        if (aspect === 'strength') {
          // Affects target's damage OUTPUT
          if (isDebuff) {
            effects.damageDebuff = makeEffect();
          } else {
            effects.damageBuff = makeEffect();
          }
        } else if (aspect === 'resistance') {
          // Affects target's damage RESISTANCE
          if (isDebuff) {
            if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
            effects.resistanceDebuff[dmgType.toLowerCase()] = makeEffect();
          } else {
            if (!effects.resistance) effects.resistance = {};
            effects.resistance[dmgType.toLowerCase()] = makeEffect();
          }
        } else if (isDefenseEffect) {
          // Defense buff/debuff by damage type (e.g., Invincibility grants defense vs Smashing/Lethal/etc.)
          if (isDebuff) {
            if (!effects.defenseDebuff) effects.defenseDebuff = {};
            effects.defenseDebuff[dmgType.toLowerCase()] = makeEffect();
          } else {
            if (!effects.defenseBuff) effects.defenseBuff = {};
            effects.defenseBuff[dmgType.toLowerCase()] = makeEffect();
          }
        }
        // "Current"/"Absolute" aspect without defense table = actual damage, handled by extractDamage()
        continue;
      }

      // ========== DEFENSE POSITION TYPES (Melee/Ranged/AoE) ==========
      if (isDefensePosition(attrib)) {
        const posType = DEFENSE_POSITIONS[attrib];
        if (aspect === 'resistance') {
          // Position-based resistance (to defense debuffs)
          if (isDebuff) {
            if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
            effects.resistanceDebuff[posType.toLowerCase()] = makeEffect();
          } else {
            if (!effects.resistance) effects.resistance = {};
            effects.resistance[posType.toLowerCase()] = makeEffect();
          }
        } else {
          // Position-based defense
          if (isDebuff) {
            if (!effects.defenseDebuff) effects.defenseDebuff = {};
            effects.defenseDebuff[posType.toLowerCase()] = makeEffect();
          } else {
            if (!effects.defenseBuff) effects.defenseBuff = {};
            effects.defenseBuff[posType.toLowerCase()] = makeEffect();
          }
        }
        continue;
      }

      // ========== BASE_DEFENSE special handling ==========
      if (attrib === 'base_defense' || attrib === 'defense') {
        if (aspect === 'resistance') {
          // Defense with Resistance aspect = Elusivity (defense debuff resistance)
          if (!effects.elusivity) effects.elusivity = {};
          effects.elusivity.all = makeEffect();
        } else {
          // Normal defense buff/debuff
          if (isDebuff) {
            effects.defenseDebuff = makeEffect();
          } else {
            effects.defenseBuff = makeEffect();
          }
        }
        continue;
      }

      // ========== ELUSIVITY (Defense Debuff Resistance) ==========
      if (ELUSIVITY_TYPES[attrib]) {
        const elusType = ELUSIVITY_TYPES[attrib];
        if (!effects.elusivity) effects.elusivity = {};
        effects.elusivity[elusType.toLowerCase()] = makeEffect();
        continue;
      }

      // ========== MEZ EFFECTS ==========
      if (MEZ_TYPES[attrib]) {
        const mezType = MEZ_TYPES[attrib];
        const newMez = makeMezEffect();
        // Keep the higher magnitude mez effect (for powers with multiple mez effects)
        if (!effects[mezType] || newMez.mag > effects[mezType].mag) {
          effects[mezType] = newMez;
        }
        if (duration) effects.effectDuration = duration;
        continue;
      }

      // ========== KNOCKBACK/KNOCKUP/REPEL (no magnitude) ==========
      if (KNOCKBACK_TYPES[attrib]) {
        const kbType = KNOCKBACK_TYPES[attrib];
        effects[kbType] = makeEffect();
        continue;
      }

      // ========== MOVEMENT ==========
      if (MOVEMENT_TYPES[attrib]) {
        const moveType = MOVEMENT_TYPES[attrib];
        if (isDebuff || scale < 0) {
          // Slow effect
          if (!effects.slow) effects.slow = {};
          effects.slow[moveType] = makeEffect();
        } else {
          if (!effects.movement) effects.movement = {};
          effects.movement[moveType] = makeEffect();
        }
        continue;
      }

      // ========== RESOURCES (HP, End, Recovery, Regen, Absorb) ==========
      if (RESOURCE_TYPES[attrib]) {
        const resType = RESOURCE_TYPES[attrib];

        if (resType === 'hitPoints') {
          if (aspect === 'maximum') {
            effects.maxHPBuff = makeEffect();
          } else {
            // Current HP = healing
            effects.healing = makeEffect();
          }
        } else if (resType === 'endurance') {
          if (aspect === 'maximum') {
            effects.maxEndBuff = makeEffect();
          } else if (isDebuff || scale < 0) {
            effects.enduranceDrain = makeEffect();
          } else {
            effects.enduranceGain = makeEffect();
          }
        } else if (resType === 'recovery') {
          if (isDebuff || scale < 0) {
            effects.recoveryDebuff = makeEffect();
          } else {
            effects.recoveryBuff = makeEffect();
          }
        } else if (resType === 'regeneration') {
          if (isDebuff || scale < 0) {
            effects.regenDebuff = makeEffect();
          } else {
            effects.regenBuff = makeEffect();
          }
        } else if (resType === 'absorb') {
          effects.absorb = makeEffect();
        }
        continue;
      }

      // ========== COMBAT MODIFIERS ==========
      if (COMBAT_MODIFIERS[attrib]) {
        const modType = COMBAT_MODIFIERS[attrib];

        if (modType === 'toHit') {
          if (isDebuff) {
            effects.tohitDebuff = makeEffect();
          } else {
            effects.tohitBuff = makeEffect();
          }
        } else if (modType === 'defense') {
          // Skip - handled by BASE_DEFENSE section above
        } else if (modType === 'rechargeTime') {
          if (isDebuff || scale < 0 || table?.toLowerCase().includes('slow')) {
            effects.rechargeDebuff = makeEffect();
          } else {
            effects.rechargeBuff = makeEffect();
          }
        } else if (modType === 'threatLevel') {
          if (isDebuff || scale < 0) {
            effects.threatDebuff = makeEffect();
          } else {
            effects.threatBuff = makeEffect();
          }
        } else if (modType === 'range') {
          effects.rangeBuff = makeEffect();
        } else if (modType === 'enduranceDiscount') {
          effects.enduranceDiscount = makeEffect();
        }
        continue;
      }

      // ========== STEALTH/PERCEPTION ==========
      if (STEALTH_TYPES[attrib]) {
        const stealthType = STEALTH_TYPES[attrib];
        if (stealthType === 'perception') {
          if (isDebuff || scale < 0) {
            effects.perceptionDebuff = makeEffect();
          } else {
            effects.perceptionBuff = makeEffect();
          }
        } else {
          if (!effects.stealth) effects.stealth = {};
          effects.stealth[stealthType] = makeEffect();
        }
        continue;
      }

      // ========== CONTROL (Taunt, Placate, etc.) ==========
      if (CONTROL_TYPES[attrib]) {
        const ctrlType = CONTROL_TYPES[attrib];
        effects[ctrlType] = makeEffect();
        continue;
      }

      // ========== CATCH-ALL for unmapped attributes ==========
      // Log unmapped attributes for future addition
      unmappedAttribs.add(attrib);
    } // end for each attrib
  } // end for each template

  // Log any unmapped attributes (helps identify missing mappings)
  if (unmappedAttribs.size > 0) {
    // Uncomment for debugging:
    // console.log('  Unmapped attribs:', [...unmappedAttribs].join(', '));
  }

  return effects;
}

/**
 * Convert a single power file
 */
function convertPower(powerJson, availableLevel) {
  // Map target type to valid TypeScript type (or undefined if unknown)
  const rawTargetType = powerJson.target_type;
  const mappedTargetType = rawTargetType ? TARGET_TYPE_MAP[rawTargetType] : undefined;

  const power = {
    name: powerJson.display_name,
    internalName: powerJson.name,
    available: availableLevel,
    description: powerJson.display_help?.replace(/<[^>]+>/g, '').trim(),
    shortHelp: powerJson.display_short_help,
    icon: powerJson.icon,
    powerType: powerJson.type,
    targetType: mappedTargetType,
    effectArea: powerJson.effect_area,
  };

  // Basic stats
  power.stats = {
    accuracy: powerJson.accuracy,
    range: powerJson.range,
    radius: powerJson.radius,
    arc: powerJson.arc,
    recharge: powerJson.recharge_time,
    endurance: powerJson.endurance_cost,
    castTime: powerJson.activation_time,
    maxTargets: powerJson.max_targets_hit,
  };

  // Remove zero/null values
  Object.keys(power.stats).forEach(key => {
    if (!power.stats[key]) delete power.stats[key];
  });

  // Allowed enhancements (always include, even if empty, for type safety)
  power.allowedEnhancements = (powerJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b])
    .filter(Boolean);

  // Allowed IO set categories
  if (powerJson.allowed_boostset_cats?.length) {
    power.allowedSetCategories = powerJson.allowed_boostset_cats
      .map(c => SET_CATEGORY_MAP[c] || c)
      .filter(Boolean);
  }

  // If allowedEnhancements is empty but we have set categories, infer enhancements from categories
  if (power.allowedEnhancements.length === 0 && power.allowedSetCategories?.length > 0) {
    const inferredEnhancements = new Set();

    for (const category of power.allowedSetCategories) {
      const enhancements = SET_CATEGORY_TO_ENHANCEMENT[category];
      if (enhancements) {
        enhancements.forEach(e => inferredEnhancements.add(e));
      }
    }

    power.allowedEnhancements = Array.from(inferredEnhancements).sort();
  }

  // Max slots
  power.maxSlots = powerJson.max_boosts || 6;

  // Extract effects from templates
  // Recursively collect from child_effects too (many powers nest effects there)
  if (powerJson.effects?.length) {
    const allTemplates = collectAllTemplates(powerJson.effects);

    const damage = extractDamage(allTemplates);
    if (damage) power.damage = damage;

    const effects = extractEffects(allTemplates);
    if (Object.keys(effects).length) power.effects = effects;
  }

  // Requirements
  if (powerJson.requires) {
    power.requires = powerJson.requires;
  }

  // Mechanic power type detection
  const showInManage = powerJson.show_in_manage !== false; // defaults to true
  const maxBoosts = powerJson.max_boosts || 0;
  const autoIssue = powerJson.auto_issue === true;
  const showInInventory = powerJson.show_in_inventory || 'Show';
  const showInInfo = powerJson.show_in_info !== false; // defaults to true

  if (!showInManage && maxBoosts === 0) {
    if (autoIssue && availableLevel === -1) {
      power.mechanicType = 'childToggle';
    } else if (showInInventory === 'Never' && !showInInfo) {
      power.mechanicType = 'hiddenAuto';
    } else {
      power.mechanicType = 'hiddenPassive';
    }
  } else if (maxBoosts === 0 && availableLevel >= 0 && (!showInManage || powerJson.type === 'Auto')) {
    power.mechanicType = 'parentMechanic';
  }

  return power;
}

/**
 * Convert an entire powerset
 */
function convertPowerset(category, powersetName) {
  const categoryInfo = CATEGORY_MAP[category];
  if (!categoryInfo) {
    console.error(`Unknown category: ${category}`);
    console.log('Available categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  const rawPath = path.join(RAW_DATA_PATH, 'powers', category, powersetName);
  const indexPath = path.join(rawPath, 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.error(`Powerset not found: ${rawPath}`);
    process.exit(1);
  }

  const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Create output directory
  const outputDir = path.join(
    OUTPUT_PATH,
    categoryInfo.archetype,
    categoryInfo.type,
    toKebabCase(indexJson.display_name)
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Converting ${indexJson.display_name} to ${outputDir}`);

  // Convert each power
  const powers = [];
  const powerFiles = fs.readdirSync(rawPath).filter(f => f.endsWith('.json') && f !== 'index.json');

  for (const file of powerFiles) {
    const powerJson = JSON.parse(fs.readFileSync(path.join(rawPath, file), 'utf-8'));

    // Find the available level for this power
    const powerIndex = indexJson.power_names.findIndex(n =>
      n.toLowerCase().endsWith(powerJson.name.toLowerCase())
    );
    const availableLevel = powerIndex >= 0 ? indexJson.available_level[powerIndex] : 0;

    const power = convertPower(powerJson, availableLevel);
    powers.push(power);

    // Write individual power file
    const powerFileName = toKebabCase(power.name) + '.ts';
    const powerContent = `/**
 * ${power.name}
 * ${power.shortHelp}
 *
 * Source: ${category}/${powersetName}/${file}
 */

import type { Power } from '@/types';

export const ${power.name.replace(/[^a-zA-Z0-9]/g, '')}: Power = ${JSON.stringify(power, null, 2)};
`;

    fs.writeFileSync(path.join(outputDir, powerFileName), powerContent);
    console.log(`  - ${power.name}`);
  }

  // Sort powers by available level
  powers.sort((a, b) => a.available - b.available);

  // Generate unique variable names (handle duplicates)
  const usedNames = new Map(); // name -> count
  const powerVarNames = powers.map(p => {
    const baseName = p.name.replace(/[^a-zA-Z0-9]/g, '');
    const count = usedNames.get(baseName) || 0;
    usedNames.set(baseName, count + 1);
    return count > 0 ? `${baseName}${count + 1}` : baseName;
  });

  // Write index file
  const indexContent = `/**
 * ${indexJson.display_name} Powerset
 * ${indexJson.display_help?.replace(/<[^>]+>/g, '').trim()}
 *
 * Archetype: ${categoryInfo.archetype}
 * Category: ${categoryInfo.type}
 * Source: ${category}/${powersetName}
 */

import type { Powerset } from '@/types';

${powers.map((p, i) => `import { ${p.name.replace(/[^a-zA-Z0-9]/g, '')} as ${powerVarNames[i]} } from './${toKebabCase(p.name)}';`).join('\n')}

export const powerset: Powerset = {
  id: '${categoryInfo.archetype}/${toKebabCase(indexJson.display_name)}',
  name: '${indexJson.display_name}',
  description: '${indexJson.display_help?.replace(/<[^>]+>/g, '').replace(/'/g, "\\'")}',
  icon: '${indexJson.icon}',
  archetype: '${categoryInfo.archetype}',
  category: '${categoryInfo.type}',
  powers: [
${powerVarNames.map(name => `    ${name},`).join('\n')}
  ],
};

export default powerset;
`;

  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`\nWrote ${powers.length} powers to ${outputDir}`);

  return { powerset: indexJson, powers, outputDir };
}

// Export for reuse by other scripts (e.g., audit-powerset-effects.cjs)
module.exports = {
  extractEffects,
  extractDamage,
  CATEGORY_MAP,
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  DAMAGE_TYPES,
  DEFENSE_POSITIONS,
  ELUSIVITY_TYPES,
  MEZ_TYPES,
  KNOCKBACK_TYPES,
  MOVEMENT_TYPES,
  RESOURCE_TYPES,
  COMBAT_MODIFIERS,
  STEALTH_TYPES,
  CONTROL_TYPES,
  SPECIAL_ATTRIBS,
  RAW_DATA_PATH,
  collectAllTemplates,
};

// Main execution (only when run directly)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/convert-powerset.js <category> <powerset>');
    console.log('Example: node scripts/convert-powerset.js defender_buff radiation_emission');
    console.log('\nAvailable categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  convertPowerset(args[0], args[1]);
}
