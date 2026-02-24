/**
 * Powerset Effects Audit Script
 *
 * Compares raw JSON power data against TypeScript power definitions to find
 * missing or incorrect effects. Reports discrepancies by severity level.
 *
 * Usage: node scripts/audit-powerset-effects.cjs [--json] [--verbose] [--powerset <path>]
 *
 * Options:
 *   --json       Output machine-readable JSON to scripts/audit-results.json
 *   --verbose    Show PASS results and extra detail
 *   --powerset   Only audit a specific powerset (e.g., brute/secondary/regeneration)
 */

const fs = require('fs');
const path = require('path');
const {
  extractEffects,
  extractDamage,
  RAW_DATA_PATH,
} = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const outputJson = args.includes('--json');
const verbose = args.includes('--verbose');
const powersetFilterIdx = args.indexOf('--powerset');
const powersetFilter = powersetFilterIdx >= 0 ? args[powersetFilterIdx + 1] : null;

// ============================================
// PHASE 1: DATA LOADING
// ============================================

/**
 * Recursively find all .ts files under a directory (excluding index.ts)
 */
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

/**
 * Extract Source comment from a TypeScript power file
 * Returns the source path (e.g., "brute_defense/regeneration/ailment_resistance.json")
 */
function extractSourceComment(tsContent) {
  const match = tsContent.match(/\*\s*Source:\s*(.+\.json)\s*$/m);
  return match ? match[1].trim() : null;
}

/**
 * Get relative powerset path from absolute TS file path
 * e.g., "brute/secondary/regeneration/ailment-resistance.ts"
 */
function getRelativePath(tsFilePath) {
  return path.relative(POWERSETS_PATH, tsFilePath).replace(/\\/g, '/');
}

// ============================================
// PHASE 2: RAW JSON EFFECT EXTRACTION
// ============================================

/**
 * Recursively collect all templates from effects, including child_effects
 * Only collects PvE templates (filters out PVP_ONLY)
 */
function collectAllTemplates(effects) {
  const templates = [];

  for (const effect of effects) {
    // Skip PvP-only effects
    if (effect.is_pvp === 'PVP_ONLY') continue;

    // Collect templates from this effect
    if (effect.templates && effect.templates.length > 0) {
      templates.push(...effect.templates);
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAllTemplates(effect.child_effects));
    }
  }

  return templates;
}

/**
 * Extract expected effects from raw JSON file
 * Returns { damage, effects } or null if file not found
 */
function extractRawEffects(rawJsonPath) {
  if (!fs.existsSync(rawJsonPath)) return null;

  try {
    const rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));
    if (!rawJson.effects || rawJson.effects.length === 0) {
      return { damage: undefined, effects: {}, powerType: rawJson.type, isRedirect: false };
    }

    // Collect all templates including from child_effects
    const allTemplates = collectAllTemplates(rawJson.effects);

    // Check for redirect powers (create_entity with pseudopet redirects)
    const hasRedirect = allTemplates.some(t =>
      t.attribs?.some(a => a.toLowerCase() === 'create_entity') &&
      t.params?.redirects?.length > 0
    );

    const damage = extractDamage(allTemplates);
    const effects = extractEffects(allTemplates);

    return {
      damage,
      effects,
      powerType: rawJson.type,
      isRedirect: hasRedirect,
      templateCount: allTemplates.length,
    };
  } catch (err) {
    return null;
  }
}

// ============================================
// PHASE 3: TYPESCRIPT EFFECT PARSING
// ============================================

/**
 * Extract effects object from TypeScript file content
 * Uses brace-matching to find the effects block
 */
