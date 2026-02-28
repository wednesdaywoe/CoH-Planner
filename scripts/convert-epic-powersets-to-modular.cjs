/**
 * Convert Epic Archetype Powersets to Modular Format
 *
 * Converts the legacy epic-powersets-raw.ts data to the new modular structure.
 * Usage: node scripts/convert-epic-powersets-to-modular.cjs
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = './src/data/powersets';

// Enhancement type mapping from legacy to new format
// Valid types: Damage, Accuracy, Recharge, EnduranceReduction, Range, Defense, Resistance,
// Healing, ToHit, ToHit Debuff, Defense Debuff, Hold, Stun, Immobilize, Sleep, Confuse,
// Fear, Knockback, Run Speed, Jump, Fly, Mez Duration, Taunt, Slow, Intangible
const ENHANCEMENT_TYPE_MAP = {
  'DamageResistance': 'Resistance',
  'DefenseDebuff': 'Defense Debuff',
  'Enhance Slow Movement': 'Slow',
  'Enhance Endurance Modification': 'EnduranceReduction',
  'Enhance Immobilization': 'Immobilize',
  'Enhance Running Speed': 'Run Speed',
  'Enhance Flying Speed': 'Fly',
  'Enhance ToHit Buffs': 'ToHit',
  'Enhance ToHit DeBuffs': 'ToHit Debuff',
  'Enhance KnockBack': 'Knockback',
  'Enhance Disorient': 'Stun',
  'Enhance Threat Duration': 'Taunt',
  'Reduce Interrupt Time': null, // No valid mapping - skip
  'JumpHeight': 'Jump',
  // Keep these as-is (they're correct)
  'EnduranceReduction': 'EnduranceReduction',
  'Range': 'Range',
  'Recharge': 'Recharge',
  'Damage': 'Damage',
  'Accuracy': 'Accuracy',
  'Healing': 'Healing',
  'Defense': 'Defense',
  'Hold': 'Hold',
  'Immobilize': 'Immobilize',
  'Stun': 'Stun',
  'Sleep': 'Sleep',
  'Confuse': 'Confuse',
  'Fear': 'Fear',
  'Knockback': 'Knockback',
  'ToHit': 'ToHit',
  'ToHit Buff': 'ToHit',
  'ToHit Debuff': 'ToHit Debuff',
  'Slow': 'Slow',
  'Fly': 'Fly',
  'Run Speed': 'Run Speed',
  'Jump': 'Jump',
  'Taunt': 'Taunt',
  'Resistance': 'Resistance',
  'Intangible': 'Intangible',
};

/**
 * Map enhancement type to valid TypeScript type, returns null if invalid
 */
function mapEnhancementType(type) {
  const mapped = ENHANCEMENT_TYPE_MAP[type];
  if (mapped === null) return null; // Explicitly skip
  return mapped || type;
}

// Map IO set categories to enhancement types that should be allowed
// Used to infer allowedEnhancements when raw data doesn't provide them
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

// Read and parse the raw data file
const rawFilePath = './src/data/epic-powersets-raw.ts';
const rawContent = fs.readFileSync(rawFilePath, 'utf-8');

// Extract the JSON object from the TypeScript export
const match = rawContent.match(/export const EPIC_POWERSETS_RAW = (\{[\s\S]*\})\s*(as const)?;?\s*$/);
if (!match) {
  console.error('Could not parse epic-powersets-raw.ts');
  process.exit(1);
}

const EPIC_POWERSETS_RAW = eval('(' + match[1] + ')');

/**
 * Convert a power name to kebab-case filename
 */
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert a power name to PascalCase for variable names
 */
