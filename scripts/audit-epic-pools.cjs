/**
 * Audit Epic/Patron Pool Powers
 *
 * Compares processed epic pool data (epic-pools-raw.ts) against
 * raw Homecoming JSON data for accuracy.
 *
 * Usage:
 *   node scripts/audit-epic-pools.cjs                    # All pools
 *   node scripts/audit-epic-pools.cjs --pool blaster_dark_mastery
 *   node scripts/audit-epic-pools.cjs --archetype blaster
 *   node scripts/audit-epic-pools.cjs --verbose          # Show PASS results
 *   node scripts/audit-epic-pools.cjs --json             # JSON output
 */

const fs = require('fs');
const path = require('path');
const {
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  extractEffects,
  extractDamage,
  collectAllTemplates,
  RAW_DATA_PATH,
} = require('./convert-powerset.cjs');

const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const jsonOutput = args.includes('--json');
const poolIdx = args.indexOf('--pool');
const poolFilter = poolIdx >= 0 ? args[poolIdx + 1] : null;
const archIdx = args.indexOf('--archetype');
const archFilter = archIdx >= 0 ? args[archIdx + 1] : null;

// ============================================
// LOAD PROCESSED EPIC POOL DATA
// ============================================

function loadProcessedPools() {
  const filePath = path.resolve('./src/data/epic-pools-raw.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export\s+const\s+EPIC_POOLS_RAW\s*=\s*(\{[\s\S]*\})\s*(?:as\s+const)?\s*;?\s*$/);
  if (!match) {
    console.error('Could not parse epic-pools-raw.ts');
    process.exit(1);
  }

  try {
    return new Function('return ' + match[1])();
  } catch (e) {
    console.error('Failed to parse EPIC_POOLS_RAW:', e.message);
    process.exit(1);
  }
}

// ============================================
// MAP EPIC POWER TO RAW JSON
// ============================================

/**
 * Derive raw JSON path from fullName
 * "Epic.Blaster_Dark_Mastery.Murky_Cloud" → "epic/blaster_dark_mastery/murky_cloud.json"
 */
function getRawJsonPath(fullName) {
  const parts = fullName.split('.');
  if (parts.length !== 3 || parts[0] !== 'Epic') return null;

  const poolDir = parts[1].toLowerCase();
  const powerFile = parts[2].toLowerCase() + '.json';
  return path.join(RAW_POWERS_PATH, 'epic', poolDir, powerFile);
}

// ============================================
// COMPARISON LOGIC
// ============================================

function compareSets(rawSet, processedSet, label) {
  const rawSorted = [...rawSet].sort();
  const processedSorted = [...processedSet].sort();

  if (rawSorted.join(',') === processedSorted.join(',')) {
    return { status: 'PASS', dimension: label };
  }

  const missing = rawSorted.filter(x => !processedSet.includes(x));
  const extra = processedSorted.filter(x => !rawSet.includes(x));

  const isCritical = missing.length > 0;
  const messages = [];
  if (missing.length) messages.push(`Missing: ${missing.join(', ')}`);
  if (extra.length) messages.push(`Extra: ${extra.join(', ')}`);

  return {
    status: isCritical ? 'CRITICAL' : 'WARNING',
    dimension: label,
    messages,
  };
}

function compareStats(rawJson, processedEffects) {
  const results = [];
  const statMapping = {
    accuracy: { raw: 'accuracy' },
    range: { raw: 'range' },
    recharge: { raw: 'recharge_time' },
    endurance: { raw: 'endurance_cost' },
    activationTime: { raw: 'activation_time' },
  };

  for (const [tsKey, { raw: rawKey }] of Object.entries(statMapping)) {
    const rawVal = rawJson[rawKey];
    const tsVal = processedEffects[tsKey];

    if (rawVal === undefined || rawVal === null || rawVal === 0) continue;
    if (tsVal === undefined || tsVal === null) {
      results.push({
        status: 'WARNING',
        dimension: 'Stats',
        messages: [`Stat "${tsKey}" missing in processed (raw: ${rawVal})`],
      });
      continue;
    }

    if (Math.abs(rawVal - tsVal) > 0.01) {
      results.push({
        status: 'WARNING',
        dimension: 'Stats',
        messages: [`Stat "${tsKey}" mismatch: expected ${rawVal}, got ${tsVal}`],
      });
    }
  }

  return results;
}

function compareEffects(rawJson, processedEffects) {
  const results = [];

  if (!rawJson.effects || rawJson.effects.length === 0) return results;

  const allTemplates = collectAllTemplates(rawJson.effects);
  const rawDamage = extractDamage(allTemplates);
  const rawEffects = extractEffects(allTemplates);

  // Check damage
  const tsDamage = processedEffects.damage;
  if (rawDamage && !tsDamage) {
    results.push({
      status: 'CRITICAL',
      dimension: 'Effects',
      messages: [`Missing damage: ${JSON.stringify(rawDamage)}`],
    });
  }

  // Check effects
  const META_KEYS = new Set(['effectDuration', 'buffDuration']);
  const SKIP_KEYS = new Set(['taunt', 'placate', 'threatBuff', 'threatDebuff']);
  const STAT_KEYS = new Set(['accuracy', 'range', 'recharge', 'endurance', 'activationTime', 'effectArea', 'damage', 'maxTargets', 'arc', 'radius', 'castTime']);

  for (const [key, value] of Object.entries(rawEffects)) {
    if (META_KEYS.has(key) || SKIP_KEYS.has(key)) continue;

    if (processedEffects[key] === undefined) {
      const scale = typeof value === 'object' && value !== null ? value.scale : value;
      if (typeof scale === 'number' && Math.abs(scale) < 0.1) continue;

      results.push({
        status: 'CRITICAL',
        dimension: 'Effects',
        messages: [`Missing effect "${key}": ${JSON.stringify(value)}`],
      });
    }
  }

  // Check for extra effects
  for (const key of Object.keys(processedEffects)) {
    if (STAT_KEYS.has(key)) continue;
    if (META_KEYS.has(key) || SKIP_KEYS.has(key)) continue;
    if (rawEffects[key] === undefined && key !== 'protection') {
      results.push({
        status: 'WARNING',
        dimension: 'Effects',
        messages: [`Extra effect in processed not found in raw: ${key}`],
      });
    }
  }

  return results;
}

// ============================================
// MAIN AUDIT
// ============================================

function auditPower(poolId, power, rawJson) {
  const results = [];
  const processedEffects = power.effects || {};

  // 1. allowedEnhancements
  const rawEnhancements = (rawJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b])
    .filter(Boolean);
  const uniqueRawEnhancements = [...new Set(rawEnhancements)];
  results.push(compareSets(uniqueRawEnhancements, power.allowedEnhancements || [], 'Enhancements'));

  // 2. allowedSetCategories
  const rawCats = (rawJson.allowed_boostset_cats || [])
    .map(c => SET_CATEGORY_MAP[c] || c);
  results.push(compareSets(rawCats, power.allowedSetCategories || [], 'Set Categories'));

  // 3. maxSlots
  const rawMaxSlots = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null
    ? rawJson.max_boosts : 6;
  if (rawMaxSlots !== power.maxSlots) {
    results.push({
      status: rawMaxSlots === 0 || power.maxSlots === 0 ? 'WARNING' : 'CRITICAL',
      dimension: 'Max Slots',
      messages: [`Expected ${rawMaxSlots}, got ${power.maxSlots}`],
    });
  } else {
    results.push({ status: 'PASS', dimension: 'Max Slots' });
  }

  // 4. Stats
  results.push(...compareStats(rawJson, processedEffects));

  // 5. Effects
  results.push(...compareEffects(rawJson, processedEffects));

  return results;
}

