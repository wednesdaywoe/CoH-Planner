/**
 * Fix Per-Target Stacking Script
 *
 * Reads raw JSON data and patches processed TypeScript power files with
 * perTarget metadata for effects that stack per AoE target hit.
 *
 * The raw data has `stack: "Stack"` vs `stack: "Replace"` on each template.
 * This script identifies self-buff templates with stack: "Stack", computes
 * the correct scale values, and adds `perTarget` to the processed effects.
 *
 * Usage:
 *   node scripts/fix-per-target-stacking.cjs                 # Dry run (preview changes)
 *   node scripts/fix-per-target-stacking.cjs --apply         # Apply changes
 *   node scripts/fix-per-target-stacking.cjs --apply --powerset brute/secondary/bio-armor
 */

const fs = require('fs');
const path = require('path');
const {
  DAMAGE_TYPES,
  DEFENSE_POSITIONS,
  RESOURCE_TYPES,
  COMBAT_MODIFIERS,
  SPECIAL_ATTRIBS,
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
// ATTRIB → EFFECT KEY CLASSIFICATION
// ============================================

/**
 * Classify a raw template into our effect key system.
 * Returns an array of { effectKey, subKey? } or empty array if not a self-buff.
 *
 * Returns multiple entries for by-type templates (one per damage/defense type).
 * Only classifies buff-type effects that could be per-target stacking.
 */
function classifyTemplate(template) {
  if (!template.attribs || template.attribs.length === 0) return [];

  const aspect = template.aspect?.toLowerCase();
  const scale = template.scale || 0;
  const table = template.table || '';
  const tableLower = table.toLowerCase();
  const isDebuff = scale < 0 || tableLower.includes('debuff');

  // We only care about self-buffs (positive effects on caster)
  if (isDebuff) return [];

  const results = [];

  for (const rawAttrib of template.attribs) {
    const attrib = rawAttrib?.toLowerCase();
    if (!attrib) continue;
    if (SPECIAL_ATTRIBS.has(attrib)) continue;

    // Damage type attributes
    if (DAMAGE_TYPES[attrib]) {
      if (aspect === 'strength') {
        // Damage buff (all damage types in template = one damageBuff key)
        return [{ effectKey: 'damageBuff' }];
      }
      if (aspect === 'resistance') {
        const dmgType = DAMAGE_TYPES[attrib].toLowerCase();
        results.push({ effectKey: 'resistance', subKey: dmgType });
        continue;
      }
      // Defense buff by damage type (table has buff_def)
      const isDefenseEffect = tableLower.includes('buff_def');
      if (isDefenseEffect) {
        const dmgType = DAMAGE_TYPES[attrib].toLowerCase();
        results.push({ effectKey: 'defenseBuff', subKey: dmgType });
        continue;
      }
      continue;
    }

    // Defense positions
    if (DEFENSE_POSITIONS[attrib]) {
      const posType = DEFENSE_POSITIONS[attrib].toLowerCase();
      if (aspect === 'resistance') {
        results.push({ effectKey: 'resistance', subKey: posType });
      } else {
        results.push({ effectKey: 'defenseBuff', subKey: posType });
      }
      continue;
    }

    // Base defense
    if (attrib === 'base_defense' || attrib === 'defense') {
      if (aspect !== 'resistance') {
        return [{ effectKey: 'defenseBuff' }];
      }
      continue;
    }

    // Resources
    if (RESOURCE_TYPES[attrib]) {
      const resType = RESOURCE_TYPES[attrib];
      if (resType === 'hitPoints') {
        if (aspect === 'maximum') return [{ effectKey: 'maxHPBuff' }];
        else return [{ effectKey: 'healing' }];
      }
      if (resType === 'endurance') {
        if (aspect === 'maximum') return [{ effectKey: 'maxEndBuff' }];
        else return [{ effectKey: 'enduranceGain' }];
      }
      if (resType === 'recovery') return [{ effectKey: 'recoveryBuff' }];
      if (resType === 'regeneration') return [{ effectKey: 'regenBuff' }];
      if (resType === 'absorb') return [{ effectKey: 'absorb' }];
      continue;
    }

    // Combat modifiers
    if (COMBAT_MODIFIERS[attrib]) {
      const modType = COMBAT_MODIFIERS[attrib];
      if (modType === 'toHit') return [{ effectKey: 'tohitBuff' }];
      if (modType === 'rechargeTime') {
        if (!isDebuff && !(tableLower.includes('slow'))) return [{ effectKey: 'rechargeBuff' }];
      }
      if (modType === 'threatLevel') return [{ effectKey: 'threatBuff' }];
      if (modType === 'range') return [{ effectKey: 'rangeBuff' }];
      if (modType === 'enduranceDiscount') return [{ effectKey: 'enduranceDiscount' }];
      continue;
    }

    // Skip mez, knockback, movement, stealth, control — not relevant for per-target buffs
  }

  return results;
}

// ============================================
// TEMPLATE COLLECTION WITH METADATA
// ============================================

/**
 * Collect all templates from an effects array, preserving the effect group tags.
 * Returns array of { template, tags } objects.
 */
function collectTemplatesWithMeta(effects) {
  const results = [];
  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    if (effect.chance === 0 || effect.chance === 0.0) continue;

    const tags = effect.tags || [];

    if (effect.templates && effect.templates.length > 0) {
      for (const t of effect.templates) {
        results.push({ template: t, tags });
      }
    }
    if (effect.child_effects && effect.child_effects.length > 0) {
      // Recurse child_effects, passing along the parent tags
      const childResults = collectTemplatesWithMeta(effect.child_effects);
      for (const cr of childResults) {
        // Merge parent + child tags
        results.push({ template: cr.template, tags: [...tags, ...cr.tags] });
      }
    }
  }
  return results;
}

