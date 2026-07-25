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
const { parseDatasetArg } = require('./_dataset-paths.cjs');

// CATEGORY_MAP is the single raw-category → archetype/type routing table; the
// per-powerset converter owns it and this orchestrator only iterates it.
const { RAW_DATA_PATH, CATEGORY_MAP } = require('./convert-powerset.cjs');

const datasetId = parseDatasetArg();
// Forward `--dataset <id>` to each child convert-powerset.cjs invocation
// so the per-powerset converter writes into the same dataset folder.
const datasetFlag = `--dataset ${datasetId}`;

const force = process.argv.includes('--force');


let converted = 0;
let failed = 0;
let skipped = 0;
const errors = [];

console.log(`=== Batch Powerset Conversion${force ? ' (FORCE)' : ''} ===\n`);

// Bin export writes categories at <RAW_DATA_PATH>/<category>/.
// Old CoD2 layout had an extra `powers/` segment. Probe both.
const powersPath = (() => {
  const newLayout = RAW_DATA_PATH;  // categories are direct children
  const oldLayout = path.join(RAW_DATA_PATH, 'powers');
  // Detect by checking for any known category directory
  for (const cat of Object.keys(CATEGORY_MAP)) {
    if (fs.existsSync(path.join(newLayout, cat))) return newLayout;
    if (fs.existsSync(path.join(oldLayout, cat))) return oldLayout;
  }
  return newLayout;
})();

for (const [category, info] of Object.entries(CATEGORY_MAP)) {
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
    // Output dir matches the per-powerset converter's destination so the
    // [EXISTS] / --force / rmSync checks all line up with the actual write
    // path. All datasets write under `src/data/datasets/<id>/powersets/...`.
    const outputDir = `./src/data/datasets/${datasetId}/powersets/${info.archetype}/${info.type}/${powerset.replace(/_/g, '-')}`;

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
      execSync(`node scripts/convert-powerset.cjs ${category} ${powerset} ${datasetFlag}`, {
        // Child stdout is the per-power listing (thousands of lines); its stderr is the
        // converter's warning path — a record it read but could not use. Piping BOTH made every
        // such warning vanish from the batch run that regen actually uses.
        stdio: ['ignore', 'pipe', 'inherit'],
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
