/**
 * Script to convert Epic Archetype (Kheldian and Arachnos) powersets from Homecoming raw data
 *
 * Run with: node scripts/convert-epic-powersets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base path to Homecoming raw data
const RAW_DATA_BASE = 'C:/Projects/Raw Data Homecoming/powers';

// Mapping of powersets to convert
const POWERSET_MAPPINGS = [
  // Kheldians - Peacebringer
  {
    id: 'peacebringer/luminous-blast',
    sourceFolder: 'peacebringer_offensive/luminous_blast',
    effectsFolder: 'kheldian_pets/luminous_blast', // For redirect resolution
  },
  {
    id: 'peacebringer/luminous-aura',
    sourceFolder: 'peacebringer_defensive/luminous_aura',
    effectsFolder: 'kheldian_pets/luminous_aura',
  },
  // Kheldians - Warshade
  {
    id: 'warshade/umbral-blast',
    sourceFolder: 'warshade_offensive/umbral_blast',
    effectsFolder: 'kheldian_pets/umbral_blast',
  },
  {
    id: 'warshade/umbral-aura',
    sourceFolder: 'warshade_defensive/umbral_aura',
    effectsFolder: 'kheldian_pets/umbral_aura',
  },
  // Arachnos Soldier
  {
    id: 'arachnos-soldier/arachnos-soldier',
    sourceFolder: 'v_arachnos_proxy/arachnos_soldier_proxy',
  },
  {
    id: 'arachnos-soldier/training-and-gadgets',
    sourceFolder: 'training_gadgets/training_and_gadgets',
  },
  {
    id: 'arachnos-soldier/bane-spider-training',
    sourceFolder: 'training_gadgets/bane_spider_training',
  },
  {
    id: 'arachnos-soldier/crab-spider-training',
    sourceFolder: 'training_gadgets/crab_spider_training',
  },
  // Arachnos Widow
  {
    id: 'arachnos-widow/widow-training',
    sourceFolder: 'widow_training/widow_training',
  },
  {
    id: 'arachnos-widow/teamwork',
    sourceFolder: 'teamwork/teamwork',
  },
  {
    id: 'arachnos-widow/night-widow-training',
    sourceFolder: 'widow_training/night_widow_training',
  },
  {
    id: 'arachnos-widow/widow-teamwork',
    sourceFolder: 'teamwork/widow_teamwork',
  },
  {
    id: 'arachnos-widow/fortunata-training',
    sourceFolder: 'widow_training/fortunata_training',
  },
  {
    id: 'arachnos-widow/fortunata-teamwork',
    sourceFolder: 'teamwork/fortunata_teamwork',
  },
];

/**
 * Map raw boosts_allowed to our allowedEnhancements format
 */
function mapEnhancements(boostsAllowed) {
  const mapping = {
    'Reduce Endurance Cost': 'EnduranceReduction',
    'Enhance Range': 'Range',
    'Enhance Recharge Speed': 'Recharge',
    'Enhance Damage': 'Damage',
    'Enhance Accuracy': 'Accuracy',
    'Enhance Defense DeBuff': 'DefenseDebuff',
    'Enhance ToHit DeBuff': 'ToHitDebuff',
    'Enhance Defense': 'Defense',
    'Enhance ToHit': 'ToHit',
    'Enhance Heal': 'Healing',
    'Enhance Knockback': 'Knockback',
    'Enhance Run Speed': 'RunSpeed',
    'Enhance Jump': 'JumpHeight',
    'Enhance Fly Speed': 'FlySpeed',
    'Enhance Hold': 'Hold',
    'Enhance Stun': 'Stun',
    'Enhance Immobilize': 'Immobilize',
    'Enhance Sleep': 'Sleep',
    'Enhance Confuse': 'Confuse',
    'Enhance Fear': 'Fear',
    'Enhance Taunt': 'Taunt',
    'Enhance Slow': 'Slow',
    'Enhance Damage Resistance': 'DamageResistance',
    'Enhance Intangibility': 'Intangibility',
  };

  return (boostsAllowed || [])
    .map((boost) => mapping[boost] || boost)
    .filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates
}

/**
 * Extract damage information from effects array
 */
