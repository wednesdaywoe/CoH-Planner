/**
 * Add per-effect durations to processed power files
 *
 * Reads raw JSON data, extracts per-template durations, maps them to effect keys,
 * and adds a `durations` map + `buffDuration` to the processed .ts files.
 *
 * Usage: node scripts/fix-add-durations.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../raw_data_homecoming-20251209_7415/powers');
const POWERSETS_PATH = path.join(__dirname, '../src/data/powersets');
const dryRun = process.argv.includes('--dry-run');

// Import mappings from the conversion script
const {
  DAMAGE_TYPES, DEFENSE_POSITIONS, ELUSIVITY_TYPES, MEZ_TYPES,
  KNOCKBACK_TYPES, MOVEMENT_TYPES, RESOURCE_TYPES, COMBAT_MODIFIERS,
  STEALTH_TYPES, CONTROL_TYPES, SPECIAL_ATTRIBS,
  collectAllTemplates,
} = require('./convert-powerset.cjs');

function isDamageTypeAttrib(attrib) {
  return !!DAMAGE_TYPES[attrib];
}

function isDefensePosition(attrib) {
  return !!DEFENSE_POSITIONS[attrib];
}

/**
 * Extract durations map and buffDuration from raw power data templates.
 * Mirrors the logic in extractEffects but only captures duration info.
 */
function extractDurations(rawData) {
  const templates = collectAllTemplates(rawData.effects || []);
  const durations = {};

  for (const template of templates) {
    if (!template.attribs || template.attribs.length === 0) continue;

    const aspect = template.aspect?.toLowerCase();
    const scale = template.scale || 0;
    const table = template.table;
    const magnitude = template.magnitude || 1;
    const isDebuff = scale < 0 || table?.toLowerCase().includes('debuff');

    // Parse duration
    let duration = null;
    if (template.duration && template.duration !== '0 seconds') {
      const match = template.duration.match(/([\d.]+)\s*seconds?/i);
      if (match) duration = parseFloat(match[1]);
    }
    if (!duration || duration <= 0) continue;

    const recordDuration = (key) => {
      durations[key] = duration;
    };

    for (const rawAttrib of template.attribs) {
      const attrib = rawAttrib?.toLowerCase();
      if (!attrib) continue;
      if (SPECIAL_ATTRIBS.has(attrib)) continue;

      // Entity creation — skip (handled by summon.duration)
      if (attrib === 'create_entity') continue;

      // Damage types
      if (isDamageTypeAttrib(attrib)) {
        const tableLower = table?.toLowerCase() || '';
        const isDefenseEffect = tableLower.includes('buff_def') || tableLower.includes('debuff_def');
        if (aspect === 'strength') {
          recordDuration(isDebuff ? 'damageDebuff' : 'damageBuff');
        } else if (aspect === 'resistance') {
          recordDuration(isDebuff ? 'resistanceDebuff' : 'resistance');
        } else if (isDefenseEffect) {
          recordDuration(isDebuff ? 'defenseDebuff' : 'defenseBuff');
        }
        continue;
      }

      // Defense positions
      if (isDefensePosition(attrib)) {
        if (aspect === 'resistance') {
          recordDuration(isDebuff ? 'resistanceDebuff' : 'resistance');
        } else {
          recordDuration(isDebuff ? 'defenseDebuff' : 'defenseBuff');
        }
        continue;
      }

      // Base defense
      if (attrib === 'base_defense' || attrib === 'defense') {
        if (aspect === 'resistance') recordDuration('elusivity');
        else recordDuration(isDebuff ? 'defenseDebuff' : 'defenseBuff');
        continue;
      }

      // Elusivity
      if (ELUSIVITY_TYPES[attrib]) { recordDuration('elusivity'); continue; }

      // Mez
      if (MEZ_TYPES[attrib]) { recordDuration(MEZ_TYPES[attrib]); continue; }

      // Knockback
      if (KNOCKBACK_TYPES[attrib]) {
        recordDuration(aspect === 'resistance' ? 'protection' : KNOCKBACK_TYPES[attrib]);
        continue;
      }

      // Movement
      if (MOVEMENT_TYPES[attrib]) {
        recordDuration((isDebuff || scale < 0) ? 'slow' : 'movement');
        continue;
      }

      // Resources
      if (RESOURCE_TYPES[attrib]) {
        const resType = RESOURCE_TYPES[attrib];
        if (resType === 'hitPoints') recordDuration(aspect === 'maximum' ? 'maxHPBuff' : 'healing');
        else if (resType === 'endurance') {
          if (aspect === 'maximum') recordDuration('maxEndBuff');
          else recordDuration((isDebuff || scale < 0) ? 'enduranceDrain' : 'enduranceGain');
        }
        else if (resType === 'recovery') recordDuration((isDebuff || scale < 0) ? 'recoveryDebuff' : 'recoveryBuff');
        else if (resType === 'regeneration') recordDuration((isDebuff || scale < 0) ? 'regenDebuff' : 'regenBuff');
        else if (resType === 'absorb') recordDuration('absorb');
        continue;
      }

      // Combat modifiers
      if (COMBAT_MODIFIERS[attrib]) {
        const modType = COMBAT_MODIFIERS[attrib];
        if (modType === 'toHit') recordDuration(isDebuff ? 'tohitDebuff' : 'tohitBuff');
        else if (modType === 'rechargeTime') {
          if (aspect === 'resistance') recordDuration('debuffResistance');
          else if (isDebuff || scale < 0) recordDuration('rechargeDebuff');
          else recordDuration('rechargeBuff');
        }
        else if (modType === 'threatLevel') recordDuration((isDebuff || scale < 0) ? 'threatDebuff' : 'threatBuff');
        else if (modType === 'range') recordDuration('rangeBuff');
        else if (modType === 'enduranceDiscount') recordDuration('enduranceDiscount');
        continue;
      }

      // Stealth/Perception
      if (STEALTH_TYPES[attrib]) {
        const stealthType = STEALTH_TYPES[attrib];
        if (stealthType === 'perception') recordDuration((isDebuff || scale < 0) ? 'perceptionDebuff' : 'perceptionBuff');
        else recordDuration('stealth');
        continue;
      }

      // Control
      if (CONTROL_TYPES[attrib]) { recordDuration(CONTROL_TYPES[attrib]); continue; }
    }
  }

  if (Object.keys(durations).length === 0) return null;

  // Derive buffDuration — most common duration value
  const durationCounts = {};
  for (const dur of Object.values(durations)) {
    durationCounts[dur] = (durationCounts[dur] || 0) + 1;
  }
  let bestDur = null;
  let bestCount = 0;
  for (const [dur, count] of Object.entries(durationCounts)) {
    const d = parseFloat(dur);
    if (count > bestCount || (count === bestCount && d > (bestDur || 0))) {
      bestDur = d;
      bestCount = count;
    }
  }

  return { durations, buffDuration: bestDur };
}