function main() {
  const poolsData = loadProcessedPools();
  const allResults = {};
  let totalPowers = 0;
  let totalMatched = 0;
  let totalUnmatched = 0;
  let totalCritical = 0;
  let totalWarning = 0;
  let totalPass = 0;

  let poolIds = Object.keys(poolsData);
  if (poolFilter) {
    poolIds = [poolFilter];
  } else if (archFilter) {
    poolIds = poolIds.filter(id => poolsData[id].archetype === archFilter);
  }

  for (const poolId of poolIds) {
    const pool = poolsData[poolId];
    if (!pool) {
      console.error(`Pool not found: ${poolId}`);
      continue;
    }

    const poolResults = [];

    for (const power of pool.powers) {
      totalPowers++;
      const rawJsonPath = getRawJsonPath(power.fullName);

      if (!rawJsonPath || !fs.existsSync(rawJsonPath)) {
        totalUnmatched++;
        poolResults.push({
          name: power.name,
          fullName: power.fullName,
          status: 'UNMATCHED',
          reason: rawJsonPath ? 'Raw JSON not found: ' + rawJsonPath : 'Could not derive path from fullName',
        });
        continue;
      }

      totalMatched++;
      let rawJson;
      try {
        rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
      } catch (e) {
        poolResults.push({
          name: power.name,
          fullName: power.fullName,
          status: 'ERROR',
          reason: 'Failed to parse: ' + e.message,
        });
        continue;
      }

      const auditResults = auditPower(poolId, power, rawJson);
      const hasCritical = auditResults.some(r => r.status === 'CRITICAL');
      const hasWarning = auditResults.some(r => r.status === 'WARNING');

      if (hasCritical) totalCritical++;
      else if (hasWarning) totalWarning++;
      else totalPass++;

      poolResults.push({
        name: power.name,
        fullName: power.fullName,
        status: hasCritical ? 'CRITICAL' : hasWarning ? 'WARNING' : 'PASS',
        issues: auditResults.filter(r => r.status !== 'PASS'),
        passes: auditResults.filter(r => r.status === 'PASS'),
      });
    }

    allResults[poolId] = poolResults;
  }

  // Output
  if (jsonOutput) {
    const outputDir = path.resolve('./scripts/audit-results');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'epic-pools.json');
    fs.writeFileSync(outputPath, JSON.stringify(allResults, null, 2));
    console.log(`JSON written to ${outputPath}`);
    return;
  }

  // Console output
  for (const [poolId, results] of Object.entries(allResults)) {
    const criticals = results.filter(r => r.status === 'CRITICAL');
    const warnings = results.filter(r => r.status === 'WARNING');
    const passes = results.filter(r => r.status === 'PASS');
    const unmatched = results.filter(r => r.status === 'UNMATCHED');

    if (criticals.length > 0) {
      console.log(`\n--- CRITICAL (${poolId}) ---\n`);
      for (const r of criticals) {
        console.log(`[${poolId}/${r.name}] (${r.fullName})`);
        for (const issue of r.issues) {
          console.log(`  ${issue.status}: ${issue.messages.join('; ')}`);
        }
      }
    }

    if (warnings.length > 0) {
      console.log(`\n--- WARNING (${poolId}) ---\n`);
      for (const r of warnings) {
        console.log(`[${poolId}/${r.name}] (${r.fullName})`);
        for (const issue of r.issues) {
          console.log(`  ${issue.status}: ${issue.messages.join('; ')}`);
        }
      }
    }

    if (verbose && passes.length > 0) {
      console.log(`\n--- PASS (${poolId}) ---\n`);
      for (const r of passes) {
        console.log(`  PASS: ${r.name}`);
      }
    }

    if (unmatched.length > 0) {
      console.log(`\n--- UNMATCHED (${poolId}) ---\n`);
      for (const r of unmatched) {
        console.log(`  ${r.name}: ${r.reason}`);
      }
    }

    const summary = `${poolId}: ${results.length} powers | ${criticals.length} CRITICAL | ${warnings.length} WARNING | ${passes.length} PASS`;
    if (unmatched.length) {
      console.log(`${summary} | ${unmatched.length} UNMATCHED`);
    } else {
      console.log(summary);
    }
  }

  console.log(`\n--- OVERALL SUMMARY ---`);
  console.log(`Scanned: ${totalPowers} | Matched: ${totalMatched} | Unmatched: ${totalUnmatched}`);
  console.log(`CRITICAL: ${totalCritical} | WARNING: ${totalWarning} | PASS: ${totalPass}`);
}

main();
