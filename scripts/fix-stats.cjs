/**
 * Fix stat values in processed power files to match raw Homecoming JSON
 *
 * Reads raw JSON stats (accuracy, range, recharge_time, endurance_cost,
 * activation_time, radius, arc, max_targets_hit) and patches the processed
 * TS power files to match.
 *
 * Usage:
 *   node scripts/fix-stats.cjs --archetype blaster          # Dry run
 *   node scripts/fix-stats.cjs --archetype blaster --apply   # Write changes
 *   node scripts/fix-stats.cjs --all --apply                 # All archetypes
 */

const fs = require('fs');
const path = require('path');
const { RAW_DATA_PATH } = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');
const allArchetypes = args.includes('--all');
const archetypeIdx = args.indexOf('--archetype');
const archetype = archetypeIdx >= 0 ? args[archetypeIdx + 1] : null;

if (!archetype && !allArchetypes) {
  console.error('Usage: node scripts/fix-stats.cjs --archetype <name> [--apply]');
  console.error('       node scripts/fix-stats.cjs --all [--apply]');
  process.exit(1);
}

// Stat mapping: raw field name → processed stat key
const STAT_MAP = {
  accuracy: 'accuracy',
  range: 'range',
  recharge_time: 'recharge',
  endurance_cost: 'endurance',
  activation_time: 'castTime',
  radius: 'radius',
  arc: 'arc',
  max_targets_hit: 'maxTargets',
};

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

function extractSourceComment(tsContent) {
  const match = tsContent.match(/\*\s*Source:\s*(.+\.json)\s*$/m);
  return match ? match[1].trim() : null;
}

function getRawStats(rawJson) {
  const stats = {};
  if (rawJson.accuracy && rawJson.accuracy !== 1) stats.accuracy = rawJson.accuracy;
  else if (rawJson.accuracy === 1) stats.accuracy = 1;
  if (rawJson.range && rawJson.range > 0) stats.range = rawJson.range;
  if (rawJson.recharge_time && rawJson.recharge_time > 0) stats.recharge = rawJson.recharge_time;
  if (rawJson.endurance_cost && rawJson.endurance_cost > 0) stats.endurance = rawJson.endurance_cost;
  if (rawJson.activation_time && rawJson.activation_time > 0) stats.castTime = rawJson.activation_time;
  if (rawJson.radius && rawJson.radius > 0) stats.radius = rawJson.radius;
  if (rawJson.arc && rawJson.arc > 0) stats.arc = rawJson.arc;
  if (rawJson.max_targets_hit && rawJson.max_targets_hit > 0) stats.maxTargets = rawJson.max_targets_hit;
  return stats;
}

function fixFile(tsFilePath) {
  const tsContent = fs.readFileSync(tsFilePath, 'utf-8');
  const sourcePath = extractSourceComment(tsContent);
  if (!sourcePath) return { skipped: true, reason: 'no source comment' };

  const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);
  if (!fs.existsSync(rawJsonPath)) return { skipped: true, reason: 'raw JSON not found' };

  const rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
  const rawStats = getRawStats(rawJson);

  // Parse current stats from TS file
  const statsRegex = /"stats"\s*:\s*\{([^}]*)\}/s;
  const statsMatch = tsContent.match(statsRegex);
  if (!statsMatch) return { skipped: true, reason: 'no stats block' };

  // Parse individual stat values
  const currentStats = {};
  const statLineRegex = /"(\w+)"\s*:\s*([0-9.e+-]+)/g;
  let m;
  while ((m = statLineRegex.exec(statsMatch[1])) !== null) {
    currentStats[m[1]] = parseFloat(m[2]);
  }

  // Compare and find changes
  const changes = [];

  // Check for mismatches in existing stats
  for (const [key, rawVal] of Object.entries(rawStats)) {
    if (currentStats[key] !== undefined && currentStats[key] !== rawVal) {
      changes.push({ key, from: currentStats[key], to: rawVal, type: 'mismatch' });
    } else if (currentStats[key] === undefined && rawVal > 0) {
      // Missing stat that should be present
      changes.push({ key, from: undefined, to: rawVal, type: 'missing' });
    }
  }

  if (changes.length === 0) return { skipped: true, reason: 'stats match' };

  // Build new stats object with raw values
  const mergedStats = { ...currentStats };
  for (const change of changes) {
    mergedStats[change.key] = change.to;
  }

  // Rebuild stats block preserving key order (raw stat order)
  const statOrder = ['accuracy', 'range', 'recharge', 'endurance', 'castTime', 'radius', 'arc', 'maxTargets'];
  const statLines = [];
  for (const key of statOrder) {
    if (mergedStats[key] !== undefined) {
      statLines.push(`    "${key}": ${mergedStats[key]}`);
    }
  }
  // Add any other stats not in the standard order
  for (const key of Object.keys(mergedStats)) {
    if (!statOrder.includes(key)) {
      statLines.push(`    "${key}": ${mergedStats[key]}`);
    }
  }

  const newStatsBlock = `"stats": {\n${statLines.join(',\n')}\n  }`;
  const updatedContent = tsContent.replace(statsRegex, newStatsBlock);

  if (applyChanges) {
    fs.writeFileSync(tsFilePath, updatedContent);
  }

  return { fixed: true, changes };
}

function processArchetype(atName) {
  const atPath = path.join(POWERSETS_PATH, atName);
  if (!fs.existsSync(atPath)) {
    console.error(`Archetype not found: ${atName}`);
    return { fixed: 0, skipped: 0 };
  }

  const tsFiles = findPowerFiles(atPath);
  let fixedCount = 0;
  let skippedCount = 0;

  for (const tsFile of tsFiles) {
    const rel = path.relative(POWERSETS_PATH, tsFile);
    const result = fixFile(tsFile);

    if (result.fixed) {
      fixedCount++;
      const prefix = applyChanges ? '' : '[DRY-RUN] ';
      console.log(`${prefix}FIXED: ${rel}`);
      for (const c of result.changes) {
        if (c.type === 'missing') {
          console.log(`  + ${c.key}: ${c.to} (added)`);
        } else {
          console.log(`  ${c.key}: ${c.from} → ${c.to}`);
        }
      }
    } else {
      skippedCount++;
    }
  }

  return { fixed: fixedCount, skipped: skippedCount, total: tsFiles.length };
}

// Main
console.log(`=== FIX STATS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

if (allArchetypes) {
  const dirs = fs.readdirSync(POWERSETS_PATH, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalFixed = 0;
  let totalSkipped = 0;

  for (const at of dirs) {
    console.log(`\n--- ${at} ---`);
    const result = processArchetype(at);
    totalFixed += result.fixed;
    totalSkipped += result.skipped;
    console.log(`  ${result.fixed} fixed, ${result.skipped} skipped (of ${result.total})`);
  }

  console.log(`\n=== TOTAL: ${totalFixed} fixed, ${totalSkipped} skipped ===`);
  if (!applyChanges && totalFixed > 0) {
    console.log('Run with --apply to write changes');
  }
} else {
  console.log(`Processing ${archetype}...\n`);
  const result = processArchetype(archetype);
  console.log(`\nDone: ${result.fixed} fixed, ${result.skipped} skipped (of ${result.total})`);
  if (!applyChanges && result.fixed > 0) {
    console.log('Run with --apply to write changes');
  }
}
