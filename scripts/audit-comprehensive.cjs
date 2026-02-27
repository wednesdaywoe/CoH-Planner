/**
 * Comprehensive Power Data Audit Script
 *
 * Compares raw JSON power data against TypeScript power definitions across 5 dimensions:
 *   1. allowedEnhancements (boosts_allowed)
 *   2. allowedSetCategories (allowed_boostset_cats)
 *   3. maxSlots (max_boosts)
 *   4. Basic Stats (accuracy, range, recharge, etc.)
 *   5. Effects (damage, buffs, debuffs — reuses convert-powerset extractors)
 *
 * Usage: node scripts/audit-comprehensive.cjs --archetype blaster [options]
 *
 * Options:
 *   --archetype <name>   Audit one archetype (required)
 *   --powerset <name>    Narrow to one powerset within the archetype
 *   --json               Output JSON to scripts/audit-results/<archetype>.json
 *   --verbose            Show PASS results and extra detail
 *   --markdown           Output markdown-formatted report to stdout
 */

const fs = require('fs');
const path = require('path');
const {
  extractEffects,
  extractDamage,
  BOOST_TYPE_MAP,
  SET_CATEGORY_MAP,
  RAW_DATA_PATH,
} = require('./convert-powerset.cjs');

const POWERSETS_PATH = path.resolve('./src/data/powersets');
const RAW_POWERS_PATH = path.join(RAW_DATA_PATH, 'powers');

// Parse CLI args
const args = process.argv.slice(2);
const outputJson = args.includes('--json');
const verbose = args.includes('--verbose');
const outputMarkdown = args.includes('--markdown');
const archetypeIdx = args.indexOf('--archetype');
const archetype = archetypeIdx >= 0 ? args[archetypeIdx + 1] : null;
const powersetFilterIdx = args.indexOf('--powerset');
const powersetFilter = powersetFilterIdx >= 0 ? args[powersetFilterIdx + 1] : null;

if (!archetype) {
  console.error('Usage: node scripts/audit-comprehensive.cjs --archetype <name> [--powerset <name>] [--json] [--verbose] [--markdown]');
  console.error('\nAvailable archetypes: blaster, brute, controller, corruptor, defender, dominator, mastermind, scrapper, sentinel, stalker, tanker, peacebringer, warshade, arachnos-soldier, arachnos-widow');
  process.exit(1);
}

// ============================================
// FILE DISCOVERY
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
 */
function extractSourceComment(tsContent) {
  const match = tsContent.match(/\*\s*Source:\s*(.+\.json)\s*$/m);
  return match ? match[1].trim() : null;
}

/**
 * Get relative powerset path from absolute TS file path
 */
function getRelativePath(tsFilePath) {
  return path.relative(POWERSETS_PATH, tsFilePath).replace(/\\/g, '/');
}

// ============================================
// TS FILE PARSING
// ============================================

/**
 * Extract a braced object starting at the opening brace
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
 * Extract a bracketed array starting at the opening bracket
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

/**
 * Parse TS power file and extract all auditable fields
 */
