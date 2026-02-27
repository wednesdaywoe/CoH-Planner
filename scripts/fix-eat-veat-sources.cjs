/**
 * Fix EAT/VEAT Source Comments
 *
 * Updates Source comments in EAT/VEAT power files to include the full
 * raw JSON path (matching the format used by standard archetypes), so
 * that audit-comprehensive.cjs can find matching raw data.
 *
 * Current format:  Source: peacebringer/luminous-blast
 * New format:      Source: peacebringer_offensive/luminous_blast/gleaming_bolt.json
 *
 * Usage:
 *   node scripts/fix-eat-veat-sources.cjs                # Dry run
 *   node scripts/fix-eat-veat-sources.cjs --apply        # Write changes
 */

const fs = require('fs');
const path = require('path');

const { RAW_DATA_PATH } = require('./convert-powerset.cjs');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');
const POWERSETS_PATH = path.resolve('./src/data/powersets');

const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');

// ============================================
// SOURCE PATH → RAW DIRECTORY MAPPING
// ============================================

// Map processed Source paths to raw data directories
// Source format: "archetype/powerset-name"
// Raw format:   "raw_category/raw_powerset_name/"
const SOURCE_TO_RAW_MAP = {
  // Peacebringer
  'peacebringer/luminous-blast': 'peacebringer_offensive/luminous_blast',
  'peacebringer/luminous-aura': 'peacebringer_defensive/luminous_aura',

  // Warshade
  'warshade/umbral-blast': 'warshade_offensive/umbral_blast',
  'warshade/umbral-aura': 'warshade_defensive/umbral_aura',

  // Arachnos Soldier
  'arachnos-soldier/arachnos-soldier': 'arachnos_soldiers/arachnos_soldier',
  'arachnos-soldier/training-and-gadgets': 'training_gadgets/training_and_gadgets',
  'arachnos-soldier/bane-spider-training': 'training_gadgets/bane_spider_training',
  'arachnos-soldier/crab-spider-training': 'training_gadgets/crab_spider_training',

  // Arachnos Widow
  'arachnos-widow/widow-training': 'widow_training/widow_training',
  'arachnos-widow/night-widow-training': 'widow_training/night_widow_training',
  'arachnos-widow/fortunata-training': 'widow_training/fortunata_training',
  'arachnos-widow/teamwork': 'teamwork/teamwork',
  'arachnos-widow/widow-teamwork': 'teamwork/widow_teamwork',
  'arachnos-widow/fortunata-teamwork': 'teamwork/fortunata_teamwork',
};

// ============================================
// HELPERS
// ============================================

function findPowerFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findPowerFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      results.push(fullPath);
    }
  }
  return results;
}

function kebabToSnake(str) {
  return str.replace(/-/g, '_');
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log(`=== FIX EAT/VEAT SOURCE COMMENTS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

  const archetypes = ['peacebringer', 'warshade', 'arachnos-soldier', 'arachnos-widow'];
  let totalFixed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const archetype of archetypes) {
    const archPath = path.join(POWERSETS_PATH, archetype);
    if (!fs.existsSync(archPath)) {
      console.warn(`Archetype directory not found: ${archPath}`);
      continue;
    }

    const tsFiles = findPowerFiles(archPath);
    console.log(`${archetype}: ${tsFiles.length} power files`);

    for (const tsFile of tsFiles) {
      const content = fs.readFileSync(tsFile, 'utf-8');

      // Extract current Source comment
      const sourceMatch = content.match(/\*\s*Source:\s*(.+)\s*$/m);
      if (!sourceMatch) {
        totalSkipped++;
        continue;
      }

      const sourcePath = sourceMatch[1].trim();

      // Check if already has full path (includes .json)
      if (sourcePath.endsWith('.json')) {
        totalSkipped++;
        continue;
      }

      // Look up the raw directory
      const rawDir = SOURCE_TO_RAW_MAP[sourcePath];
      if (!rawDir) {
        console.warn(`  No mapping for Source: ${sourcePath} (${path.basename(tsFile)})`);
        totalErrors++;
        continue;
      }

      // Derive raw JSON filename from the TS filename
      // e.g., "gleaming-bolt.ts" → "gleaming_bolt.json"
      const tsBasename = path.basename(tsFile, '.ts');
      const rawFilename = kebabToSnake(tsBasename) + '.json';
      const rawFullPath = path.join(RAW_POWERS_PATH, rawDir, rawFilename);

      // Verify the raw file exists
      if (!fs.existsSync(rawFullPath)) {
        const rawDirPath = path.join(RAW_POWERS_PATH, rawDir);
        const rawFiles = fs.readdirSync(rawDirPath)
          .filter(f => f.endsWith('.json') && f !== 'index.json');

        // Try matching with colons (some raw files use "combat_training:_defensive.json")
        // Also try prefix variations (ws_, nw_, frt_ prefixed files)
        const snakeName = kebabToSnake(tsBasename);
        let matchedFile = null;

        // Strategy 1: Try colon variants (e.g., "combat_training_defensive" → "combat_training:_defensive")
        for (const rf of rawFiles) {
          const rfBase = rf.replace('.json', '');
          // Normalize both by removing colons and comparing
          if (rfBase.replace(/:/g, '') === snakeName) {
            matchedFile = rf;
            break;
          }
        }

        // Strategy 2: Try reading display_name/name from each raw file
        if (!matchedFile) {
          for (const rf of rawFiles) {
            try {
              const rawJson = JSON.parse(fs.readFileSync(path.join(rawDirPath, rf), 'utf-8'));
              const displayName = (rawJson.display_name || '').toLowerCase().replace(/[\s_]/g, '-').replace(/:/g, '');
              const internalName = (rawJson.name || '').toLowerCase();
              if (displayName === tsBasename || internalName === snakeName) {
                matchedFile = rf;
                break;
              }
            } catch { /* skip */ }
          }
        }

        if (matchedFile) {
          const newSource = `${rawDir}/${matchedFile}`;
          const updated = content.replace(
            /(\*\s*Source:\s*).+(\s*$)/m,
            `$1${newSource}$2`
          );
          if (applyChanges) {
            fs.writeFileSync(tsFile, updated, 'utf-8');
          }
          console.log(`  ${path.basename(tsFile)}: ${sourcePath} → ${newSource}`);
          totalFixed++;
        } else {
          console.warn(`  Raw file not found: ${rawFilename} in ${rawDir}/ (${path.basename(tsFile)})`);
          console.warn(`    Available: ${rawFiles.join(', ')}`);
          totalErrors++;
        }
        continue;
      }

      // Build new Source path
      const newSource = `${rawDir}/${rawFilename}`;
      const updated = content.replace(
        /(\*\s*Source:\s*).+(\s*$)/m,
        `$1${newSource}$2`
      );

      if (applyChanges) {
        fs.writeFileSync(tsFile, updated, 'utf-8');
      }
      console.log(`  ${path.basename(tsFile)}: ${sourcePath} → ${newSource}`);
      totalFixed++;
    }
    console.log('');
  }

  console.log(`--- SUMMARY ---`);
  console.log(`Fixed: ${totalFixed} | Skipped (already ok): ${totalSkipped} | Errors: ${totalErrors}`);
  if (!applyChanges && totalFixed > 0) {
    console.log(`\nRun with --apply to write changes`);
  }
}

main();
