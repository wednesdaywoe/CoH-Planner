/**
 * Fix allowedEnhancements in processed power files
 *
 * Reads raw JSON boosts_allowed, applies BOOST_TYPE_MAP (with newly added entries),
 * and patches the allowedEnhancements array in existing TS files.
 *
 * Usage: node scripts/fix-allowed-enhancements.cjs --archetype blaster [--dry-run]
 *        node scripts/fix-allowed-enhancements.cjs --all [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const {
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  RAW_DATA_PATH,
} = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const allArchetypes = args.includes('--all');
const archetypeIdx = args.indexOf('--archetype');
const archetype = archetypeIdx >= 0 ? args[archetypeIdx + 1] : null;

if (!archetype && !allArchetypes) {
  console.error('Usage: node scripts/fix-allowed-enhancements.cjs --archetype <name> [--dry-run]');
  console.error('       node scripts/fix-allowed-enhancements.cjs --all [--dry-run]');
  process.exit(1);
}

// SET_CATEGORY_TO_ENHANCEMENT for fallback inference (copy from convert-powerset)
const SET_CATEGORY_TO_ENHANCEMENT = {
  'Ranged Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee Damage': ['Damage', 'Accuracy'],
  'Ranged AoE Damage': ['Damage', 'Accuracy', 'Range'],
  'Melee AoE Damage': ['Damage', 'Accuracy'],
  'Universal Damage Sets': ['Damage', 'Accuracy'],
  'Sniper Attacks': ['Damage', 'Accuracy', 'Range'],
  'Pet Damage': ['Damage', 'Accuracy', 'Recharge'],
  'PBAoE Damage': ['Damage', 'Accuracy'],
  'Targeted AoE Damage': ['Damage', 'Accuracy', 'Range'],
  'Resist Damage': ['Resistance'],
  'Defense Sets': ['Defense'],
  'Holds': ['Hold'],
  'Hold': ['Hold'],
  'Stuns': ['Stun'],
  'Immobilize': ['Immobilize'],
  'Sleep': ['Sleep'],
  'Confuse': ['Confuse'],
  'Fear': ['Fear'],
  'Knockback': ['Knockback'],
  'Healing': ['Healing'],
  'Endurance Modification': ['EnduranceModification'],
  'To Hit Buff': ['ToHit'],
  'To Hit Debuff': ['ToHit Debuff'],
  'Taunt': ['Taunt'],
  'Slow Movement': ['Slow'],
  'Running': ['Run Speed'],
  'Flight': ['Fly'],
  'Jumping': ['Jump'],
  'Travel': ['Run Speed', 'Fly', 'Jump'],
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

function fixFile(tsFilePath) {
  const tsContent = fs.readFileSync(tsFilePath, 'utf-8');
  const sourcePath = extractSourceComment(tsContent);
  if (!sourcePath) return { skipped: true, reason: 'no source comment' };

  const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);
  if (!fs.existsSync(rawJsonPath)) return { skipped: true, reason: 'raw JSON not found' };

  const rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));

  // Compute expected allowedEnhancements
  let expectedEnhancements = (rawJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b])
    .filter(Boolean);

  // Deduplicate
  expectedEnhancements = [...new Set(expectedEnhancements)];

  // If empty but has set categories, infer from categories (same logic as convert-powerset)
  if (expectedEnhancements.length === 0 && rawJson.allowed_boostset_cats?.length > 0) {
    const inferredSet = new Set();
    for (const rawCat of rawJson.allowed_boostset_cats) {
      const cat = SET_CATEGORY_MAP[rawCat] || rawCat;
      const enhs = SET_CATEGORY_TO_ENHANCEMENT[cat];
      if (enhs) enhs.forEach(e => inferredSet.add(e));
    }
    expectedEnhancements = Array.from(inferredSet).sort();
  }

  // Find existing allowedEnhancements in TS
  const enhRegex = /"allowedEnhancements"\s*:\s*\[([^\]]*)\]/s;
  const match = tsContent.match(enhRegex);
  if (!match) return { skipped: true, reason: 'no allowedEnhancements found in TS' };

  // Parse current values
  const currentEnhancements = match[1]
    .split(',')
    .map(s => s.trim().replace(/^"|"$/g, ''))
    .filter(Boolean);

  // Compare sorted
  const currentSorted = [...currentEnhancements].sort().join(',');
  const expectedSorted = [...expectedEnhancements].sort().join(',');

  if (currentSorted === expectedSorted) {
    return { skipped: true, reason: 'already correct' };
  }

  // Build replacement
  const indent = '    '; // 4 spaces (standard indentation in these files)
  const newArrayContent = expectedEnhancements.map(e => `${indent}"${e}"`).join(',\n');
  const newBlock = `"allowedEnhancements": [\n${newArrayContent}\n  ]`;

  const updatedContent = tsContent.replace(enhRegex, newBlock);

  if (!dryRun) {
    fs.writeFileSync(tsFilePath, updatedContent);
  }

  return {
    fixed: true,
    before: currentEnhancements,
    after: expectedEnhancements,
    added: expectedEnhancements.filter(e => !currentEnhancements.includes(e)),
    removed: currentEnhancements.filter(e => !expectedEnhancements.includes(e)),
  };
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
      const prefix = dryRun ? '[DRY-RUN] ' : '';
      console.log(`${prefix}FIXED: ${rel}`);
      if (result.added.length) console.log(`  Added: ${result.added.join(', ')}`);
      if (result.removed.length) console.log(`  Removed: ${result.removed.join(', ')}`);
    } else {
      skippedCount++;
    }
  }

  return { fixed: fixedCount, skipped: skippedCount, total: tsFiles.length };
}

// Main
if (allArchetypes) {
  const dirs = fs.readdirSync(POWERSETS_PATH, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalFixed = 0;
  let totalSkipped = 0;

  for (const at of dirs) {
    console.log(`\n=== ${at} ===`);
    const result = processArchetype(at);
    totalFixed += result.fixed;
    totalSkipped += result.skipped;
    console.log(`  ${result.fixed} fixed, ${result.skipped} skipped (of ${result.total})`);
  }

  console.log(`\n=== TOTAL: ${totalFixed} fixed, ${totalSkipped} skipped ===`);
} else {
  console.log(`Processing ${archetype}...${dryRun ? ' (DRY RUN)' : ''}\n`);
  const result = processArchetype(archetype);
  console.log(`\nDone: ${result.fixed} fixed, ${result.skipped} skipped (of ${result.total})`);
}
