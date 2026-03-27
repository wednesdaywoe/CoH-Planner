#!/usr/bin/env node
/**
 * fix-brute-feb2026.cjs
 *
 * Applies the Homecoming Issue 28, Page 3, Panel 2 (Feb 10, 2026) Brute changes.
 * Our raw data dump (Dec 9, 2025) predates this patch.
 *
 * Patch notes (https://forums.homecomingservers.com/topic/62994):
 *   - Resist and Defense modifiers increased from 75% to 85%
 *   - PvP base resistances lowered from 10% to 0%
 *   - Max HP increased from 1499.2554 to 1601.719
 *   - (Also applies: ranged damage modifier unified to 0.75, from Issue 26 Page 4)
 *
 * This script patches:
 *   1. src/data/at-tables.ts — Brute resistance and defense AT table values
 *   2. src/data/archetypes.ts — Brute baseHP and damageModifier.ranged
 *
 * Usage: node scripts/fix-brute-feb2026.cjs
 */

const fs = require('fs');
const path = require('path');

const AT_TABLES_PATH = path.join(__dirname, '..', 'src', 'data', 'at-tables.ts');
const ARCHETYPES_PATH = path.join(__dirname, '..', 'src', 'data', 'archetypes.ts');

const SCALE_FACTOR = 85 / 75; // Resist/Defense modifier increase

// ============================================
// PATCH AT TABLES
// ============================================