function toPascalCase(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Map enhancement type to valid TypeScript type, returns null if explicitly invalid
 */
function mapEnhancementType(type) {
  const mapped = ENHANCEMENT_TYPE_MAP[type];
  if (mapped === null) return null; // Explicitly skip invalid types
  return mapped || type;
}

/**
 * Convert legacy damage format to modular format
 */
function convertDamage(legacyDamage) {
  if (!legacyDamage) return undefined;

  // Single damage type
  if (legacyDamage.type) {
    return {
      type: legacyDamage.type,
      scale: legacyDamage.scale,
    };
  }

  // Multiple damage types - convert to array
  if (legacyDamage.types && Array.isArray(legacyDamage.types)) {
    return legacyDamage.types.map(t => ({
      type: t.type,
      scale: t.scale,
    }));
  }

  return undefined;
}

/**
 * Convert legacy power format to modular format
 */
function convertPower(legacyPower) {
  const effects = legacyPower.effects || {};

  const power = {
    name: legacyPower.name,
    available: legacyPower.available,
    description: legacyPower.description,
    shortHelp: legacyPower.shortHelp,
    icon: legacyPower.icon,
    powerType: legacyPower.powerType,
    effectArea: legacyPower.effectArea,
    maxSlots: legacyPower.maxSlots,
    allowedEnhancements: (legacyPower.allowedEnhancements || []).map(mapEnhancementType).filter(Boolean),
    allowedSetCategories: legacyPower.allowedSetCategories || [],
  };

  // NOTE: Do NOT infer allowedEnhancements from set categories.
  // The source data's allowedEnhancements is authoritative.
  // allowedSetCategories only determines which IO SETS can be slotted.

  // Stats
  power.stats = {};
  if (effects.accuracy) power.stats.accuracy = effects.accuracy;
  if (effects.range) power.stats.range = effects.range;
  if (effects.recharge) power.stats.recharge = effects.recharge;
  if (effects.endurance) power.stats.endurance = effects.endurance;
  if (effects.cast) power.stats.castTime = effects.cast;
  if (legacyPower.radius) power.stats.radius = legacyPower.radius;
  if (legacyPower.maxTargets) power.stats.maxTargets = legacyPower.maxTargets;

  // Remove empty stats object
  if (Object.keys(power.stats).length === 0) {
    delete power.stats;
  }

  // Optional fields
  if (legacyPower.targetType) power.targetType = legacyPower.targetType;
  if (legacyPower.requires) power.requires = legacyPower.requires;

  // NOTE: Skipping damage and effects fields - Epic AT data doesn't have properly
  // typed data that matches the Power type. This data would need to be manually added
  // from Homecoming raw data files if detailed effect info is needed.

  return power;
}

/**
 * Generate a power file content
 */
function generatePowerFile(power, sourceId) {
  const varName = toPascalCase(power.name);
  return `/**
 * ${power.name}
 * ${power.shortHelp || ''}
 *
 * Source: ${sourceId}
 */

import type { Power } from '@/types';

export const ${varName}: Power = ${JSON.stringify(power, null, 2)};
`;
}

/**
 * Generate the index file for a powerset
 */
function generateIndexFile(powerset, powersetId, powers) {
  const [archetype, setName] = powersetId.split('/');
  const powerImports = powers.map(p => {
    const varName = toPascalCase(p.name);
    const fileName = toKebabCase(p.name);
    return `import { ${varName} } from './${fileName}';`;
  }).join('\n');

  const powerList = powers.map(p => `    ${toPascalCase(p.name)},`).join('\n');

  return `/**
 * ${powerset.name} Powerset
 * ${powerset.description}
 *
 * Archetype: ${archetype}
 * Category: Epic
 */

import type { Powerset } from '@/types';

${powerImports}

export const powerset: Powerset = {
  id: '${powersetId}',
  name: '${powerset.name}',
  description: '${powerset.description.replace(/'/g, "\\'")}',
  icon: '${powerset.icon}',
  archetype: '${archetype}',
  category: 'epic',
  powers: [
${powerList}
  ],
};

export default powerset;
`;
}

/**
 * Convert a single powerset
 */
function convertPowerset(powersetId, powersetData) {
  const [archetype, setName] = powersetId.split('/');
  const outputDir = path.join(OUTPUT_PATH, archetype, 'epic', setName);

  // Create directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Converting ${powersetId} to ${outputDir}`);

  // Convert and write each power
  const powers = [];
  for (const legacyPower of powersetData.powers) {
    const power = convertPower(legacyPower);
    powers.push(power);

    const fileName = toKebabCase(power.name) + '.ts';
    const content = generatePowerFile(power, powersetId);
    fs.writeFileSync(path.join(outputDir, fileName), content);
    console.log(`  - ${power.name}`);
  }

  // Sort by available level
  powers.sort((a, b) => a.available - b.available);

  // Write index file
  const indexContent = generateIndexFile(powersetData, powersetId, powers);
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);

  return { archetype, setName, powers };
}

// Main execution
console.log('Converting Epic Archetype powersets to modular format...\n');

const converted = [];
for (const [powersetId, powersetData] of Object.entries(EPIC_POWERSETS_RAW)) {
  const result = convertPowerset(powersetId, powersetData);
  converted.push(result);
  console.log();
}

console.log(`\nConverted ${converted.length} Epic AT powersets.`);
console.log('\nNext steps:');
console.log('1. Update src/data/powersets/index.ts to import these powersets');
console.log('2. Update src/data/powersets.ts to remove epic-powersets-raw.ts import');
console.log('3. Delete src/data/epic-powersets-raw.ts');