function parseTsPowerFile(tsContent) {
  const result = {
    allowedEnhancements: [],
    allowedSetCategories: [],
    maxSlots: null,
    stats: {},
    damage: undefined,
    effects: {},
    hasEffectsBlock: false,
    mechanicType: null,
  };

  // Extract mechanicType
  const mechMatch = tsContent.match(/"mechanicType"\s*:\s*"([^"]+)"/);
  if (mechMatch) {
    result.mechanicType = mechMatch[1];
  }

  // Extract allowedEnhancements array
  const enhMatch = tsContent.match(/"allowedEnhancements"\s*:\s*\[/);
  if (enhMatch) {
    const arr = extractBracketedArray(tsContent, enhMatch.index + enhMatch[0].length - 1);
    if (arr) {
      try { result.allowedEnhancements = JSON.parse(arr); } catch { /* ignore */ }
    }
  }

  // Extract allowedSetCategories array
  const catMatch = tsContent.match(/"allowedSetCategories"\s*:\s*\[/);
  if (catMatch) {
    const arr = extractBracketedArray(tsContent, catMatch.index + catMatch[0].length - 1);
    if (arr) {
      try { result.allowedSetCategories = JSON.parse(arr); } catch { /* ignore */ }
    }
  }

  // Extract maxSlots
  const slotsMatch = tsContent.match(/"maxSlots"\s*:\s*(\d+)/);
  if (slotsMatch) {
    result.maxSlots = parseInt(slotsMatch[1], 10);
  }

  // Extract stats object
  const statsMatch = tsContent.match(/"stats"\s*:\s*\{/);
  if (statsMatch) {
    const obj = extractBracedObject(tsContent, statsMatch.index + statsMatch[0].length - 1);
    if (obj) {
      try { result.stats = JSON.parse(obj); } catch { /* ignore */ }
    }
  }

  // Extract damage block (can be array or object)
  const damageArrayMatch = tsContent.match(/"damage"\s*:\s*\[/);
  const damageObjMatch = tsContent.match(/"damage"\s*:\s*\{/);
  if (damageArrayMatch) {
    const arr = extractBracketedArray(tsContent, damageArrayMatch.index + damageArrayMatch[0].length - 1);
    if (arr) {
      try { result.damage = JSON.parse(arr); } catch { /* ignore */ }
    }
  } else if (damageObjMatch) {
    const obj = extractBracedObject(tsContent, damageObjMatch.index + damageObjMatch[0].length - 1);
    if (obj) {
      try { result.damage = JSON.parse(obj); } catch { /* ignore */ }
    }
  }

  // Extract effects block
  // Need to match "effects": { but NOT "child_effects" or other *effects keys
  const effectsRegex = /(?<!"child_)"effects"\s*:\s*\{/;
  const effectsMatch = tsContent.match(effectsRegex);
  if (effectsMatch) {
    result.hasEffectsBlock = true;
    const obj = extractBracedObject(tsContent, effectsMatch.index + effectsMatch[0].length - 1);
    if (obj) {
      try { result.effects = JSON.parse(obj); } catch { /* ignore */ }
    }
  }

  return result;
}

// ============================================
// RAW DATA EXTRACTION
// ============================================

/**
 * Recursively collect all templates from effects, including child_effects
 * Only collects PvE templates (filters out PVP_ONLY)
 */
function collectAllTemplates(effects) {
  const templates = [];
  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    if (effect.templates && effect.templates.length > 0) {
      templates.push(...effect.templates);
    }
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAllTemplates(effect.child_effects));
    }
  }
  return templates;
}

/**
 * Extract all auditable fields from raw JSON
 */
function extractRawData(rawJsonPath) {
  if (!fs.existsSync(rawJsonPath)) return null;

  try {
    const rawJson = JSON.parse(fs.readFileSync(rawJsonPath, 'utf-8'));

    // Enhancement types
    const allowedEnhancements = (rawJson.boosts_allowed || [])
      .map(b => BOOST_TYPE_MAP[b])
      .filter(Boolean);

    // Set categories
    const allowedSetCategories = (rawJson.allowed_boostset_cats || [])
      .map(c => SET_CATEGORY_MAP[c] || c)
      .filter(Boolean);

    // Max slots
    const maxSlots = rawJson.max_boosts !== undefined && rawJson.max_boosts !== null ? rawJson.max_boosts : 6;

    // Stats
    const stats = {};
    if (rawJson.accuracy && rawJson.accuracy !== 0) stats.accuracy = rawJson.accuracy;
    if (rawJson.range && rawJson.range !== 0) stats.range = rawJson.range;
    if (rawJson.recharge_time && rawJson.recharge_time !== 0) stats.recharge = rawJson.recharge_time;
    if (rawJson.endurance_cost && rawJson.endurance_cost !== 0) stats.endurance = rawJson.endurance_cost;
    if (rawJson.activation_time && rawJson.activation_time !== 0) stats.castTime = rawJson.activation_time;
    if (rawJson.radius && rawJson.radius !== 0) stats.radius = rawJson.radius;
    if (rawJson.arc && rawJson.arc !== 0) stats.arc = rawJson.arc;
    if (rawJson.max_targets_hit && rawJson.max_targets_hit !== 0 && rawJson.max_targets_hit !== 1) {
      stats.maxTargets = rawJson.max_targets_hit;
    }

    // Effects (via convert-powerset extractors)
    let damage = undefined;
    let effects = {};
    let isRedirect = false;
    let templateCount = 0;

    if (rawJson.effects && rawJson.effects.length > 0) {
      const allTemplates = collectAllTemplates(rawJson.effects);
      templateCount = allTemplates.length;

      isRedirect = allTemplates.some(t =>
        t.attribs?.some(a => a.toLowerCase() === 'create_entity') &&
        t.params?.redirects?.length > 0
      );

      damage = extractDamage(allTemplates);
      effects = extractEffects(allTemplates);
    }

    // Detect mechanic type from raw fields
    const showInManage = rawJson.show_in_manage !== false;
    const autoIssue = rawJson.auto_issue === true;
    const showInInventory = rawJson.show_in_inventory || 'Show';
    const showInInfo = rawJson.show_in_info !== false;
    let isMechanicPower = false;

    if ((!showInManage && maxSlots === 0) ||
        (maxSlots === 0 && (!showInManage || rawJson.type === 'Auto'))) {
      isMechanicPower = true;
    }

    return {
      allowedEnhancements: [...new Set(allowedEnhancements)].sort(),
      allowedSetCategories: [...new Set(allowedSetCategories)].sort(),
      maxSlots,
      stats,
      damage,
      effects,
      isRedirect,
      templateCount,
      powerType: rawJson.type,
      rawBoosts: rawJson.boosts_allowed || [],
      isMechanicPower,
    };
  } catch (err) {
    return null;
  }
}

// ============================================
// COMPARISON FUNCTIONS
// ============================================

// Effect keys that are metadata, not actual effects
const META_KEYS = new Set(['effectDuration', 'buffDuration']);

// Effects that are typically low-priority
const LOW_PRIORITY_EFFECTS = new Set([
  'taunt', 'placate', 'threatBuff', 'threatDebuff',
  'untouchable', 'onlyAffectsSelf', 'teleport',
  'translucency',
]);

function getEffectKeys(effects) {
  if (!effects || typeof effects !== 'object') return new Set();
  return new Set(Object.keys(effects).filter(k => !META_KEYS.has(k)));
}

function isSignificantEffect(value, threshold = 0.1) {
  if (typeof value === 'object' && value !== null) {
    if (value.scale !== undefined) return Math.abs(value.scale) >= threshold;
    return Object.values(value).some(v => isSignificantEffect(v, threshold));
  }
  if (typeof value === 'number') return Math.abs(value) >= threshold;
  return true;
}

function formatEffectSummary(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.scale !== undefined && value.table !== undefined) {
      return `${key} (scale: ${value.scale}, table: ${value.table})`;
    }
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

function formatDamageSummary(damage) {
  if (Array.isArray(damage)) {
    return damage.map(d => `${d.type} (scale: ${d.scale})`).join(' + ');
  }
  return `${damage.type} (scale: ${damage.scale}, table: ${damage.table || 'none'})`;
}

/**
 * Compare a single power across all 5 dimensions
 * Returns { dimension: [findings] }
 */
function comparePower(rawData, tsData, relativePath) {
  const findings = {
    enhancements: [],
    setCategories: [],
    maxSlots: [],
    stats: [],
    effects: [],
  };

  if (!rawData) {
    findings.effects.push({ severity: 'INFO', detail: 'No raw JSON found (unmatched)' });
    return findings;
  }

  // Skip enhancement/maxSlots/setCategory checks for mechanic powers
  const isMechanic = rawData.isMechanicPower || tsData.mechanicType;
  if (isMechanic) {
    findings.effects.push({
      severity: 'INFO',
      detail: `Mechanic power (${tsData.mechanicType || 'detected from raw'}) — skipping enhancement/slot checks`,
    });
    // Still check effects and stats, but skip enhancements/maxSlots/setCategories
    // Jump to dimension 4 (stats) and 5 (effects) below
  }

  if (!isMechanic) {
    // --- Dimension 1: allowedEnhancements ---
    const rawEnhSet = new Set(rawData.allowedEnhancements);
    const tsEnhSet = new Set(tsData.allowedEnhancements);

    const missingEnh = [...rawEnhSet].filter(e => !tsEnhSet.has(e));
    const extraEnh = [...tsEnhSet].filter(e => !rawEnhSet.has(e));

    if (missingEnh.length > 0) {
      findings.enhancements.push({
        severity: 'CRITICAL',
        detail: `Missing: ${missingEnh.join(', ')}`,
        missing: missingEnh,
      });
    }
    if (extraEnh.length > 0) {
      findings.enhancements.push({
        severity: 'WARNING',
        detail: `Extra: ${extraEnh.join(', ')}`,
        extra: extraEnh,
      });
    }

    // --- Dimension 2: allowedSetCategories ---
    const rawCatSet = new Set(rawData.allowedSetCategories);
    const tsCatSet = new Set(tsData.allowedSetCategories);

    const missingCat = [...rawCatSet].filter(c => !tsCatSet.has(c));
    const extraCat = [...tsCatSet].filter(c => !rawCatSet.has(c));

    if (missingCat.length > 0) {
      findings.setCategories.push({
        severity: 'CRITICAL',
        detail: `Missing: ${missingCat.join(', ')}`,
        missing: missingCat,
      });
    }
    if (extraCat.length > 0) {
      findings.setCategories.push({
        severity: 'WARNING',
        detail: `Extra: ${extraCat.join(', ')}`,
        extra: extraCat,
      });
    }

    // --- Dimension 3: maxSlots ---
    if (rawData.maxSlots !== tsData.maxSlots) {
      findings.maxSlots.push({
        severity: 'WARNING',
        detail: `Expected ${rawData.maxSlots}, got ${tsData.maxSlots}`,
        expected: rawData.maxSlots,
        actual: tsData.maxSlots,
      });
    }
  }

  // --- Dimension 4: Stats ---
  const STAT_FIELDS = ['accuracy', 'range', 'recharge', 'endurance', 'castTime', 'radius', 'arc', 'maxTargets'];
  const STAT_TOLERANCE = 0.01;

  for (const field of STAT_FIELDS) {
    const rawVal = rawData.stats[field];
    const tsVal = tsData.stats[field];

    if (rawVal !== undefined && rawVal !== null) {
      if (tsVal === undefined || tsVal === null) {
        findings.stats.push({
          severity: 'WARNING',
          field,
          detail: `Missing stat "${field}": expected ${rawVal}, got undefined`,
          expected: rawVal,
          actual: undefined,
        });
      } else if (Math.abs(rawVal - tsVal) > STAT_TOLERANCE) {
        findings.stats.push({
          severity: 'WARNING',
          field,
          detail: `Stat "${field}" mismatch: expected ${rawVal}, got ${tsVal}`,
          expected: rawVal,
          actual: tsVal,
        });
      }
    }
  }

  // --- Dimension 5: Effects ---
  if (rawData.isRedirect) {
    const rawEffectKeys = getEffectKeys(rawData.effects);
    const nonSummonKeys = new Set([...rawEffectKeys].filter(k => k !== 'summon'));
    if (nonSummonKeys.size === 0) {
      findings.effects.push({ severity: 'INFO', detail: 'Redirect power — effects live in summoned entity' });
      return findings;
    }
  }

  const rawEffectKeys = getEffectKeys(rawData.effects);
  const tsEffectKeys = getEffectKeys(tsData.effects);

  for (const key of rawEffectKeys) {
    if (!tsEffectKeys.has(key)) {
      const rawValue = rawData.effects[key];
      const significant = isSignificantEffect(rawValue);

      if (LOW_PRIORITY_EFFECTS.has(key)) {
        findings.effects.push({
          severity: 'INFO',
          effectKey: key,
          detail: `Low-priority effect missing: ${formatEffectSummary(key, rawValue)}`,
        });
      } else if (significant) {
        findings.effects.push({
          severity: 'CRITICAL',
          effectKey: key,
          detail: `Missing effect: ${formatEffectSummary(key, rawValue)}`,
        });
      } else {
        findings.effects.push({
          severity: 'INFO',
          effectKey: key,
          detail: `Minor effect missing (scale < 0.1): ${formatEffectSummary(key, rawValue)}`,
        });
      }
    }
  }

  // Check for damage in raw but missing in TS
  if (rawData.damage && !tsData.damage) {
    findings.effects.push({
      severity: 'CRITICAL',
      effectKey: 'damage',
      detail: `Missing damage: ${formatDamageSummary(rawData.damage)}`,
    });
  }

  // Check for effects in TS but not in raw
  for (const key of tsEffectKeys) {
    if (!rawEffectKeys.has(key) && key !== 'summon') {
      findings.effects.push({
        severity: 'WARNING',
        effectKey: key,
        detail: `Extra effect in TS not found in raw: ${key}`,
      });
    }
  }

  return findings;
}

// ============================================
// SEVERITY HELPERS
// ============================================

function getMaxSeverity(findings) {
  const allFindings = [
    ...findings.enhancements,
    ...findings.setCategories,
    ...findings.maxSlots,
    ...findings.stats,
    ...findings.effects,
  ];

  if (allFindings.some(f => f.severity === 'CRITICAL')) return 'CRITICAL';
  if (allFindings.some(f => f.severity === 'WARNING')) return 'WARNING';
  if (allFindings.some(f => f.severity === 'INFO')) return 'INFO';
  return 'PASS';
}

function countFindings(findings) {
  const allFindings = [
    ...findings.enhancements,
    ...findings.setCategories,
    ...findings.maxSlots,
    ...findings.stats,
    ...findings.effects,
  ];
  return {
    critical: allFindings.filter(f => f.severity === 'CRITICAL').length,
    warning: allFindings.filter(f => f.severity === 'WARNING').length,
    info: allFindings.filter(f => f.severity === 'INFO').length,
  };
}

// ============================================
// MARKDOWN OUTPUT
// ============================================

function generateMarkdown(results) {
  const lines = [];
  const at = archetype.charAt(0).toUpperCase() + archetype.slice(1);
  lines.push(`# ${at} Power Data Audit`);
  lines.push(`Generated: ${new Date().toISOString().split('T')[0]}`);
  lines.push('');

  // Summary
  const s = results.summary;
  lines.push('## Summary');
  lines.push(`- **Total powers**: ${s.total} | **Matched**: ${s.matched} | **Unmatched**: ${s.unmatched}`);
  lines.push(`- **CRITICAL**: ${s.critical} | **WARNING**: ${s.warning} | **INFO**: ${s.info} | **PASS**: ${s.pass}`);
  lines.push('');

  // Issues by category
  // Enhancements
  const enhIssues = results.powers.filter(p => p.findings.enhancements.length > 0);
  if (enhIssues.length > 0) {
    lines.push('## allowedEnhancements Issues');
    lines.push('');
    lines.push('| Power | Set | Severity | Detail |');
    lines.push('|-------|-----|----------|--------|');
    for (const p of enhIssues) {
      const setName = p.path.split('/').slice(-2, -1)[0];
      for (const f of p.findings.enhancements) {
        lines.push(`| ${p.powerName} | ${setName} | ${f.severity} | ${f.detail} |`);
      }
    }
    lines.push('');
  }

  // Set categories
  const catIssues = results.powers.filter(p => p.findings.setCategories.length > 0);
  if (catIssues.length > 0) {
    lines.push('## allowedSetCategories Issues');
    lines.push('');
    lines.push('| Power | Set | Severity | Detail |');
    lines.push('|-------|-----|----------|--------|');
    for (const p of catIssues) {
      const setName = p.path.split('/').slice(-2, -1)[0];
      for (const f of p.findings.setCategories) {
        lines.push(`| ${p.powerName} | ${setName} | ${f.severity} | ${f.detail} |`);
      }
    }
    lines.push('');
  }

  // maxSlots
  const slotIssues = results.powers.filter(p => p.findings.maxSlots.length > 0);
  if (slotIssues.length > 0) {
    lines.push('## maxSlots Issues');
    lines.push('');
    lines.push('| Power | Set | Expected | Actual |');
    lines.push('|-------|-----|----------|--------|');
    for (const p of slotIssues) {
      const setName = p.path.split('/').slice(-2, -1)[0];
      for (const f of p.findings.maxSlots) {
        lines.push(`| ${p.powerName} | ${setName} | ${f.expected} | ${f.actual} |`);
      }
    }
    lines.push('');
  }

  // Stats
  const statIssues = results.powers.filter(p => p.findings.stats.length > 0);
  if (statIssues.length > 0) {
    lines.push('## Stats Mismatches');
    lines.push('');
    lines.push('| Power | Set | Field | Expected | Actual |');
    lines.push('|-------|-----|-------|----------|--------|');
    for (const p of statIssues) {
      const setName = p.path.split('/').slice(-2, -1)[0];
      for (const f of p.findings.stats) {
        lines.push(`| ${p.powerName} | ${setName} | ${f.field} | ${f.expected} | ${f.actual} |`);
      }
    }
    lines.push('');
  }

  // Effects
  const effectIssues = results.powers.filter(p =>
    p.findings.effects.some(f => f.severity === 'CRITICAL' || f.severity === 'WARNING')
  );
  if (effectIssues.length > 0) {
    lines.push('## Effects Issues');
    lines.push('');
    lines.push('| Power | Set | Severity | Detail |');
    lines.push('|-------|-----|----------|--------|');
    for (const p of effectIssues) {
      const setName = p.path.split('/').slice(-2, -1)[0];
      for (const f of p.findings.effects.filter(f => f.severity !== 'INFO')) {
        lines.push(`| ${p.powerName} | ${setName} | ${f.severity} | ${f.detail} |`);
      }
    }
    lines.push('');
  }

  // Per-set detail
  lines.push('## Per-Set Detail');
  lines.push('');

  const bySet = {};
  for (const p of results.powers) {
    const parts = p.path.split('/');
    const category = parts.length >= 3 ? parts[1] : parts[0]; // primary or secondary
    const setName = parts.length >= 3 ? parts[2] : parts[1];
    const key = `${category}/${setName}`;
    if (!bySet[key]) bySet[key] = [];
    bySet[key].push(p);
  }

  for (const [setKey, powers] of Object.entries(bySet).sort((a, b) => a[0].localeCompare(b[0]))) {
    const passCount = powers.filter(p => p.severity === 'PASS').length;
    const critCount = powers.filter(p => p.severity === 'CRITICAL').length;
    const warnCount = powers.filter(p => p.severity === 'WARNING').length;
    const infoCount = powers.filter(p => p.severity === 'INFO').length;

    lines.push(`### ${setKey} (${powers.length} powers)`);
    const statusParts = [];
    if (critCount) statusParts.push(`${critCount} CRITICAL`);
    if (warnCount) statusParts.push(`${warnCount} WARNING`);
    if (infoCount) statusParts.push(`${infoCount} INFO`);
    if (passCount) statusParts.push(`${passCount} PASS`);
    lines.push(statusParts.join(' | '));
    lines.push('');

    for (const p of powers) {
      const icon = p.severity === 'PASS' ? '  PASS' : p.severity === 'CRITICAL' ? '  CRIT' : p.severity === 'WARNING' ? '  WARN' : '  INFO';
      let detail = '';
      const allFindings = [
        ...p.findings.enhancements,
        ...p.findings.setCategories,
        ...p.findings.maxSlots,
        ...p.findings.stats,
        ...p.findings.effects,
      ].filter(f => f.severity !== 'INFO' || verbose);
      if (allFindings.length > 0) {
        detail = ` — ${allFindings.map(f => f.detail).join('; ')}`;
      }
      lines.push(`- [${icon}] ${p.powerName}${detail}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ============================================
// CONSOLE OUTPUT
// ============================================

function printConsoleOutput(results) {
  const at = archetype.charAt(0).toUpperCase() + archetype.slice(1);
  console.log(`=== COMPREHENSIVE POWER AUDIT: ${at} ===\n`);

  // Print CRITICAL findings
  const criticalPowers = results.powers.filter(p => p.severity === 'CRITICAL');
  if (criticalPowers.length > 0) {
    console.log(`\n--- CRITICAL (${criticalPowers.length} powers) ---\n`);
    for (const power of criticalPowers) {
      console.log(`[${power.path}] (${power.powerName})`);
      const allFindings = [
        ...power.findings.enhancements,
        ...power.findings.setCategories,
        ...power.findings.maxSlots,
        ...power.findings.stats,
        ...power.findings.effects,
      ];
      for (const f of allFindings.filter(f => f.severity === 'CRITICAL')) {
        console.log(`  CRITICAL: ${f.detail}`);
      }
      for (const f of allFindings.filter(f => f.severity === 'WARNING')) {
        console.log(`  WARNING: ${f.detail}`);
      }
      console.log('');
    }
  }

  // Print WARNING findings
  const warningPowers = results.powers.filter(p => p.severity === 'WARNING');
  if (warningPowers.length > 0) {
    console.log(`\n--- WARNING (${warningPowers.length} powers) ---\n`);
    for (const power of warningPowers) {
      console.log(`[${power.path}] (${power.powerName})`);
      const allFindings = [
        ...power.findings.enhancements,
        ...power.findings.setCategories,
        ...power.findings.maxSlots,
        ...power.findings.stats,
        ...power.findings.effects,
      ];
      for (const f of allFindings.filter(f => f.severity === 'WARNING')) {
        console.log(`  WARNING: ${f.detail}`);
      }
      console.log('');
    }
  }

  // Print INFO (verbose only)
  if (verbose) {
    const infoPowers = results.powers.filter(p => p.severity === 'INFO');
    if (infoPowers.length > 0) {
      console.log(`\n--- INFO (${infoPowers.length} powers) ---\n`);
      for (const power of infoPowers) {
        console.log(`[${power.path}] (${power.powerName})`);
        const allFindings = [
          ...power.findings.enhancements,
          ...power.findings.setCategories,
          ...power.findings.maxSlots,
          ...power.findings.stats,
          ...power.findings.effects,
        ];
        for (const f of allFindings.filter(f => f.severity === 'INFO')) {
          console.log(`  INFO: ${f.detail}`);
        }
        console.log('');
      }
    }
  }

  // Summary by powerset
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

  // Overall summary
  const s = results.summary;
  console.log('\n--- OVERALL SUMMARY ---');
  console.log(`Scanned: ${s.total} | Matched: ${s.matched} | Unmatched: ${s.unmatched}`);
  console.log(`CRITICAL: ${s.critical} | WARNING: ${s.warning} | INFO: ${s.info} | PASS: ${s.pass}`);

  // Dimension breakdown
  console.log('\n--- BY DIMENSION ---');
  console.log(`Enhancements: ${s.dimensions.enhancements.critical} CRITICAL, ${s.dimensions.enhancements.warning} WARNING`);
  console.log(`Set Categories: ${s.dimensions.setCategories.critical} CRITICAL, ${s.dimensions.setCategories.warning} WARNING`);
  console.log(`Max Slots: ${s.dimensions.maxSlots.warning} WARNING`);
  console.log(`Stats: ${s.dimensions.stats.warning} WARNING`);
  console.log(`Effects: ${s.dimensions.effects.critical} CRITICAL, ${s.dimensions.effects.warning} WARNING`);
}

// ============================================
// MAIN
// ============================================

function main() {
  const archetypePath = path.join(POWERSETS_PATH, archetype);
  if (!fs.existsSync(archetypePath)) {
    console.error(`Archetype directory not found: ${archetypePath}`);
    process.exit(1);
  }

  let searchPath = archetypePath;
  if (powersetFilter) {
    // Try to find the powerset in primary or secondary
    const primaryPath = path.join(archetypePath, 'primary', powersetFilter);
    const secondaryPath = path.join(archetypePath, 'secondary', powersetFilter);
    if (fs.existsSync(primaryPath)) {
      searchPath = primaryPath;
    } else if (fs.existsSync(secondaryPath)) {
      searchPath = secondaryPath;
    } else {
      console.error(`Powerset not found: ${powersetFilter} (checked primary/ and secondary/)`);
      process.exit(1);
    }
  }

  const tsFiles = findPowerFiles(searchPath);
  console.error(`Found ${tsFiles.length} power files to audit for ${archetype}${powersetFilter ? '/' + powersetFilter : ''}\n`);

  const results = {
    archetype,
    generatedAt: new Date().toISOString(),
    summary: {
      total: 0,
      matched: 0,
      unmatched: 0,
      critical: 0,
      warning: 0,
      info: 0,
      pass: 0,
      dimensions: {
        enhancements: { critical: 0, warning: 0 },
        setCategories: { critical: 0, warning: 0 },
        maxSlots: { warning: 0 },
        stats: { warning: 0 },
        effects: { critical: 0, warning: 0 },
      },
    },
    powers: [],
    byPowerset: {},
  };

  for (const tsFile of tsFiles) {
    const relativePath = getRelativePath(tsFile);
    const tsContent = fs.readFileSync(tsFile, 'utf-8');

    // Extract power name from export
    const nameMatch = tsContent.match(/"name"\s*:\s*"([^"]+)"/);
    const powerName = nameMatch ? nameMatch[1] : path.basename(tsFile, '.ts');

    // Extract source path
    const sourcePath = extractSourceComment(tsContent);
    results.summary.total++;

    if (!sourcePath) {
      results.summary.unmatched++;
      if (verbose) {
        console.error(`[SKIP] ${relativePath} — no Source comment`);
      }
      continue;
    }

    // Resolve raw JSON path
    const rawJsonPath = path.join(RAW_POWERS_PATH, sourcePath);

    // Extract data from both sources
    const rawData = extractRawData(rawJsonPath);
    const tsData = parseTsPowerFile(tsContent);

    if (!rawData) {
      results.summary.unmatched++;
      if (verbose) {
        console.error(`[SKIP] ${relativePath} — raw JSON not found: ${sourcePath}`);
      }
      continue;
    }

    results.summary.matched++;

    // Compare across all dimensions
    const findings = comparePower(rawData, tsData, relativePath);
    const severity = getMaxSeverity(findings);
    const counts = countFindings(findings);

    // Update dimension counts
    for (const f of findings.enhancements) {
      if (f.severity === 'CRITICAL') results.summary.dimensions.enhancements.critical++;
      if (f.severity === 'WARNING') results.summary.dimensions.enhancements.warning++;
    }
    for (const f of findings.setCategories) {
      if (f.severity === 'CRITICAL') results.summary.dimensions.setCategories.critical++;
      if (f.severity === 'WARNING') results.summary.dimensions.setCategories.warning++;
    }
    for (const f of findings.maxSlots) {
      if (f.severity === 'WARNING') results.summary.dimensions.maxSlots.warning++;
    }
    for (const f of findings.stats) {
      if (f.severity === 'WARNING') results.summary.dimensions.stats.warning++;
    }
    for (const f of findings.effects) {
      if (f.severity === 'CRITICAL') results.summary.dimensions.effects.critical++;
      if (f.severity === 'WARNING') results.summary.dimensions.effects.warning++;
    }

    // Track severity counts
    if (severity === 'CRITICAL') results.summary.critical++;
    else if (severity === 'WARNING') results.summary.warning++;
    else if (severity === 'INFO') results.summary.info++;
    else results.summary.pass++;

    // Track by powerset
    const powersetPath = relativePath.split('/').slice(0, -1).join('/');
    if (!results.byPowerset[powersetPath]) {
      results.byPowerset[powersetPath] = { critical: 0, warning: 0, info: 0, pass: 0, powers: [] };
    }
    const psEntry = results.byPowerset[powersetPath];
    if (severity === 'CRITICAL') psEntry.critical++;
    else if (severity === 'WARNING') psEntry.warning++;
    else if (severity === 'INFO') psEntry.info++;
    else psEntry.pass++;

    // Store result
    const powerResult = {
      path: relativePath,
      powerName,
      source: sourcePath,
      severity,
      findings,
      counts,
      isRedirect: rawData.isRedirect,
    };

    results.powers.push(powerResult);
    psEntry.powers.push(powerResult);
  }

  // ============================================
  // OUTPUT
  // ============================================

  if (outputMarkdown) {
    console.log(generateMarkdown(results));
  } else {
    printConsoleOutput(results);
  }

  // Write JSON output
  if (outputJson) {
    const outputDir = path.resolve('./scripts/audit-results');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, `${archetype}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.error(`\nJSON results written to: ${outputPath}`);
  }
}

main();