function patchATTables() {
  console.log('Patching at-tables.ts...');
  let content = fs.readFileSync(AT_TABLES_PATH, 'utf8');
  let changes = 0;

  // Find the brute section and patch flat-constant resistance/defense tables.
  // The tables are stored as arrays of 105 values (levels 1-54 with half-levels).
  // Flat tables have the same value repeated 105 times.
  //
  // Tables to scale (flat constants, all 105 values identical):
  //   melee_res_dmg:       0.075 → 0.085
  //   ranged_res_dmg:      0.065 → 0.073667
  //   melee_buff_def:      0.075 → 0.085
  //   ranged_buff_def:     0.075 → 0.085
  //   melee_debuff_def:   -0.075 → -0.085
  //   melee_debuff_res_dmg: 0.075 → 0.085
  //   ranged_debuff_res_dmg: 0.065 → 0.073667
  //   ranged_debuff_def:  -0.07 → -0.079333

  // The AT tables file has a structure like:
  //   'brute': { primaryCategory: '...', secondaryCategory: '...', tables: { ... } }
  // We need to find the brute section and replace specific table values.

  // Strategy: find each flat table array for brute and replace the constant value.
  // The arrays look like: melee_res_dmg: [0.075, 0.075, 0.075, ...]

  const replacements = [
    { table: 'melee_res_dmg',       oldVal: 0.075,  newVal: 0.085 },
    { table: 'ranged_res_dmg',      oldVal: 0.065,  newVal: round(0.065 * SCALE_FACTOR) },
    { table: 'melee_buff_def',      oldVal: 0.075,  newVal: 0.085 },
    { table: 'ranged_buff_def',     oldVal: 0.075,  newVal: 0.085 },
    { table: 'melee_debuff_def',    oldVal: -0.075, newVal: -0.085 },
    { table: 'ranged_debuff_def',   oldVal: -0.07,  newVal: round(-0.07 * SCALE_FACTOR) },
    { table: 'melee_debuff_res_dmg', oldVal: 0.075, newVal: 0.085 },
    { table: 'ranged_debuff_res_dmg', oldVal: 0.065, newVal: round(0.065 * SCALE_FACTOR) },
  ];

  // Find the brute section boundaries
  const bruteStart = content.indexOf("'brute': {");
  if (bruteStart === -1) {
    console.error('  ERROR: Could not find brute section in at-tables.ts');
    return false;
  }

  // Find the next AT section (or end of file) to scope our replacements
  const nextATMatch = content.slice(bruteStart + 10).match(/^\s{2}\w+: \{/m);
  const bruteEnd = nextATMatch
    ? bruteStart + 10 + nextATMatch.index
    : content.length;

  let bruteSection = content.slice(bruteStart, bruteEnd);
  const originalBruteSection = bruteSection;

  for (const { table, oldVal, newVal } of replacements) {
    // Build a regex that matches the table name followed by an array of the old value
    // e.g., melee_res_dmg: [0.075, 0.075, 0.075, ...]
    const oldStr = oldVal.toString();
    const newStr = newVal.toString();

    // Find the table definition line (keys are quoted: 'melee_res_dmg': [...])
    const tableIdx = bruteSection.indexOf(`'${table}': [`);
    if (tableIdx === -1) {
      console.warn(`  WARN: Table ${table} not found in brute section`);
      continue;
    }

    // Find the closing bracket
    const arrayStart = bruteSection.indexOf('[', tableIdx);
    const arrayEnd = bruteSection.indexOf(']', arrayStart);
    if (arrayStart === -1 || arrayEnd === -1) continue;

    const oldArray = bruteSection.slice(arrayStart, arrayEnd + 1);
    const newArray = oldArray.replace(new RegExp(escapeRegex(oldStr), 'g'), newStr);

    if (oldArray !== newArray) {
      bruteSection = bruteSection.slice(0, arrayStart) + newArray + bruteSection.slice(arrayEnd + 1);
      changes++;
      console.log(`  ${table}: ${oldVal} → ${newVal}`);
    } else {
      console.warn(`  SKIP: ${table} — value ${oldVal} not found (may already be patched)`);
    }
  }

  if (changes > 0) {
    content = content.slice(0, bruteStart) + bruteSection + content.slice(bruteEnd);
    fs.writeFileSync(AT_TABLES_PATH, content, 'utf8');
    console.log(`  Patched ${changes} tables in at-tables.ts`);
  } else {
    console.log('  No changes needed in at-tables.ts');
  }

  return changes > 0;
}

// ============================================
// PATCH ARCHETYPES
// ============================================

function patchArchetypes() {
  console.log('\nPatching archetypes.ts...');
  let content = fs.readFileSync(ARCHETYPES_PATH, 'utf8');
  let changes = 0;

  // Fix baseHP: 1499.2554 → 1601.719
  if (content.includes('baseHP: 1499.2554')) {
    content = content.replace('baseHP: 1499.2554', 'baseHP: 1601.719');
    changes++;
    console.log('  baseHP: 1499.2554 → 1601.719');
  } else if (content.includes('baseHP: 1601.719')) {
    console.log('  SKIP: baseHP already patched');
  } else {
    console.warn('  WARN: Could not find baseHP for brute');
  }

  // Fix damageModifier.ranged: 0.5 → 0.75 (Issue 26 Page 4 unification)
  // Need to be careful to only replace in the brute section
  const bruteIdx = content.indexOf("'brute': {");
  if (bruteIdx !== -1) {
    const nextSection = content.indexOf("\n  }", bruteIdx);
    const bruteBlock = content.slice(bruteIdx, nextSection);

    if (bruteBlock.includes('ranged: 0.5')) {
      content = content.slice(0, bruteIdx) +
        bruteBlock.replace('ranged: 0.5', 'ranged: 0.75') +
        content.slice(nextSection);
      changes++;
      console.log('  damageModifier.ranged: 0.5 → 0.75');
    } else if (bruteBlock.includes('ranged: 0.75')) {
      console.log('  SKIP: damageModifier.ranged already patched');
    }
  }

  if (changes > 0) {
    fs.writeFileSync(ARCHETYPES_PATH, content, 'utf8');
    console.log(`  Patched ${changes} values in archetypes.ts`);
  } else {
    console.log('  No changes needed in archetypes.ts');
  }

  return changes > 0;
}

// ============================================
// UTILITIES
// ============================================

function round(n, decimals = 6) {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// MAIN
// ============================================

console.log('Applying Homecoming Issue 28 Page 3 Panel 2 (Feb 10, 2026) Brute changes');
console.log('Source: https://forums.homecomingservers.com/topic/62994\n');

const a = patchATTables();
const b = patchArchetypes();

if (a || b) {
  console.log('\nDone. Run `npx tsc --noEmit` to verify.');
} else {
  console.log('\nNo changes applied — values may already be patched.');
}