function extractDamageFromEffects(effects) {
  if (!effects || effects.length === 0) return null;

  const damageEffects = [];

  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue; // Skip PVP-only effects

    for (const template of effect.templates || []) {
      const attribs = template.attribs || [];
      for (const attrib of attribs) {
        if (attrib.endsWith('_Dmg')) {
          const damageType = attrib.replace('_Dmg', '');
          damageEffects.push({
            type: damageType,
            scale: template.scale || 0,
            table: template.table || 'Ranged_Damage',
          });
        }
      }
    }
  }

  if (damageEffects.length === 0) return null;
  if (damageEffects.length === 1) {
    return {
      type: damageEffects[0].type,
      scale: damageEffects[0].scale,
    };
  }

  // Multiple damage types
  const totalScale = damageEffects.reduce((sum, d) => sum + d.scale, 0);
  return {
    types: damageEffects.map((d) => ({ type: d.type, scale: d.scale })),
    scale: totalScale,
  };
}

/**
 * Calculate tier from available level
 */
function calculateTier(availableLevel) {
  if (availableLevel <= 0) return 1;
  if (availableLevel <= 3) return 2;
  if (availableLevel <= 7) return 3;
  if (availableLevel <= 13) return 4;
  if (availableLevel <= 19) return 5;
  if (availableLevel <= 25) return 6;
  if (availableLevel <= 31) return 7;
  if (availableLevel <= 37) return 8;
  return 9;
}

/**
 * Read and parse a power JSON file, following redirects if necessary
 */
function readPowerFile(powerPath, effectsFolder) {
  const powerJson = JSON.parse(fs.readFileSync(powerPath, 'utf-8'));

  // If this power has redirects and we have an effects folder, try to get effects from there
  if (
    powerJson.redirect &&
    powerJson.redirect.length > 0 &&
    effectsFolder &&
    (!powerJson.effects || powerJson.effects.length === 0)
  ) {
    // Find a non-form-specific redirect (the base power)
    const baseRedirect = powerJson.redirect.find(
      (r) => !r.condition_expression || !r.condition_expression.includes('Mode?')
    );

    if (baseRedirect) {
      // Parse redirect name to get filename
      const redirectParts = baseRedirect.name.split('.');
      const redirectPowerName = redirectParts[redirectParts.length - 1].toLowerCase();
      const effectsPath = path.join(RAW_DATA_BASE, effectsFolder, `${redirectPowerName}.json`);

      if (fs.existsSync(effectsPath)) {
        const effectsJson = JSON.parse(fs.readFileSync(effectsPath, 'utf-8'));
        // Merge effects from redirect target
        powerJson.effects = effectsJson.effects || [];
      }
    }
  }

  return powerJson;
}

/**
 * Convert a single powerset from raw data
 */
