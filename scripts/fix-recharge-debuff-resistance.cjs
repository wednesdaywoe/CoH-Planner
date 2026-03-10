/**
 * Fix rechargeBuff → debuffResistance.recharge
 *
 * Many powers have RechargeTime with aspect "Resistance" in raw data,
 * meaning they provide recharge debuff resistance (slow resistance),
 * NOT a global recharge buff. The conversion script incorrectly mapped
 * these to rechargeBuff. This script:
 *
 * 1. Reads each raw power JSON referenced in processed .ts files
 * 2. Checks if RechargeTime templates have aspect "Resistance" vs "Strength"
 * 3. Fixes processed files:
 *    - If ONLY Resistance aspect: replace rechargeBuff with debuffResistance.recharge
 *    - If BOTH Strength + Resistance: keep rechargeBuff at Strength scale,
 *      add debuffResistance.recharge at Resistance scale
 *
 * Usage: node scripts/fix-recharge-debuff-resistance.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../raw_data_homecoming-20251209_7415/powers');
const POWERSETS_PATH = path.join(__dirname, '../src/data/powersets');
const dryRun = process.argv.includes('--dry-run');

// Collect all templates from effects + child_effects recursively
function collectAllTemplates(effects) {
  const templates = [];
  for (const eff of effects) {
    if (eff.templates) templates.push(...eff.templates);
    if (eff.child_effects) {
      for (const ce of eff.child_effects) {
        if (ce.templates) templates.push(...ce.templates);
      }
    }
  }
  return templates;
}

// Find RechargeTime templates and categorize by aspect
function analyzeRechargeTemplates(rawData) {
  const templates = collectAllTemplates(rawData.effects || []);
  const result = { strength: null, resistance: null };

  for (const t of templates) {
    if (!t.attribs || !t.attribs.includes('RechargeTime')) continue;
    const aspect = (t.aspect || '').toLowerCase();
    const scale = t.scale || 0;
    const table = t.table || '';

    if (aspect === 'strength') {
      result.strength = { scale, table };
    } else if (aspect === 'resistance') {
      result.resistance = { scale, table };
    }
  }

  return result;
}

// Extract Source comment from processed file to find raw JSON path
function extractSourcePath(content) {
  const match = content.match(/\* Source: (.+\.json)/);
  return match ? match[1] : null;
}

// Category map (same as convert-powerset.cjs)
const CATEGORY_MAP = {
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
  'sentinel_ranged': { archetype: 'sentinel', type: 'primary' },
  'sentinel_defense': { archetype: 'sentinel', type: 'secondary' },
  'peacebringer_defensive': { archetype: 'peacebringer', type: 'secondary' },
  'warshade_defensive': { archetype: 'warshade', type: 'secondary' },
};

let fixed = 0;
let skipped = 0;
let errors = 0;

// Recursively find all .ts files
function findTsFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(findTsFiles(full));
    else if (entry.name.endsWith('.ts')) results.push(full);
  }
  return results;
}

const allFiles = findTsFiles(POWERSETS_PATH);

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Skip files without rechargeBuff
  if (!content.includes('"rechargeBuff"')) continue;

  // Extract source path
  const sourcePath = extractSourcePath(content);
  if (!sourcePath) {
    // No source comment — skip
    continue;
  }

  // Load raw data
  const rawJsonPath = path.join(RAW_DATA_PATH, '..', 'powers', sourcePath);
  if (!fs.existsSync(rawJsonPath)) {
    console.warn(`  WARN: Raw file not found: ${sourcePath}`);
    errors++;
    continue;
  }

  const rawData = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
  const analysis = analyzeRechargeTemplates(rawData);

  if (!analysis.resistance && !analysis.strength) {
    // No RechargeTime templates at all — strange, skip
    console.warn(`  WARN: No RechargeTime templates found for ${sourcePath}`);
    skipped++;
    continue;
  }

  if (!analysis.resistance) {
    // Only Strength — rechargeBuff is correct, no fix needed
    skipped++;
    continue;
  }

  const relPath = path.relative(POWERSETS_PATH, filePath);

  if (analysis.strength && analysis.resistance) {
    // BOTH: rechargeBuff should use Strength scale, add debuffResistance.recharge with Resistance scale
    // Check if current rechargeBuff scale matches the resistance value (wrong) vs strength (correct)
    const currentScaleMatch = content.match(/"rechargeBuff":\s*\{\s*"scale":\s*([\d.]+)/);
    const currentScale = currentScaleMatch ? parseFloat(currentScaleMatch[1]) : null;

    if (currentScale === null) {
      skipped++;
      continue;
    }

    // Build the correct rechargeBuff (Strength scale)
    const correctBuff = `"rechargeBuff": {\n      "scale": ${analysis.strength.scale},\n      "table": "${analysis.strength.table}"\n    }`;
    // Build debuffResistance.recharge
    const debuffResEntry = `"debuffResistance": {\n      "recharge": {\n        "scale": ${analysis.resistance.scale},\n        "table": "${analysis.resistance.table}"\n      }\n    }`;

    // Replace rechargeBuff with correct scale and add debuffResistance
    let newContent = content;

    // Replace the rechargeBuff block
    const rechargeBufRegex = /"rechargeBuff":\s*\{[^}]+\}/;
    newContent = newContent.replace(rechargeBufRegex, correctBuff);

    // Add debuffResistance if not already present
    if (!newContent.includes('"debuffResistance"')) {
      // Add before the closing of effects object — find the rechargeBuff we just wrote and add after it
      newContent = newContent.replace(
        correctBuff,
        correctBuff + ',\n    ' + debuffResEntry
      );
    }

    if (newContent !== content) {
      console.log(`  FIX (both): ${relPath} — rechargeBuff ${currentScale}→${analysis.strength.scale}, +debuffResistance.recharge: ${analysis.resistance.scale}`);
      if (!dryRun) fs.writeFileSync(filePath, newContent, 'utf-8');
      fixed++;
    } else {
      skipped++;
    }
  } else {
    // ONLY Resistance — replace rechargeBuff with debuffResistance.recharge entirely
    const debuffResEntry = `"debuffResistance": {\n      "recharge": {\n        "scale": ${analysis.resistance.scale},\n        "table": "${analysis.resistance.table}"\n      }\n    }`;

    let newContent = content;

    // Check if debuffResistance already exists
    if (newContent.includes('"debuffResistance"')) {
      // Add recharge to existing debuffResistance
      const existingDebuffRes = newContent.match(/"debuffResistance":\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      if (existingDebuffRes) {
        const oldBlock = existingDebuffRes[0];
        // Add recharge entry before the closing brace
        const newBlock = oldBlock.replace(/\n(\s*)\}$/, `,\n$1  "recharge": {\n$1    "scale": ${analysis.resistance.scale},\n$1    "table": "${analysis.resistance.table}"\n$1  }\n$1}`);
        newContent = newContent.replace(oldBlock, newBlock);
      }
      // Remove rechargeBuff line (and trailing comma/leading comma)
      newContent = newContent.replace(/,?\s*"rechargeBuff":\s*\{[^}]+\}/, '');
      // Clean up leading comma if rechargeBuff was first
      newContent = newContent.replace(/\{\s*,/, '{');
    } else {
      // Replace rechargeBuff with debuffResistance
      const rechargeBufRegex = /"rechargeBuff":\s*\{[^}]+\}/;
      newContent = newContent.replace(rechargeBufRegex, debuffResEntry);
    }

    if (newContent !== content) {
      console.log(`  FIX (resistance only): ${relPath} — rechargeBuff→debuffResistance.recharge: ${analysis.resistance.scale}`);
      if (!dryRun) fs.writeFileSync(filePath, newContent, 'utf-8');
      fixed++;
    } else {
      skipped++;
    }
  }
}

console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Done: ${fixed} fixed, ${skipped} skipped, ${errors} errors`);
