/**
 * Convert Pet Entity & Power Data
 *
 * Reads entity files + their power files from raw data,
 * outputs a TypeScript data module with pet abilities for damage calculation.
 */

const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../raw_data_homecoming-20251209_7415');
const ENTITIES_PATH = path.join(RAW_DATA_PATH, 'entities');
const POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');
const OUTPUT_PATH = path.join(__dirname, '../src/data/pet-entities.ts');

// Damage type attributes we care about
const DAMAGE_ATTRIBS = new Set([
  'smashing_dmg', 'lethal_dmg', 'fire_dmg', 'cold_dmg',
  'energy_dmg', 'negative_energy_dmg', 'toxic_dmg', 'psionic_dmg',
]);

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
  // Must be a damage attribute
  const attribs = (template.attribs || []).map(a => a.toLowerCase());
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
    attackTypes: powerData.attack_types?.length > 0 ? powerData.attack_types : undefined,
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
