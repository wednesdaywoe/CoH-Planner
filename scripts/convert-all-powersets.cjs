/**
 * Batch Powerset Conversion Script
 *
 * Converts ALL raw Homecoming power data to the new modular structure.
 * Usage: node scripts/convert-all-powersets.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = 'C:/Projects/Raw Data Homecoming/powers';

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

let converted = 0;
let failed = 0;
let skipped = 0;
const errors = [];

console.log('=== Batch Powerset Conversion ===\n');

for (const [category, info] of Object.entries(CATEGORIES)) {
  const categoryPath = path.join(RAW_DATA_PATH, category);

  if (!fs.existsSync(categoryPath)) {
    console.log(`[SKIP] Category not found: ${category}`);
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

    // Check if already converted
    if (fs.existsSync(outputDir) && fs.existsSync(path.join(outputDir, 'index.ts'))) {
      console.log(`  [EXISTS] ${info.archetype}/${powerset}`);
      skipped++;
      continue;
    }

    try {
      console.log(`  [CONVERT] ${category}/${powerset} -> ${info.archetype}/${info.type}/${powerset}`);
      execSync(`node scripts/convert-powerset.cjs ${category} ${powerset}`, {
        stdio: 'pipe',
        timeout: 30000
      });
      converted++;
    } catch (err) {
      console.log(`  [ERROR] ${category}/${powerset}: ${err.message}`);
      errors.push({ category, powerset, error: err.message });
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
    console.log(`  ${e.category}/${e.powerset}: ${e.error}`);
  }
}
