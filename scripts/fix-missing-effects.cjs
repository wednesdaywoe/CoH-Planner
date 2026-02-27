/**
 * Fix Missing Effects Script
 *
 * Reads the audit results and patches TypeScript power files with missing effects
 * extracted from raw JSON data (including child_effects).
 *
 * Usage:
 *   node scripts/fix-missing-effects.cjs                 # Dry run (preview changes)
 *   node scripts/fix-missing-effects.cjs --apply         # Apply changes
 *   node scripts/fix-missing-effects.cjs --apply --powerset brute/secondary/regeneration
 */

const fs = require('fs');
const path = require('path');
const {
  extractEffects,
  extractDamage,
  collectAllTemplates,
  RAW_DATA_PATH,
} = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const applyChanges = args.includes('--apply');
const powersetFilterIdx = args.indexOf('--powerset');
const powersetFilter = powersetFilterIdx >= 0 ? args[powersetFilterIdx + 1] : null;

// ============================================
// FILE HELPERS
// ============================================

function extractSourceComment(tsContent) {
  const match = tsContent.match(/\*\s*Source:\s*(.+\.json)\s*$/m);
  return match ? match[1].trim() : null;
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

// ============================================
// TS FILE PARSING & PATCHING
// ============================================

/**
 * Extract the effects JSON object from a TS file as a string
 * Returns { start, end, obj } or null
 */
function findEffectsBlock(tsContent) {
  // Match "effects": { at the power object level (not nested)
  // We need to find the effects key that's a direct property of the Power object
  const regex = /"effects"\s*:\s*\{/g;
  let match;
  while ((match = regex.exec(tsContent)) !== null) {
    const braceStart = tsContent.indexOf('{', match.index + '"effects"'.length);
    const extracted = extractBracedBlock(tsContent, braceStart);
    if (extracted) {
      try {
        const obj = JSON.parse(extracted.text);
        return { start: match.index, end: extracted.end, obj, key: '"effects"' };
      } catch { /* try next match */ }
    }
  }
  return null;
}

/**
 * Find the damage block in a TS file
 */
function findDamageBlock(tsContent) {
  const regex = /"damage"\s*:\s*[\[{]/g;
  let match;
  while ((match = regex.exec(tsContent)) !== null) {
    const startChar = tsContent[match.index + match[0].length - 1];
    let extracted;
    if (startChar === '{') {
      extracted = extractBracedBlock(tsContent, match.index + match[0].length - 1);
    } else {
      extracted = extractBracketedBlock(tsContent, match.index + match[0].length - 1);
    }
    if (extracted) {
      try {
        const obj = JSON.parse(extracted.text);
        return { start: match.index, end: extracted.end, obj };
      } catch { /* try next match */ }
    }
  }
  return null;
}

function extractBracedBlock(str, startPos) {
  if (str[startPos] !== '{') return null;
  let depth = 0;
  for (let i = startPos; i < str.length; i++) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) return { text: str.substring(startPos, i + 1), end: i + 1 };
    }
  }
  return null;
}

function extractBracketedBlock(str, startPos) {
  if (str[startPos] !== '[') return null;
  let depth = 0;
  for (let i = startPos; i < str.length; i++) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') {
      depth--;
      if (depth === 0) return { text: str.substring(startPos, i + 1), end: i + 1 };
    }
  }
  return null;
}

/**
 * Determine the indentation used in the effects block
 */
function detectIndent(tsContent) {
  // Look for the pattern of indentation in the file
  const match = tsContent.match(/\n(\s+)"name"/);
  return match ? match[1] : '  ';
}

/**
 * Serialize an effects object with proper indentation
 */
function serializeEffects(effects, baseIndent) {
  const json = JSON.stringify(effects, null, 2);
  // Indent every line by baseIndent (except first line which gets placed after "effects": )
  const lines = json.split('\n');
  return lines.map((line, i) => i === 0 ? line : baseIndent + line).join('\n');
}

/**
 * Serialize a damage value (object or array)
 */
function serializeDamage(damage, baseIndent) {
  const json = JSON.stringify(damage, null, 2);
  const lines = json.split('\n');
  return lines.map((line, i) => i === 0 ? line : baseIndent + line).join('\n');
}

// ============================================
// META KEYS / FILTERING
// ============================================

const META_KEYS = new Set(['effectDuration', 'buffDuration']);
const LOW_PRIORITY_EFFECTS = new Set([
  'taunt', 'placate', 'threatBuff', 'threatDebuff',
  'untouchable', 'onlyAffectsSelf', 'teleport',
  'translucency',
]);

function isSignificantEffect(value, threshold = 0.1) {
  if (typeof value === 'object' && value !== null) {
    if (value.scale !== undefined) return Math.abs(value.scale) >= threshold;
    return Object.values(value).some(v => isSignificantEffect(v, threshold));
  }
  if (typeof value === 'number') return Math.abs(value) >= threshold;
  return true;
}

// ============================================
// MAIN FIX LOGIC
// ============================================

