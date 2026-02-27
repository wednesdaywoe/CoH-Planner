/**
 * Fix Mechanic Types in processed power files
 *
 * Reads raw JSON data to detect mechanic power types and patches the
 * mechanicType field (and maxSlots where needed) into existing TS files.
 *
 * Usage: node scripts/fix-mechanic-types.cjs --archetype blaster [--dry-run]
 *        node scripts/fix-mechanic-types.cjs --all [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const { RAW_DATA_PATH } = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const allArchetypes = args.includes('--all');
const archetypeIdx = args.indexOf('--archetype');
const archetype = archetypeIdx >= 0 ? args[archetypeIdx + 1] : null;

if (!archetype && !allArchetypes) {
  console.error('Usage: node scripts/fix-mechanic-types.cjs --archetype <name> [--dry-run]');
  console.error('       node scripts/fix-mechanic-types.cjs --all [--dry-run]');
  process.exit(1);
}

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

/**
 * Detect mechanic type from raw JSON data
 */
function detectMechanicType(rawJson, availableLevel) {
  const showInManage = rawJson.show_in_manage !== false;
  const maxBoosts = rawJson.max_boosts || 0;
  const autoIssue = rawJson.auto_issue === true;
  const showInInventory = rawJson.show_in_inventory || 'Show';
  const showInInfo = rawJson.show_in_info !== false;

  if (!showInManage && maxBoosts === 0) {
    if (autoIssue && availableLevel === -1) {
      return 'childToggle';
    } else if (showInInventory === 'Never' && !showInInfo) {
      return 'hiddenAuto';
    } else {
      return 'hiddenPassive';
    }
  } else if (maxBoosts === 0 && availableLevel >= 0 && (!showInManage || rawJson.type === 'Auto')) {
    return 'parentMechanic';
  }

  return null;
}

/**
 * Get available_level for a power from its powerset index
 */
function getAvailableLevel(rawJson) {
  // The available_level is stored in the powerset index, not in the power JSON.
  // However, we can infer it from the power's `available_level` field if present,
  // or from the processed TS file's `available` field.
  // For detection purposes, we use -1 detection from auto_issue + requires combination
  // which is sufficient for the mechanic type detection.

  // If auto_issue=true and has a requires field referencing a parent power, it's available=-1
  if (rawJson.auto_issue === true && rawJson.requires) {
    return -1;
  }

  // For other detection, we'll read the TS file's available field
  return null; // Will be read from TS
}

function fixFile(tsFilePath) {
  const tsContent = fs.readFileSync(tsFilePath, 'utf-8');
  const sourcePath = extractSourceComment(tsContent);
  if (!sourcePath) return { skipped: true, reason: 'no source comment' };

  const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);
  if (!fs.existsSync(rawJsonPath)) return { skipped: true, reason: 'raw JSON not found' };

  const rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));

  // Get available level from TS file
  const availMatch = tsContent.match(/"available"\s*:\s*(-?\d+)/);
  const availableLevel = availMatch ? parseInt(availMatch[1], 10) : 0;

  const mechanicType = detectMechanicType(rawJson, availableLevel);
  if (!mechanicType) return { skipped: true, reason: 'not a mechanic power' };

  // Check if already has mechanicType
  if (tsContent.includes('"mechanicType"')) {
    return { skipped: true, reason: 'already has mechanicType' };
  }

  let updatedContent = tsContent;
  const changes = [];

  // Fix maxSlots if it's wrong (e.g., 6 when raw says 0)
  const rawMaxBoosts = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null ? rawJson.max_boosts : 6;
  const slotsMatch = tsContent.match(/"maxSlots"\s*:\s*(\d+)/);
  const currentMaxSlots = slotsMatch ? parseInt(slotsMatch[1], 10) : null;

  if (currentMaxSlots !== null && currentMaxSlots !== rawMaxBoosts) {
    updatedContent = updatedContent.replace(
      /"maxSlots"\s*:\s*\d+/,
      `"maxSlots": ${rawMaxBoosts}`
    );
    changes.push(`maxSlots: ${currentMaxSlots} → ${rawMaxBoosts}`);
  }

  // Add mechanicType after the maxSlots line
  const maxSlotsLineRegex = /("maxSlots"\s*:\s*\d+)/;
  const maxSlotsMatch = updatedContent.match(maxSlotsLineRegex);
  if (maxSlotsMatch) {
    updatedContent = updatedContent.replace(
      maxSlotsLineRegex,
      `$1,\n  "mechanicType": "${mechanicType}"`
    );
    changes.push(`mechanicType: "${mechanicType}"`);
  }

  if (changes.length === 0) {
    return { skipped: true, reason: 'no changes needed' };
  }

  if (!dryRun) {
    fs.writeFileSync(tsFilePath, updatedContent);
  }

  return {
    fixed: true,
    mechanicType,
    changes,
    rawFields: {
      auto_issue: rawJson.auto_issue,
      show_in_manage: rawJson.show_in_manage,
      max_boosts: rawJson.max_boosts,
      show_in_inventory: rawJson.show_in_inventory,
      show_in_info: rawJson.show_in_info,
      available_level: availableLevel,
    },
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
      console.log(`  Type: ${result.mechanicType}`);
      for (const change of result.changes) {
        console.log(`  ${change}`);
      }
    } else if (result.skipped && result.reason !== 'not a mechanic power' && result.reason !== 'no source comment') {
      console.log(`SKIP: ${rel} — ${result.reason}`);
    }
  }

  return { fixed: fixedCount, skipped: tsFiles.length - fixedCount, total: tsFiles.length };
}

// Main
if (allArchetypes) {
  const dirs = fs.readdirSync(POWERSETS_PATH, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  let totalFixed = 0;
  let totalTotal = 0;

  for (const at of dirs) {
    console.log(`\n=== ${at} ===`);
    const result = processArchetype(at);
    totalFixed += result.fixed;
    totalTotal += result.total;
    console.log(`  ${result.fixed} mechanic powers found (of ${result.total})`);
  }

  console.log(`\n=== TOTAL: ${totalFixed} mechanic powers patched across ${totalTotal} powers ===`);
} else {
  console.log(`Processing ${archetype}...${dryRun ? ' (DRY RUN)' : ''}\n`);
  const result = processArchetype(archetype);
  console.log(`\nDone: ${result.fixed} mechanic powers ${dryRun ? 'found' : 'patched'} (of ${result.total})`);
}