// ============================================
// FILE HELPERS (from fix-missing-effects.cjs)
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

function findEffectsBlock(tsContent) {
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

function detectIndent(tsContent) {
  const match = tsContent.match(/\n(\s+)"name"/);
  return match ? match[1] : '  ';
}

function serializeEffects(effects, baseIndent) {
  const json = JSON.stringify(effects, null, 2);
  const lines = json.split('\n');
  return lines.map((line, i) => i === 0 ? line : baseIndent + line).join('\n');
}

// ============================================
// MAIN PATCHING LOGIC
// ============================================

function analyzeRawPower(rawJson) {
  if (!rawJson.effects || rawJson.effects.length === 0) return null;

  // Only process AoE/Cone powers with maxTargets > 1 (not 255 = team-wide)
  const effectArea = rawJson.effect_area;
  const maxTargets = rawJson.max_targets_hit;
  if (effectArea !== 'AoE' && effectArea !== 'Cone') return null;
  if (!maxTargets || maxTargets <= 1 || maxTargets === 255) return null;

  const allTemplates = collectTemplatesWithMeta(rawJson.effects);

  // Filter to self-buff templates with Stack or Replace
  const selfBuffs = [];
  for (const { template, tags } of allTemplates) {
    if (template.target !== 'Self') continue;
    if (template.stack !== 'Stack' && template.stack !== 'Replace') continue;

    const isDefiance = tags.some(t =>
      typeof t === 'string' && t.toLowerCase().includes('defiance')
    );

    const classifications = classifyTemplate(template);
    if (classifications.length === 0) continue;

    for (const classification of classifications) {
      selfBuffs.push({
        ...classification,
        scale: Math.abs(template.scale || 0),
        table: template.table,
        stack: template.stack,
        isDefiance,
      });
    }
  }

  if (selfBuffs.length === 0) return null;

  // Group by effectKey + subKey
  const groups = {};
  for (const buff of selfBuffs) {
    const groupKey = buff.subKey ? `${buff.effectKey}.${buff.subKey}` : buff.effectKey;
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(buff);
  }

  // For each group, compute perTarget patches
  const patches = {};
  for (const [groupKey, entries] of Object.entries(groups)) {
    // Separate Stack vs Replace, excluding Defiance
    const stacks = entries.filter(e => e.stack === 'Stack' && !e.isDefiance);
    const replaces = entries.filter(e => e.stack === 'Replace' && !e.isDefiance);

    if (stacks.length === 0) continue; // No per-target stacking

    // Sum scales (there could be multiple Stack templates)
    const stackScale = stacks.reduce((sum, e) => sum + e.scale, 0);
    const replaceScale = replaces.reduce((sum, e) => sum + e.scale, 0);
    const table = stacks[0].table;

    // Combined scale at 1 target = Replace + Stack
    const combinedScale = replaceScale + stackScale;
    const perTarget = stackScale;

    const firstEntry = entries[0];
    if (firstEntry.subKey) {
      // By-type effect (defenseBuff.smashing, etc.)
      if (!patches[firstEntry.effectKey]) patches[firstEntry.effectKey] = {};
      patches[firstEntry.effectKey][firstEntry.subKey] = {
        scale: combinedScale,
        table,
        perTarget,
      };
    } else {
      patches[firstEntry.effectKey] = {
        scale: combinedScale,
        table,
        perTarget,
      };
    }
  }

  if (Object.keys(patches).length === 0) return null;
  return patches;
}

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

  const patches = analyzeRawPower(rawJson);
  if (!patches) return null;

  // Parse existing effects from TS file
  const effectsBlock = findEffectsBlock(tsContent);
  if (!effectsBlock) return null;

  const existingEffects = effectsBlock.obj;
  let changed = false;

  // Apply patches
  for (const [key, patchValue] of Object.entries(patches)) {
    if (typeof patchValue === 'object' && patchValue !== null && !('scale' in patchValue)) {
      // By-type patch (e.g., defenseBuff: { smashing: {...}, lethal: {...} })
      if (!existingEffects[key] || typeof existingEffects[key] !== 'object') {
        // Effect doesn't exist yet as by-type — create it
        existingEffects[key] = patchValue;
        changed = true;
      } else {
        // Merge sub-keys
        for (const [subKey, subVal] of Object.entries(patchValue)) {
          const existing = existingEffects[key][subKey];
          if (existing && typeof existing === 'object') {
            // Update scale and add perTarget
            if (Math.abs(existing.scale - subVal.scale) > 0.001 || !existing.perTarget) {
              existingEffects[key][subKey] = {
                ...existing,
                scale: subVal.scale,
                table: subVal.table || existing.table,
                perTarget: subVal.perTarget,
              };
              changed = true;
            }
          } else {
            existingEffects[key][subKey] = subVal;
            changed = true;
          }
        }
      }
    } else {
      // Simple effect patch
      const existing = existingEffects[key];
      if (existing && typeof existing === 'object' && 'scale' in existing) {
        if (Math.abs(existing.scale - patchValue.scale) > 0.001 || !existing.perTarget) {
          existingEffects[key] = {
            ...existing,
            scale: patchValue.scale,
            table: patchValue.table || existing.table,
            perTarget: patchValue.perTarget,
          };
          changed = true;
        }
      } else {
        // Effect doesn't exist or is a plain number — replace with full object
        existingEffects[key] = patchValue;
        changed = true;
      }
    }
  }

  if (!changed) return null;

  // Serialize and replace in file
  const baseIndent = detectIndent(tsContent);
  const newEffectsStr = serializeEffects(existingEffects, baseIndent + '  ');
  const prefix = tsContent.substring(0, effectsBlock.start);
  const suffix = tsContent.substring(effectsBlock.end);
  const newContent = prefix + '"effects": ' + newEffectsStr + suffix;

  return {
    filePath: tsFilePath,
    patches,
    newContent,
    existingEffects,
  };
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log(`\n=== Fix Per-Target Stacking ===`);
  console.log(`Mode: ${applyChanges ? 'APPLY' : 'DRY RUN'}`);
  if (powersetFilter) console.log(`Filter: ${powersetFilter}`);
  console.log();

  let searchDir = POWERSETS_PATH;
  if (powersetFilter) {
    searchDir = path.join(POWERSETS_PATH, powersetFilter);
    if (!fs.existsSync(searchDir)) {
      console.error(`Powerset path not found: ${searchDir}`);
      process.exit(1);
    }
  }

  const files = findPowerFiles(searchDir);
  console.log(`Scanning ${files.length} power files...\n`);

  let patchedCount = 0;
  let skippedCount = 0;

  for (const filePath of files) {
    const result = patchPowerFile(filePath);
    if (!result) {
      skippedCount++;
      continue;
    }

    const relPath = path.relative(POWERSETS_PATH, filePath);
    console.log(`PATCH: ${relPath}`);
    for (const [key, val] of Object.entries(result.patches)) {
      if (typeof val === 'object' && !('scale' in val)) {
        // By-type
        for (const [subKey, subVal] of Object.entries(val)) {
          console.log(`  ${key}.${subKey}: scale=${subVal.scale.toFixed(4)} perTarget=${subVal.perTarget.toFixed(4)} table=${subVal.table}`);
        }
      } else {
        console.log(`  ${key}: scale=${val.scale.toFixed(4)} perTarget=${val.perTarget.toFixed(4)} table=${val.table}`);
      }
    }

    if (applyChanges) {
      fs.writeFileSync(filePath, result.newContent, 'utf-8');
      console.log(`  → Applied\n`);
    } else {
      console.log();
    }

    patchedCount++;
  }

  console.log(`\n--- Summary ---`);
  console.log(`Scanned: ${files.length}`);
  console.log(`Patched: ${patchedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  if (!applyChanges && patchedCount > 0) {
    console.log(`\nRe-run with --apply to write changes.`);
  }
}

main();