function patchPowerFile(tsFilePath) {
  const tsContent = fs.readFileSync(tsFilePath, 'utf-8');
  const sourcePath = extractSourceComment(tsContent);
  if (!sourcePath) return null;

  const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);
  if (!fs.existsSync(rawJsonPath)) return null;

  let rawJson;
  try {
    rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
  } catch {
    return null;
  }

  if (!rawJson.effects || rawJson.effects.length === 0) return null;

  // Extract all templates including child_effects
  const allTemplates = collectAllTemplates(rawJson.effects);
  const rawEffects = extractEffects(allTemplates);
  const rawDamage = extractDamage(allTemplates);

  // Parse existing TS effects and damage
  const existingEffectsBlock = findEffectsBlock(tsContent);
  const existingDamageBlock = findDamageBlock(tsContent);
  const existingEffects = existingEffectsBlock ? existingEffectsBlock.obj : {};
  const existingDamage = existingDamageBlock ? existingDamageBlock.obj : null;

  // Determine what's missing
  const missingEffects = {};
  let missingDamage = null;
  const changes = [];

  // Check for missing effects
  for (const [key, value] of Object.entries(rawEffects)) {
    if (META_KEYS.has(key)) continue;
    if (LOW_PRIORITY_EFFECTS.has(key)) continue;
    if (!isSignificantEffect(value)) continue;
    if (existingEffects[key] !== undefined) continue;

    missingEffects[key] = value;
    changes.push(`  + ${key}: ${JSON.stringify(value)}`);
  }

  // Check for effectDuration if we're adding mez effects
  const mezKeys = ['hold', 'stun', 'sleep', 'immobilize', 'confuse', 'fear'];
  const addingMez = mezKeys.some(k => missingEffects[k]);
  if (addingMez && rawEffects.effectDuration && !existingEffects.effectDuration) {
    missingEffects.effectDuration = rawEffects.effectDuration;
    changes.push(`  + effectDuration: ${rawEffects.effectDuration}`);
  }

  // Check for missing damage
  if (rawDamage && !existingDamage) {
    missingDamage = rawDamage;
    changes.push(`  + damage: ${JSON.stringify(rawDamage)}`);
  }

  if (changes.length === 0) return null;

  // Build the patched content
  let patched = tsContent;
  const indent = detectIndent(tsContent);

  // Patch effects
  if (Object.keys(missingEffects).length > 0) {
    if (existingEffectsBlock) {
      // Merge into existing effects block
      const merged = { ...existingEffects, ...missingEffects };
      const serialized = serializeEffects(merged, indent);
      // Replace the entire "effects": {...} block
      const beforeKey = patched.substring(0, existingEffectsBlock.start);
      const afterBlock = patched.substring(existingEffectsBlock.end);
      patched = beforeKey + `"effects": ${serialized}` + afterBlock;
    } else {
      // No existing effects block — add one before the closing };
      const serialized = serializeEffects(missingEffects, indent);
      // Find the last property before the closing }; of the Power object
      // Insert before the final closing
      const closingMatch = patched.lastIndexOf('};');
      if (closingMatch >= 0) {
        // Check if we need a comma after the last property
        const beforeClosing = patched.substring(0, closingMatch).trimEnd();
        const needsComma = !beforeClosing.endsWith(',');
        const comma = needsComma ? ',' : '';
        patched = beforeClosing + comma + '\n' + indent + `"effects": ${serialized}` + '\n' + patched.substring(closingMatch);
      }
    }
  }

  // Patch damage
  if (missingDamage) {
    const serialized = serializeDamage(missingDamage, indent);
    // Insert damage before effects or before closing
    const effectsPos = patched.indexOf('"effects"');
    if (effectsPos >= 0) {
      // Insert before effects
      const beforeEffects = patched.substring(0, effectsPos).trimEnd();
      const needsComma = !beforeEffects.endsWith(',');
      const comma = needsComma ? ',' : '';
      patched = beforeEffects + comma + '\n' + indent + `"damage": ${serialized},\n` + indent + patched.substring(effectsPos);
    } else {
      // Insert before closing };
      const closingMatch = patched.lastIndexOf('};');
      if (closingMatch >= 0) {
        const beforeClosing = patched.substring(0, closingMatch).trimEnd();
        const needsComma = !beforeClosing.endsWith(',');
        const comma = needsComma ? ',' : '';
        patched = beforeClosing + comma + '\n' + indent + `"damage": ${serialized}` + '\n' + patched.substring(closingMatch);
      }
    }
  }

  return { changes, patched, relativePath: path.relative(POWERSETS_PATH, tsFilePath).replace(/\\/g, '/') };
}

function main() {
  console.log(`=== FIX MISSING EFFECTS ${applyChanges ? '(APPLYING)' : '(DRY RUN)'} ===\n`);

  let searchPath = POWERSETS_PATH;
  if (powersetFilter) {
    searchPath = path.join(POWERSETS_PATH, powersetFilter);
  }

  const tsFiles = findPowerFiles(searchPath);
  console.log(`Scanning ${tsFiles.length} power files...\n`);

  let fixedCount = 0;
  let totalChanges = 0;
  const fixedFiles = [];

  for (const tsFile of tsFiles) {
    const result = patchPowerFile(tsFile);
    if (!result) continue;

    fixedCount++;
    totalChanges += result.changes.length;
    fixedFiles.push(result.relativePath);

    console.log(`[${result.relativePath}]`);
    for (const change of result.changes) {
      console.log(change);
    }
    console.log('');

    if (applyChanges) {
      fs.writeFileSync(tsFile, result.patched, 'utf-8');
    }
  }

  console.log(`--- SUMMARY ---`);
  console.log(`Files ${applyChanges ? 'fixed' : 'to fix'}: ${fixedCount}`);
  console.log(`Total effects added: ${totalChanges}`);

  if (!applyChanges && fixedCount > 0) {
    console.log(`\nRun with --apply to write changes:`);
    console.log(`  node scripts/fix-missing-effects.cjs --apply`);
  }
}

main();
