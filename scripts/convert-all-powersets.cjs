/**
 * Batch Powerset Conversion Script
 *
 * Converts ALL raw Homecoming power data to the new modular structure.
 * Usage: node scripts/convert-all-powersets.cjs [--force]
 *   --force  Reconvert even if output directory already exists
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const { RAW_DATA_PATH } = require('./convert-powerset.cjs');

const force = process.argv.includes('--force');

// Map raw category names to our folder structure
const CATEGORIES = {
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

// Also handle EAT/VEAT categories
const EXTRA_CATEGORIES = {
  'peacebringer_defense': { archetype: 'peacebringer', type: 'primary' },
  'peacebringer_ranged': { archetype: 'peacebringer', type: 'secondary' },
  'warshade_defense': { archetype: 'warshade', type: 'primary' },
  'warshade_ranged': { archetype: 'warshade', type: 'secondary' },
  'arachnos_soldier_ranged': { archetype: 'arachnos-soldier', type: 'primary' },
  'arachnos_soldier_support': { archetype: 'arachnos-soldier', type: 'secondary' },
  'arachnos_widow_melee': { archetype: 'arachnos-widow', type: 'primary' },
  'arachnos_widow_support': { archetype: 'arachnos-widow', type: 'secondary' },
};

const ALL_CATEGORIES = { ...CATEGORIES, ...EXTRA_CATEGORIES };

let converted = 0;
let failed = 0;
let skipped = 0;
const errors = [];

console.log(`=== Batch Powerset Conversion${force ? ' (FORCE)' : ''} ===\n`);

const powersPath = path.join(RAW_DATA_PATH, 'powers');

for (const [category, info] of Object.entries(ALL_CATEGORIES)) {
  const categoryPath = path.join(powersPath, category);

  if (!fs.existsSync(categoryPath)) {
    // console.log(`[SKIP] Category not found: ${category}`);
    continue;
  }

  const powersets = fs.readdirSync(categoryPath)
    .filter(item => {
      const itemPath = path.join(categoryPath, item);
      return fs.statSync(itemPath).isDirectory();
    });

  console.log(`\n--- ${category} (${powersets.length} powersets) ---`);

  for (const powerset of powersets) {
    const outputDir = `./src/data/powersets/${info.archetype}/${info.type}/${powerset.replace(/_/g, '-')}`;

    // Check if already converted (skip unless --force)
    if (!force && fs.existsSync(outputDir) && fs.existsSync(path.join(outputDir, 'index.ts'))) {
      console.log(`  [EXISTS] ${info.archetype}/${powerset}`);
      skipped++;
      continue;
    }

    // In force mode, remove existing output so convert-powerset.cjs regenerates it
    if (force && fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }

    try {
      console.log(`  [CONVERT] ${category}/${powerset} -> ${info.archetype}/${info.type}/${powerset}`);
      execSync(`node scripts/convert-powerset.cjs ${category} ${powerset}`, {
        stdio: 'pipe',
        timeout: 30000
      });
      converted++;
    } catch (err) {
      const stderr = err.stderr ? err.stderr.toString().trim() : err.message;
      console.log(`  [ERROR] ${category}/${powerset}: ${stderr.split('\n')[0]}`);
      errors.push({ category, powerset, error: stderr });
      failed++;
    }
  }
}

console.log('\n=== Summary ===');
console.log(`Converted: ${converted}`);
console.log(`Skipped (already exists): ${skipped}`);
console.log(`Failed: ${failed}`);

if (errors.length > 0) {
  console.log('\n=== Errors ===');
  for (const e of errors) {
    console.log(`  ${e.category}/${e.powerset}: ${e.error.split('\n')[0]}`);
  }
}