function extractTsEffects(tsContent) {
  const result = { damage: undefined, effects: {}, hasEffectsBlock: false };

  // Extract damage block
  const damageMatch = tsContent.match(/"damage"\s*:\s*\{/);
  if (damageMatch) {
    const damageObj = extractBracedObject(tsContent, damageMatch.index + damageMatch[0].length - 1);
    if (damageObj) {
      try {
        result.damage = JSON.parse(damageObj);
      } catch { /* ignore parse errors */ }
    }
  }

  // Also check for damage as array
  const damageArrayMatch = tsContent.match(/"damage"\s*:\s*\[/);
  if (damageArrayMatch && !result.damage) {
    const damageArr = extractBracketedArray(tsContent, damageArrayMatch.index + damageArrayMatch[0].length - 1);
    if (damageArr) {
      try {
        result.damage = JSON.parse(damageArr);
      } catch { /* ignore parse errors */ }
    }
  }

  // Extract effects block
  // Need to match "effects": { but NOT "child_effects" or other *effects keys
  const effectsMatch = tsContent.match(/"effects"\s*:\s*\{/);
  if (effectsMatch) {
    result.hasEffectsBlock = true;
    const effectsObj = extractBracedObject(tsContent, effectsMatch.index + effectsMatch[0].length - 1);
    if (effectsObj) {
      try {
        result.effects = JSON.parse(effectsObj);
      } catch { /* ignore parse errors */ }
    }
  }

  return result;
}

/**
 * Extract a braced object starting at the opening brace position
 */
function extractBracedObject(str, startPos) {
  if (str[startPos] !== '{') return null;

  let depth = 0;
  let i = startPos;
  while (i < str.length) {
    if (str[i] === '{') depth++;
    else if (str[i] === '}') {
      depth--;
      if (depth === 0) return str.substring(startPos, i + 1);
    }
    i++;
  }
  return null;
}

/**
 * Extract a bracketed array starting at the opening bracket position
 */
function extractBracketedArray(str, startPos) {
  if (str[startPos] !== '[') return null;

  let depth = 0;
  let i = startPos;
  while (i < str.length) {
    if (str[i] === '[') depth++;
    else if (str[i] === ']') {
      depth--;
      if (depth === 0) return str.substring(startPos, i + 1);
    }
    i++;
  }
  return null;
}

// ============================================
// PHASE 4: COMPARISON & REPORTING
// ============================================

// Effect keys that are metadata, not actual effects
const META_KEYS = new Set(['effectDuration', 'buffDuration']);

// Effects that are typically low-priority (cosmetic, threat, etc.)
const LOW_PRIORITY_EFFECTS = new Set([
  'taunt', 'placate', 'threatBuff', 'threatDebuff',
  'untouchable', 'onlyAffectsSelf', 'teleport',
  'translucency',
]);

/**
 * Get the top-level effect keys from an effects object, excluding metadata
 */
function getEffectKeys(effects) {
  if (!effects || typeof effects !== 'object') return new Set();
  return new Set(
    Object.keys(effects).filter(k => !META_KEYS.has(k))
  );
}

/**
 * Check if an effect value has a "significant" scale (>= threshold)
 */
function isSignificantEffect(value, threshold = 0.1) {
  if (typeof value === 'object' && value !== null) {
    if (value.scale !== undefined) return Math.abs(value.scale) >= threshold;
    // Nested object (e.g., defenseBuff.smashing)
    return Object.values(value).some(v => isSignificantEffect(v, threshold));
  }
  if (typeof value === 'number') return Math.abs(value) >= threshold;
  return true; // non-numeric = probably significant
}

/**
 * Compare raw effects against TS effects for a single power
 * Returns array of findings: { severity, effectKey, message }
 */
function comparePowerEffects(rawData, tsData, relativePath) {
  const findings = [];

  if (!rawData) {
    findings.push({ severity: 'INFO', effectKey: '-', message: 'No raw JSON found (unmatched)' });
    return findings;
  }

  // If it's a redirect power, don't flag missing effects (they're in the redirected power)
  if (rawData.isRedirect) {
    const rawEffectKeys = getEffectKeys(rawData.effects);
    // Only flag if there are non-summon effects missing
    const nonSummonKeys = new Set([...rawEffectKeys].filter(k => k !== 'summon'));
    if (nonSummonKeys.size === 0) {
      findings.push({ severity: 'INFO', effectKey: 'summon', message: 'Redirect power — effects live in summoned entity' });
      return findings;
    }
  }

  const rawEffectKeys = getEffectKeys(rawData.effects);
  const tsEffectKeys = getEffectKeys(tsData.effects);

  // Check for effects in raw but missing in TS
  for (const key of rawEffectKeys) {
    if (!tsEffectKeys.has(key)) {
      const rawValue = rawData.effects[key];
      const significant = isSignificantEffect(rawValue);

      if (LOW_PRIORITY_EFFECTS.has(key)) {
        findings.push({
          severity: 'INFO',
          effectKey: key,
          message: `Low-priority effect missing: ${formatEffectSummary(key, rawValue)}`,
        });
      } else if (significant) {
        findings.push({
          severity: 'CRITICAL',
          effectKey: key,
          message: `Missing effect: ${formatEffectSummary(key, rawValue)}`,
        });
      } else {
        findings.push({
          severity: 'INFO',
          effectKey: key,
          message: `Minor effect missing (scale < 0.1): ${formatEffectSummary(key, rawValue)}`,
        });
      }
    }
  }

  // Check for damage in raw but missing in TS
  if (rawData.damage && !tsData.damage) {
    findings.push({
      severity: 'CRITICAL',
      effectKey: 'damage',
      message: `Missing damage: ${formatDamageSummary(rawData.damage)}`,
    });
  }

  // Check for effects in TS but not in raw (possible stale data)
  for (const key of tsEffectKeys) {
    if (!rawEffectKeys.has(key) && key !== 'summon') {
      findings.push({
        severity: 'WARNING',
        effectKey: key,
        message: `Extra effect in TS not found in raw: ${key}`,
      });
    }
  }

  return findings;
}

/**
 * Format an effect value for display
 */
function formatEffectSummary(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.scale !== undefined && value.table !== undefined) {
      return `${key} (scale: ${value.scale}, table: ${value.table})`;
    }
    // Nested object - show keys
    const subKeys = Object.keys(value);
    if (subKeys.length <= 4) {
      const parts = subKeys.map(k => {
        const v = value[k];
        if (typeof v === 'object' && v?.scale !== undefined) return `${k}: scale ${v.scale}`;
        return `${k}: ${v}`;
      });
      return `${key} { ${parts.join(', ')} }`;
    }
    return `${key} { ${subKeys.length} subtypes: ${subKeys.slice(0, 3).join(', ')}... }`;
  }
  return `${key}: ${value}`;
}

/**
 * Format damage info for display
 */
function formatDamageSummary(damage) {
  if (Array.isArray(damage)) {
    return damage.map(d => `${d.type} (scale: ${d.scale})`).join(' + ');
  }
  return `${damage.type} (scale: ${damage.scale}, table: ${damage.table})`;
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  console.log('=== POWERSET EFFECTS AUDIT ===\n');

  // Find all power TS files
  let searchPath = POWERSETS_PATH;
  if (powersetFilter) {
    searchPath = path.join(POWERSETS_PATH, powersetFilter);
    if (!fs.existsSync(searchPath)) {
      console.error(`Powerset path not found: ${searchPath}`);
      process.exit(1);
    }
  }

  const tsFiles = findPowerFiles(searchPath);
  console.log(`Found ${tsFiles.length} power files to audit\n`);

  const results = {
    summary: { total: 0, matched: 0, unmatched: 0, critical: 0, warning: 0, info: 0, pass: 0 },
    powers: [],
    byPowerset: {},
  };

  for (const tsFile of tsFiles) {
    const relativePath = getRelativePath(tsFile);
    const tsContent = fs.readFileSync(tsFile, 'utf-8');

    // Extract source path
    const sourcePath = extractSourceComment(tsContent);
    results.summary.total++;

    if (!sourcePath) {
      results.summary.unmatched++;
      if (verbose) {
        console.log(`[SKIP] ${relativePath} — no Source comment`);
      }
      continue;
    }

    // Resolve raw JSON path
    const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);

    // Extract effects from both sources
    const rawData = extractRawEffects(rawJsonPath);
    const tsData = extractTsEffects(tsContent);

    if (!rawData) {
      results.summary.unmatched++;
      if (verbose) {
        console.log(`[SKIP] ${relativePath} — raw JSON not found: ${sourcePath}`);
      }
      continue;
    }

    results.summary.matched++;

    // Compare
    const findings = comparePowerEffects(rawData, tsData, relativePath);

    // Determine highest severity
    let maxSeverity = 'PASS';
    if (findings.some(f => f.severity === 'CRITICAL')) maxSeverity = 'CRITICAL';
    else if (findings.some(f => f.severity === 'WARNING')) maxSeverity = 'WARNING';
    else if (findings.some(f => f.severity === 'INFO')) maxSeverity = 'INFO';

    // Track counts
    if (maxSeverity === 'CRITICAL') results.summary.critical++;
    else if (maxSeverity === 'WARNING') results.summary.warning++;
    else if (maxSeverity === 'INFO') results.summary.info++;
    else results.summary.pass++;

    // Track by powerset
    const powersetPath = relativePath.split('/').slice(0, -1).join('/');
    if (!results.byPowerset[powersetPath]) {
      results.byPowerset[powersetPath] = { critical: 0, warning: 0, info: 0, pass: 0, powers: [] };
    }
    const psEntry = results.byPowerset[powersetPath];
    if (maxSeverity === 'CRITICAL') psEntry.critical++;
    else if (maxSeverity === 'WARNING') psEntry.warning++;
    else if (maxSeverity === 'INFO') psEntry.info++;
    else psEntry.pass++;

    // Store result
    const powerResult = {
      path: relativePath,
      source: sourcePath,
      severity: maxSeverity,
      findings,
      isRedirect: rawData.isRedirect,
    };

    results.powers.push(powerResult);
    psEntry.powers.push(powerResult);
  }

  // ============================================
  // OUTPUT
  // ============================================

  // Print CRITICAL findings
  const criticalPowers = results.powers.filter(p => p.severity === 'CRITICAL');
  if (criticalPowers.length > 0) {
    console.log(`\n--- CRITICAL (${criticalPowers.length} powers) ---\n`);
    for (const power of criticalPowers) {
      console.log(`[${power.path}]`);
      console.log(`  Source: ${power.source}`);
      for (const f of power.findings.filter(f => f.severity === 'CRITICAL')) {
        console.log(`  MISSING: ${f.message}`);
      }
      for (const f of power.findings.filter(f => f.severity === 'WARNING')) {
        console.log(`  WARNING: ${f.message}`);
      }
      console.log('');
    }
  }

  // Print WARNING findings
  const warningPowers = results.powers.filter(p => p.severity === 'WARNING');
  if (warningPowers.length > 0) {
    console.log(`\n--- WARNING (${warningPowers.length} powers) ---\n`);
    for (const power of warningPowers) {
      console.log(`[${power.path}]`);
      console.log(`  Source: ${power.source}`);
      for (const f of power.findings.filter(f => f.severity === 'WARNING')) {
        console.log(`  ${f.message}`);
      }
      console.log('');
    }
  }

  // Print INFO findings (only in verbose mode)
  if (verbose) {
    const infoPowers = results.powers.filter(p => p.severity === 'INFO');
    if (infoPowers.length > 0) {
      console.log(`\n--- INFO (${infoPowers.length} powers) ---\n`);
      for (const power of infoPowers) {
        console.log(`[${power.path}]`);
        for (const f of power.findings.filter(f => f.severity === 'INFO')) {
          console.log(`  ${f.message}`);
        }
        console.log('');
      }
    }
  }

  // Print summary by powerset (only ones with issues)
  const problemPowersets = Object.entries(results.byPowerset)
    .filter(([, v]) => v.critical > 0 || v.warning > 0)
    .sort((a, b) => (b[1].critical - a[1].critical) || (b[1].warning - a[1].warning));

  if (problemPowersets.length > 0) {
    console.log('\n--- SUMMARY BY POWERSET ---\n');
    for (const [psPath, counts] of problemPowersets) {
      const parts = [];
      if (counts.critical > 0) parts.push(`${counts.critical} CRITICAL`);
      if (counts.warning > 0) parts.push(`${counts.warning} WARNING`);
      console.log(`${psPath}: ${parts.join(', ')}`);
    }
  }

  // Print overall summary
  console.log('\n--- OVERALL SUMMARY ---');
  console.log(`Scanned: ${results.summary.total} | Matched: ${results.summary.matched} | Unmatched: ${results.summary.unmatched}`);
  console.log(`CRITICAL: ${results.summary.critical} | WARNING: ${results.summary.warning} | INFO: ${results.summary.info} | PASS: ${results.summary.pass}`);

  // Write JSON output
  if (outputJson) {
    const outputPath = path.resolve('./scripts/audit-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\nJSON results written to: ${outputPath}`);
  }
}

main();