// Extract Source comment from processed file
function extractSourcePath(content) {
  const match = content.match(/\* Source: (.+\.json)/);
  return match ? match[1] : null;
}

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

let fixed = 0;
let skipped = 0;
let errors = 0;

const allFiles = findTsFiles(POWERSETS_PATH);

for (const filePath of allFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Skip index files and files without effects
  if (!content.includes('"effects"')) continue;

  const sourcePath = extractSourcePath(content);
  if (!sourcePath) continue;

  const rawJsonPath = path.join(RAW_DATA_PATH, '..', 'powers', sourcePath);
  if (!fs.existsSync(rawJsonPath)) continue;

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
  } catch {
    errors++;
    continue;
  }

  // Skip Auto and Toggle powers — their tick durations aren't meaningful as "buff duration"
  const powerType = rawData.type;
  const isAutoOrToggle = powerType === 'Auto' || powerType === 'Toggle';

  const result = extractDurations(rawData);
  if (!result) { skipped++; continue; }

  const { durations, buffDuration } = result;

  let newContent = content;

  // Remove existing buffDuration if present (we'll re-add from fresh data)
  newContent = newContent.replace(/,?\s*"buffDuration":\s*[\d.]+/, '');
  // Remove existing durations if present
  newContent = newContent.replace(/,?\s*"durations":\s*\{[^}]*\}/, '');
  // Clean up double commas or leading commas in effects
  newContent = newContent.replace(/"effects":\s*\{\s*,/, '"effects": {');

  // Add durations and buffDuration to the effects object
  // Find the closing of the effects block and insert before it
  const effectsCloseRegex = /(\n\s*)\}(\s*\n\s*\};\s*$)/;
  const match = newContent.match(effectsCloseRegex);
  if (!match) { skipped++; continue; }

  // Build the durations JSON
  const indent = match[1].replace('\n', '') + '  '; // one level deeper
  const innerIndent = indent + '  ';

  let additions = '';

  // Add buffDuration for Click powers only (not Auto/Toggle)
  if (buffDuration && !isAutoOrToggle) {
    additions += `,\n${indent}"buffDuration": ${buffDuration}`;
  }

  // Add durations map
  const durEntries = Object.entries(durations)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${innerIndent}"${k}": ${v}`)
    .join(',\n');
  additions += `,\n${indent}"durations": {\n${durEntries}\n${indent}}`;

  newContent = newContent.replace(effectsCloseRegex, `${additions}${match[1]}}${match[2]}`);

  if (newContent !== content) {
    const relPath = path.relative(POWERSETS_PATH, filePath);
    const durKeys = Object.keys(durations).join(', ');
    console.log(`  ${relPath}: buffDur=${isAutoOrToggle ? 'skip(auto/toggle)' : buffDuration}s, durations=[${durKeys}]`);
    if (!dryRun) fs.writeFileSync(filePath, newContent, 'utf-8');
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Done: ${fixed} fixed, ${skipped} skipped, ${errors} errors`);