function convertPowerset(mapping) {
  const sourceDir = path.join(RAW_DATA_BASE, mapping.sourceFolder);
  const indexPath = path.join(sourceDir, 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.warn(`  Index not found: ${indexPath}`);
    return null;
  }

  const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Clean up description HTML
  let description = indexJson.display_help || `${indexJson.display_name} powerset`;
  description = description.replace(/<br>/gi, ' ').replace(/<[^>]+>/g, '');

  const powerset = {
    name: indexJson.display_name || indexJson.name,
    category: 'Epic',
    description: description,
    icon: indexJson.icon || '',
    powers: [],
  };

  // Process each power
  const powerNames = indexJson.power_names || [];
  const displayNames = indexJson.power_display_names || [];
  const shortHelps = indexJson.power_short_helps || [];
  const availableLevels = indexJson.available_level || [];

  for (let i = 0; i < powerNames.length; i++) {
    // Extract power filename from full name
    const fullName = powerNames[i];
    const nameParts = fullName.split('.');
    // Convert colons to double underscores (Windows filesystem limitation)
    const powerFileName = nameParts[nameParts.length - 1].toLowerCase().replace(/:/g, '_');
    const powerPath = path.join(sourceDir, `${powerFileName}.json`);

    if (!fs.existsSync(powerPath)) {
      console.warn(`  Power file not found: ${powerPath}`);
      continue;
    }

    const powerJson = readPowerFile(powerPath, mapping.effectsFolder);
    const availableLevel = availableLevels[i] ?? 0;

    // Skip powers with negative available level (not selectable)
    if (availableLevel < 0) continue;

    // Skip inherent powers that are auto-granted (not selectable in powerset)
    const powerDisplayName = displayNames[i] || powerJson.display_name || '';
    const inherentPowers = ['Energy Flight', 'Shadow Step'];
    if (inherentPowers.includes(powerDisplayName)) continue;

    const power = {
      name: displayNames[i] || powerJson.display_name || powerFileName,
      available: availableLevel,
      tier: calculateTier(availableLevel),
      maxSlots: powerJson.max_boosts || 6,
      allowedEnhancements: mapEnhancements(powerJson.boosts_allowed),
      allowedSetCategories: powerJson.allowed_boostset_cats || [],
      description: (powerJson.display_help || '').replace(/<br>/gi, ' ').replace(/<[^>]+>/g, ''),
      shortHelp: shortHelps[i] || powerJson.display_short_help || '',
      icon: powerJson.icon || '',
      powerType: powerJson.type || 'Click',
      targetType: powerJson.target_type || 'Self',
      effectArea: powerJson.effect_area || 'SingleTarget',
      effects: {
        accuracy: powerJson.accuracy || 1.0,
        range: powerJson.range || 0,
        recharge: powerJson.recharge_time || 0,
        endurance: powerJson.endurance_cost || 0,
        cast: powerJson.activation_time || 0,
      },
    };

    // Add max targets if applicable
    if (powerJson.max_targets_hit && powerJson.max_targets_hit > 0) {
      power.maxTargets = powerJson.max_targets_hit;
    }

    // Add arc if it's a cone
    if (powerJson.arc && powerJson.arc > 0) {
      power.arc = powerJson.arc;
    }

    // Add radius if applicable
    if (powerJson.radius && powerJson.radius > 0) {
      power.radius = powerJson.radius;
    }

    // Extract damage from effects
    const damage = extractDamageFromEffects(powerJson.effects);
    if (damage) {
      power.effects.damage = damage;
    }

    // Tag form-specific powers for Kheldians with requires field
    if (powerJson.modes_required && powerJson.modes_required.length > 0) {
      const modes = powerJson.modes_required;
      // Map mode requirements to the actual form power name
      if (modes.some((m) => m.includes('Nova') || m.includes('Blaster'))) {
        // Peacebringer Nova = "Bright Nova", Warshade Nova = "Dark Nova"
        if (mapping.id.startsWith('peacebringer/')) {
          power.requires = 'Bright Nova';
        } else if (mapping.id.startsWith('warshade/')) {
          power.requires = 'Dark Nova';
        }
      } else if (modes.some((m) => m.includes('Dwarf') || m.includes('Tanker'))) {
        // Peacebringer Dwarf = "White Dwarf", Warshade Dwarf = "Black Dwarf"
        if (mapping.id.startsWith('peacebringer/')) {
          power.requires = 'White Dwarf';
        } else if (mapping.id.startsWith('warshade/')) {
          power.requires = 'Black Dwarf';
        }
      }
    }

    powerset.powers.push(power);
  }

  return powerset;
}

/**
 * Main conversion function
 */
function convertEpicPowersets() {
  const outputPath = path.join(__dirname, '../src/data/epic-powersets-raw.ts');

  console.log('Converting Epic Archetype powersets...');
  console.log(`Reading from: ${RAW_DATA_BASE}`);

  const powersets = {};

  for (const mapping of POWERSET_MAPPINGS) {
    console.log(`  Converting: ${mapping.id}`);
    const powerset = convertPowerset(mapping);
    if (powerset) {
      powersets[mapping.id] = powerset;
      console.log(`    -> ${powerset.powers.length} powers`);
    }
  }

  console.log(`\nTotal: ${Object.keys(powersets).length} powersets`);

  // Generate TypeScript output
  const tsContent = `/**
 * Raw Epic Archetype Powerset data
 * Auto-generated from Homecoming raw data
 *
 * DO NOT EDIT THIS FILE DIRECTLY
 * Run: node scripts/convert-epic-powersets.js
 *
 * Total powersets: ${Object.keys(powersets).length}
 * Archetypes: Peacebringer, Warshade, Arachnos Soldier, Arachnos Widow
 */

export const EPIC_POWERSETS_RAW = ${JSON.stringify(powersets, null, 2)} as const;
`;

  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`\nWritten to: ${outputPath}`);
}

// Run conversion
convertEpicPowersets();
