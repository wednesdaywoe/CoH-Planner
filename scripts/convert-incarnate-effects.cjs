#!/usr/bin/env node
/**
 * convert-incarnate-effects.cjs
 *
 * Extracts incarnate effects from bin-crawler JSON and generates a TS
 * data file with correct values for all incarnate slots.
 *
 * Reads from: exported_powers[/<datasetId>]/incarnate/
 *   - alpha/ + alpha_silent/       → Enhancement bonuses + level shift
 *   - destiny/ + destiny_silent/   → Click buffs with diminishing durations + level shift
 *   - hybrid/ + hybrid_silent/     → Passive + front-loaded + per-target toggle effects
 *   - interface/ + interface_silent/ → Proc debuffs on enemies
 *
 * Outputs:
 *   src/data/datasets/<id>/generated/incarnate-effects.ts
 *
 * Usage: node scripts/convert-incarnate-effects.cjs [--dataset <id>] [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const { parseDatasetArg, datasetPath } = require('./_dataset-paths.cjs');
const datasetId = parseDatasetArg();

// Source: bin-crawler JSON export. HC keeps the legacy flat layout
// (`exported_powers/incarnate/`); other datasets are namespaced
// (`exported_powers/<id>/incarnate/`).
const RAW_DATA_BASE = path.join(__dirname, '..', 'exported_powers');
const RAW_BASE = (datasetId === 'homecoming' && !fs.existsSync(path.join(RAW_DATA_BASE, datasetId, 'incarnate')))
  ? path.join(RAW_DATA_BASE, 'incarnate')
  : path.join(RAW_DATA_BASE, datasetId, 'incarnate');

const OUTPUT_FILE = datasetPath(datasetId, 'generated', 'incarnate-effects.ts');
const DRY_RUN = process.argv.includes('--dry-run');

// ============================================
// UTILITY FUNCTIONS
// ============================================

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readDir(dirPath) {
  try {
    return fs.readdirSync(dirPath).filter(f => f.endsWith('.json') && f !== 'index.json');
  } catch {
    return [];
  }
}

/** T3+ alpha and destiny tiers grant +1 level shift. The binary doesn't tag
 *  this as a distinct Level_Shift attrib — index 123 collapses Recharge_Power,
 *  Level_Shift, Vision_Phase, and Ninja_Run with no disambiguator, so the
 *  attrib-based detection that used to live here never actually fired.
 *  Filename inference per the documented CoH naming convention is reliable:
 *    Alpha T3+:   *_core_paragon, *_radial_paragon,
 *                 *_partial_{core,radial}_revamp, *_total_{core,radial}_revamp
 *    Destiny T3+: *_core_epiphany, *_radial_epiphany,
 *                 *_partial_{core,radial}_invocation, *_total_{core,radial}_invocation
 */
function inferLevelShiftFromFilename(powerId) {
  const id = powerId.toLowerCase();
  // T3 paragon/epiphany — unique suffixes, safe to match by endsWith.
  if (id.endsWith('_paragon') || id.endsWith('_epiphany')) return 1;
  // Alpha _revamp only appears on T3.5/T4 (partial_/total_*_revamp).
  if (id.endsWith('_revamp')) return 1;
  // Destiny _invocation is ambiguous: alone it's T1, with `_core_`/`_radial_`
  // it's T2 (none of these grant shift). Only the partial_/total_ variants
  // (T3.5/T4) shift.
  if (/_(partial|total)_(core|radial)_invocation$/.test(id)) return 1;
  return 0;
}

/** True if a template represents a Grant_Power, across both Parse7 (HC) and
 *  Parse6 (Rebirth) export shapes. HC tags `attribs: ['Grant_Power']`;
 *  Parse6 currently decodes the same attrib as `Null` but still populates
 *  `params.type = 'Power'` with the power_names. Skip Revoke_Power explicitly. */
function isGrantPowerTemplate(t) {
  const attribs = t.attribs || [];
  if (attribs.includes('Revoke_Power')) return false;
  if (attribs.includes('Grant_Power')) return true;
  return !!(t.params && t.params.type === 'Power' && Array.isArray(t.params.power_names) && t.params.power_names.length);
}

/** Extract all "Incarnate.*Silent.*" references from a power's Grant_Power templates */
function extractGrantedPowers(data) {
  const grants = [];
  for (const eff of data.effects || []) {
    for (const t of eff.templates || []) {
      if (!isGrantPowerTemplate(t)) continue;
      // power_names can be at top level or nested inside params
      const pnames = [
        ...(t.power_names || []),
        ...((t.params && t.params.power_names) || []),
      ];
      for (const pn of pnames) {
        if (pn.toLowerCase().includes('silent')) {
          grants.push(pn);
        }
      }
    }
  }
  return [...new Set(grants)];
}

/** Convert "Incarnate.Alpha_Silent.Damage_Very_Rare" → "damage_very_rare" */
function silentRefToFilename(ref) {
  const parts = ref.split('.');
  const name = parts[parts.length - 1];
  return name.toLowerCase();
}

/** Normalize attrib names from raw data to our internal keys */
const ATTRIB_MAP = {
  // Damage types → resistance keys
  'Smashing_Dmg': 'resSmashing', 'Lethal_Dmg': 'resLethal',
  'Fire_Dmg': 'resFire', 'Cold_Dmg': 'resCold',
  'Energy_Dmg': 'resEnergy', 'Negative_Energy_Dmg': 'resNegative',
  'Psionic_Dmg': 'resPsionic', 'Toxic_Dmg': 'resToxic',
  // Defense position/type keys (aspect=Current)
  'Melee': 'defMelee', 'Ranged': 'defRanged', 'Area': 'defAoE',
  'Smashing': 'defSmashing', 'Lethal': 'defLethal',
  'Fire': 'defFire', 'Cold': 'defCold',
  'Energy': 'defEnergy', 'Negative_Energy': 'defNegative',
  'Psionic': 'defPsionic', 'Toxic': 'defToxic',
  // Mez types (protection, aspect=Current, negative scale)
  'Held': 'protHold', 'Stunned': 'protStun', 'Immobilized': 'protImmobilize',
  'Sleep': 'protSleep', 'Confused': 'protConfuse', 'Afraid': 'protFear',
  'Terrorized': 'protFear', 'Knocked': 'protKnockback',
  // Buffs
  'Regeneration': 'regeneration',
  'Recovery': 'recovery',
  'Endurance': 'endurance',
  'RechargeTime': 'recharge',
  'Taunt': 'taunt',
  'Level_Shift': 'levelShift',
};

/** Map alpha_silent filename bases to enhancement aspect keys */
const ALPHA_FILENAME_MAP = {
  'damage': 'damage',
  'damage_plus': 'damage',
  'accuracy': 'accuracy',
  'accuracy_plus': 'accuracy',
  'recharge': 'recharge',
  'recharge_plus': 'recharge',
  'endurance_reduction': 'enduranceReduction',
  'endurance_reduction_plus': 'enduranceReduction',
  'range': 'range',
  'heal': 'heal',
  'heal_plus': 'heal',
  'defense_buff': 'defense',
  'res_damage': 'resistance',
  'res_damage_plus': 'resistance',
  'tohit_buff': 'toHitBuff',
  'tohit_debuff': 'toHitDebuff',
  'defense_debuff': 'defenseDebuff',
  'hold': 'hold',
  'hold_plus': 'hold',
  'stun': 'stun',
  'immobilize': 'immobilize',
  'sleep': 'sleep',
  'fear': 'fear',
  'confuse': 'confuse',
  'knockback': 'knockback',
  'snare': 'slow',
  'taunt': 'taunt',
  'run': 'runSpeed',
  'fly': 'flySpeed',
  'jump': 'jumpSpeed',
  'intangible': 'intangible',
  'recovery': 'enduranceModification',
  'recovery_plus': 'enduranceModification',
};

function round(n, decimals = 6) {
  return Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============================================
// ALPHA EXTRACTION
// ============================================

function extractAlpha() {
  console.log('\n=== ALPHA ===');
  const mainDir = path.join(RAW_BASE, 'alpha');
  const silentDir = path.join(RAW_BASE, 'alpha_silent');
  const results = {};

  // Pre-load all silent files
  const silentCache = {};
  for (const f of readDir(silentDir)) {
    const data = readJson(path.join(silentDir, f));
    if (data) silentCache[f.replace('.json', '')] = data;
  }

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;
    const grantedRefs = extractGrantedPowers(data);

    // T3+ alphas grant +1 level shift; see inferLevelShiftFromFilename for why
    // we read this from the filename rather than the binary.
    const levelShift = inferLevelShiftFromFilename(powerId);

    // Resolve silent power references to get enhancement bonuses
    const enhancements = {};
    for (const ref of grantedRefs) {
      const silentName = silentRefToFilename(ref);
      const silentData = silentCache[silentName];
      if (!silentData) {
        console.warn(`  WARN: Silent power not found: ${silentName} (from ${powerId})`);
        continue;
      }

      // Determine aspect key from filename (strip tier suffix)
      const fileBase = silentName
        .replace(/_common$/, '').replace(/_uncommon$/, '').replace(/_very_rare$/, '')
        .replace(/_rare$/, '').replace(/_half$/, '').replace(/_plus_very_rare$/, '')
        .replace(/_plus$/, '');
      const aspectKey = ALPHA_FILENAME_MAP[fileBase];
      if (!aspectKey) {
        console.warn(`  WARN: Unknown alpha silent file base: ${fileBase} (from ${silentName})`);
        continue;
      }

      // Sum all templates for this aspect (regular + ED-bypass portions)
      // Alpha silent files have 2 templates per attrib: regular + BoostIgnoreDiminishing.
      // All damage/defense types in a file share the same scale per template,
      // so we only need the first unique attrib's values.
      let totalScale = 0;
      let firstAttrib = null;
      for (const eff of silentData.effects || []) {
        for (const t of eff.templates || []) {
          const attrib = (t.attribs || [])[0];
          if (!attrib || attrib === 'Set_Mode') continue;
          // Only process the first unique attrib (others are duplicates for different damage types)
          if (firstAttrib === null) firstAttrib = attrib;
          if (attrib !== firstAttrib) continue;
          totalScale += (t.scale || 0);
        }
      }
      if (totalScale > 0) {
        if (!enhancements[aspectKey]) enhancements[aspectKey] = 0;
        enhancements[aspectKey] = round(enhancements[aspectKey] + totalScale);
      }
    }

    results[powerId] = {
      displayName,
      levelShift,
      enhancements,
    };

    const enhStr = Object.entries(enhancements)
      .map(([k, v]) => `${k}:${round(v * 100, 1)}%`)
      .join(', ');
    console.log(`  ${displayName}: lvlShift=${levelShift} enh=[${enhStr}]`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// DESTINY EXTRACTION
// ============================================

function extractDestiny() {
  console.log('\n=== DESTINY ===');
  const mainDir = path.join(RAW_BASE, 'destiny');
  const silentDir = path.join(RAW_BASE, 'destiny_silent');
  const results = {};

  // Pre-load silent files
  const silentCache = {};
  for (const f of readDir(silentDir)) {
    const data = readJson(path.join(silentDir, f));
    if (data) silentCache[f.replace('.json', '')] = data;
  }

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;

    // T3+ destinies grant +1 level shift; same filename rule as alpha. The
    // attrib-based detection that used to live here never fired (silent
    // files don't carry a Level_Shift attrib in either Parse7 or Parse6).
    const levelShift = inferLevelShiftFromFilename(powerId);

    // Extract diminishing buff effects from main power
    // Destiny powers have multiple copies of the same effect at different durations
    // We want the peak (shortest duration) values
    const effects = {};
    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        const attrib = (t.attribs || [])[0];
        if (!attrib || attrib === 'Grant_Power' || attrib === 'Revoke_Power' || attrib === 'Set_Mode') continue;

        const aspect = t.aspect || '';
        const scale = t.scale || 0;
        const duration = t.duration || '';
        if (scale === 0) continue;

        // Parse duration to seconds
        let durSec = 0;
        const durMatch = duration.match(/([\d.]+)\s*seconds?/i);
        if (durMatch) durSec = parseFloat(durMatch[1]);

        // Determine the stat key
        let statKey = null;
        if (aspect === 'Resistance') {
          // All damage resistance types
          statKey = 'resistanceAll';
        } else if (aspect === 'Current' && ATTRIB_MAP[attrib]) {
          const mapped = ATTRIB_MAP[attrib];
          if (mapped.startsWith('def')) {
            statKey = 'defenseAll';
          } else if (mapped.startsWith('prot')) {
            // skip mez effects on destiny (they target enemies)
            continue;
          } else {
            statKey = mapped;
          }
        } else if (aspect === 'Strength') {
          // Enhancement-style buffs (recharge, recovery)
          if (attrib === 'RechargeTime') statKey = 'recharge';
          else if (attrib === 'Recovery') statKey = 'recovery';
          else if (attrib === 'Regeneration') statKey = 'regeneration';
          else statKey = attrib.toLowerCase();
        } else if (attrib === 'Endurance' && aspect === 'Current') {
          statKey = 'endurance'; // Endurance refill
        }

        if (!statKey) {
          // console.warn(`  WARN: Unmapped destiny effect: ${attrib} aspect=${aspect} in ${powerId}`);
          continue;
        }

        // Track by stat+duration — we'll pick the peak later
        const key = `${statKey}`;
        if (!effects[key]) effects[key] = [];
        effects[key].push({ value: round(scale), duration: durSec });
      }
    }

    // For each stat, extract peak value and build diminishing timeline
    const peakEffects = {};
    const timeline = {};
    for (const [stat, entries] of Object.entries(effects)) {
      // Sort by duration ascending
      entries.sort((a, b) => a.duration - b.duration);
      // Peak = highest absolute value
      const peak = entries.reduce((best, e) => Math.abs(e.value) > Math.abs(best.value) ? e : best, entries[0]);
      peakEffects[stat] = round(peak.value);
      timeline[stat] = entries.map(e => ({ value: round(e.value), duration: e.duration }));
    }

    results[powerId] = {
      displayName,
      levelShift,
      peakEffects,
      timeline,
    };

    const effectStr = Object.entries(peakEffects)
      .map(([k, v]) => `${k}:${round(v * 100, 1)}%`)
      .join(', ');
    console.log(`  ${displayName}: lvlShift=${levelShift} peak=[${effectStr}]`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// HYBRID EXTRACTION
// ============================================

function extractHybrid() {
  console.log('\n=== HYBRID ===');
  const mainDir = path.join(RAW_BASE, 'hybrid');
  const silentDir = path.join(RAW_BASE, 'hybrid_silent');
  const results = {};

  // Pre-load all silent files
  const silentCache = {};
  for (const f of readDir(silentDir)) {
    const data = readJson(path.join(silentDir, f));
    if (data) silentCache[f.replace('.json', '')] = data;
  }

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;
    const helpText = data.display_help || '';

    // Determine tree from filename
    let tree = 'unknown';
    if (powerId.startsWith('assault')) tree = 'assault';
    else if (powerId.startsWith('support')) tree = 'support';
    else if (powerId.startsWith('melee')) tree = 'melee';
    else if (powerId.startsWith('control')) tree = 'control';

    // Extract max enemies from help text
    const maxMatch = helpText.match(/maximum strength at (\d+) enem/i);
    const maxTargets = maxMatch ? parseInt(maxMatch[1]) : 0;

    // Categorize effects by requires_expression
    const frontLoaded = {}; // Self-only (fixed baseline when toggle is on)
    const perTarget = {};   // Per-enemy stacking
    const grantedPassiveRefs = []; // Passive boost powers
    const grantedOtherRefs = []; // Other granted powers (procs, etc.)

    for (const eff of data.effects || []) {
      const req = eff.requires_expression || '';

      for (const t of eff.templates || []) {
        const attribs = t.attribs || [];
        const scale = t.scale || 0;
        const aspect = t.aspect || '';

        // Cross-format grant detection (Parse7 attribs vs Parse6 params).
        if (isGrantPowerTemplate(t)) {
          const pnames = [
            ...(t.power_names || []),
            ...((t.params && t.params.power_names) || []),
          ];
          for (const pn of pnames) {
            if (pn.toLowerCase().includes('boost')) {
              grantedPassiveRefs.push(pn);
            } else if (pn.toLowerCase().includes('silent')) {
              grantedOtherRefs.push(pn);
            }
          }
          continue;
        }

        for (const attrib of attribs) {
          if (attrib === 'Revoke_Power' || attrib === 'Set_Mode') continue;
          if (scale === 0) continue;

          // Determine stat key based on attrib + aspect
          let statKey = null;
          if (aspect === 'Resistance' && ATTRIB_MAP[attrib]) {
            statKey = ATTRIB_MAP[attrib]; // e.g., resSmashing
          } else if (aspect === 'Current') {
            if (ATTRIB_MAP[attrib]) {
              statKey = ATTRIB_MAP[attrib];
            }
          } else if (aspect === 'Strength') {
            // Enhancement-type buffs
            if (attrib === 'Endurance') statKey = 'enduranceDiscount';
          }

          if (!statKey) continue;
          if (statKey === 'taunt') continue; // Skip taunt — not a player stat

          // Classify as front-loaded or per-target
          const isPerTarget = req.includes('Ne(target');
          const isSelfOnly = req.includes('source>entref') || req === '';

          if (isPerTarget) {
            if (!perTarget[statKey]) perTarget[statKey] = 0;
            perTarget[statKey] = round(perTarget[statKey] + Math.abs(scale));
          } else if (isSelfOnly) {
            if (!frontLoaded[statKey]) frontLoaded[statKey] = 0;
            // Mez protection uses negative scales for protection magnitude
            const val = statKey.startsWith('prot') ? Math.abs(scale) : scale;
            frontLoaded[statKey] = round(frontLoaded[statKey] + val);
          }
        }
      }
    }

    // Resolve passive boosts from silent files
    const passive = {};
    for (const ref of grantedPassiveRefs) {
      const silentName = silentRefToFilename(ref);
      const silentData = silentCache[silentName];
      if (!silentData) {
        console.warn(`  WARN: Silent boost not found: ${silentName} (from ${powerId})`);
        continue;
      }

      for (const eff of silentData.effects || []) {
        for (const t of eff.templates || []) {
          const attrib = (t.attribs || [])[0];
          const scale = t.scale || 0;
          const aspect = t.aspect || '';
          if (!attrib || scale === 0) continue;

          let statKey = null;
          if (attrib === 'Smashing_Dmg' && aspect === 'Strength') {
            statKey = 'damage'; // Assault passive +Dmg
          } else if (attrib === 'Regeneration' && aspect === 'Current') {
            statKey = 'regeneration'; // Melee passive +Regen
          } else if (attrib === 'Endurance' && aspect === 'Strength') {
            statKey = 'enduranceDiscount'; // Support passive End Discount
          } else if (aspect === 'Resistance') {
            // Control passive Status Resistance
            const mezTypes = ['Confused', 'Terrorized', 'Held', 'Immobilized', 'Stunned', 'Sleep', 'Afraid'];
            if (mezTypes.includes(attrib)) {
              statKey = 'statusResistance';
            }
          }

          if (statKey) {
            if (!passive[statKey]) passive[statKey] = 0;
            passive[statKey] = round(Math.max(passive[statKey], Math.abs(scale)));
          }
        }
      }
    }

    results[powerId] = {
      displayName,
      tree,
      maxTargets,
      passive,
      frontLoaded,
      perTarget,
      grantedOtherRefs,
      duration: 120,
      recharge: 120,
    };

    const passiveStr = Object.entries(passive).map(([k, v]) => `${k}:${round(v * 100, 1)}%`).join(', ');
    const fixedStr = Object.entries(frontLoaded).map(([k, v]) => `${k}:${round(v * 100, 1)}%`).join(', ');
    const ptStr = Object.entries(perTarget).map(([k, v]) => `${k}:${round(v * 100, 1)}%`).join(', ');
    console.log(`  ${displayName} (${tree}): maxTargets=${maxTargets}`);
    if (passiveStr) console.log(`    passive: ${passiveStr}`);
    if (fixedStr) console.log(`    front-loaded: ${fixedStr}`);
    if (ptStr) console.log(`    per-target: ${ptStr}`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// INTERFACE EXTRACTION
// ============================================

/** Map interface silent attrib names to debuff type display strings */
const INTERFACE_DEBUFF_MAP = {
  'ToHit': '-ToHit', 'Accuracy': '-ToHit',
  'Regeneration': '-Regen', 'Recovery': '-Recovery',
  'Base_Defense': '-Defense',
  'Smashing_Dmg': '-Damage', // aspect=Strength → damage debuff
  'RunningSpeed': '-Speed', 'JumpHeight': '-Speed', 'FlyingSpeed': '-Speed',
  'RechargeTime': '-Recharge',
  'Endurance': '-Endurance',
  'HitPoints': '-MaxHP',
};

/** Map attrib names to DoT type display */
const INTERFACE_DOT_MAP = {
  'Fire_Dmg': 'Fire', 'Cold_Dmg': 'Cold', 'Energy_Dmg': 'Energy',
  'Negative_Energy_Dmg': 'Negative', 'Toxic_Dmg': 'Toxic',
  'Psionic_Dmg': 'Psionic', 'Smashing_Dmg': 'Smashing', 'Lethal_Dmg': 'Lethal',
};

function extractInterface() {
  console.log('\n=== INTERFACE ===');
  const mainDir = path.join(RAW_BASE, 'interface');
  const silentDir = path.join(RAW_BASE, 'interface_silent');
  const results = {};

  // Pre-load silent files (normalize names: "to_hit_debuff" from "To_Hit_Debuff")
  const silentCache = {};
  for (const f of readDir(silentDir)) {
    const data = readJson(path.join(silentDir, f));
    if (data) silentCache[f.replace('.json', '')] = data;
  }

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;

    // Interface powers grant silent proc powers and set Global_Chance_Mod for proc rates.
    // The grants and chances pair up in order: first grant → first chance, etc.
    const grantedRefs = extractGrantedPowers(data);
    const chances = [];
    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        if ((t.attribs || []).includes('Global_Chance_Mod')) {
          chances.push(t.scale || 0);
        }
      }
    }

    // Resolve each granted proc from silent files
    let debuffType = null;
    let debuffMagnitude = 0;
    let debuffDuration = 0;
    let dotType = null;
    let dotDamage = 0;
    let dotDuration = 0;
    let dotTableName = '';
    let procChance = chances[0] || 0;

    for (let i = 0; i < grantedRefs.length; i++) {
      const silentName = silentRefToFilename(grantedRefs[i]);
      const silentData = silentCache[silentName];
      if (!silentData) continue;
      const chance = chances[i] || 0;

      for (const eff of silentData.effects || []) {
        for (const t of eff.templates || []) {
          const attrib = (t.attribs || [])[0];
          const scale = t.scale || 0;
          const aspect = t.aspect || '';
          const duration = t.duration || '';
          if (!attrib || scale === 0) continue;

          const durMatch = duration.match(/([\d.]+)\s*seconds?/i);
          const durSec = durMatch ? parseFloat(durMatch[1]) : 0;
          const tname = (t.table && typeof t.table === 'object') ? (t.table.column_name || '') : '';

          // Classify as debuff or DoT
          if (aspect === 'Absolute' && attrib in INTERFACE_DOT_MAP) {
            // DoT damage
            if (!dotType || Math.abs(scale) > Math.abs(dotDamage)) {
              dotType = INTERFACE_DOT_MAP[attrib];
              dotDamage = round(Math.abs(scale));
              dotDuration = durSec;
              dotTableName = tname || 'Ranged_Tempdamage';
            }
          } else if (attrib in INTERFACE_DEBUFF_MAP) {
            // Debuff effect
            if (!debuffType || Math.abs(scale) > Math.abs(debuffMagnitude)) {
              debuffType = INTERFACE_DEBUFF_MAP[attrib];
              // Aspect=Strength means it's a strength debuff (percentage)
              // Aspect=Current means direct stat modification
              debuffMagnitude = round(Math.abs(scale));
              debuffDuration = durSec;
            }
          }

          // Use the highest proc chance
          if (chance > procChance) procChance = chance;
        }
      }
    }

    results[powerId] = {
      displayName,
      debuffType,
      debuffMagnitude,
      debuffDuration,
      dotType,
      dotDamage,
      dotDuration,
      dotTableName,
      procChance: round(procChance),
    };

    const parts = [];
    if (debuffType) parts.push(`${debuffType} ${round(debuffMagnitude * 100, 1)}%`);
    if (dotType) parts.push(`DoT(${dotType}) scale=${dotDamage}`);
    console.log(`  ${displayName}: ${parts.join(', ') || 'procs only'} chance=${round(procChance * 100)}%`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// JUDGEMENT EXTRACTION
// ============================================

/** Map raw damage attrib names to display names */
const DAMAGE_TYPE_MAP = {
  'Smashing_Dmg': 'Smashing', 'Lethal_Dmg': 'Lethal', 'Fire_Dmg': 'Fire',
  'Cold_Dmg': 'Cold', 'Energy_Dmg': 'Energy', 'Negative_Energy_Dmg': 'Negative Energy',
  'Psionic_Dmg': 'Psionic', 'Toxic_Dmg': 'Toxic',
};

function extractJudgement() {
  console.log('\n=== JUDGEMENT ===');
  const mainDir = path.join(RAW_BASE, 'judgement');
  const results = {};

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;
    const helpText = data.display_help || '';

    // Extract area/targeting info from top-level
    const effectArea = data.effect_area || 'Unknown';
    const range = data.range || 0;
    const radius = data.radius || 0;
    const arc = data.arc || 0;
    const maxTargets = data.max_targets_hit || 0;
    const activationTime = data.activation_time || 0;
    const rechargeTime = data.recharge_time || 90;

    // Extract damage effects
    let primaryDamageType = null;
    let damageScale = 0;
    const secondaryEffects = [];

    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        const attrib = (t.attribs || [])[0];
        const scale = t.scale || 0;
        const duration = t.duration || '';
        const aspect = t.aspect || '';

        if (attrib in DAMAGE_TYPE_MAP && aspect === 'Absolute') {
          const durMatch = duration.match(/([\d.]+)\s*seconds?/i);
          const durSec = durMatch ? parseFloat(durMatch[1]) : 0;

          if (durSec === 0 && scale > damageScale) {
            // Direct damage (no duration = instant)
            primaryDamageType = DAMAGE_TYPE_MAP[attrib];
            damageScale = scale;
          } else if (durSec > 0) {
            // DoT
            secondaryEffects.push(`DoT(${DAMAGE_TYPE_MAP[attrib]}) ${round(scale, 2)} scale/${round(durSec, 1)}s`);
          }
        } else if (attrib === 'Held' || attrib === 'Stunned' || attrib === 'Immobilized' ||
                   attrib === 'Knocked' || attrib === 'Sleep') {
          if (scale > 0) {
            secondaryEffects.push(`${attrib} Mag ${round(scale, 1)}`);
          }
        } else if ((attrib === 'JumpHeight' || attrib === 'RunningSpeed') && scale < 0) {
          secondaryEffects.push('Slow');
        }
      }
    }

    // Determine effect area type from help text for better display
    let areaType = effectArea;
    if (helpText.includes('Cone')) areaType = 'Cone';
    else if (helpText.includes('Chain')) areaType = 'Chain';
    else if (helpText.includes('PBAoE')) areaType = 'PBAoE';
    else if (helpText.includes('Targeted') && helpText.includes('AoE')) areaType = 'Targeted AoE';
    else if (helpText.includes('AoE')) areaType = 'AoE';

    results[powerId] = {
      displayName,
      damageType: primaryDamageType || 'Unknown',
      effectArea: areaType,
      range: round(range, 1),
      radius: round(radius, 1),
      arc: round(arc, 1),
      maxTargets,
      activationTime: round(activationTime, 2),
      rechargeTime: round(rechargeTime, 1),
      damageScale: round(damageScale, 2),
      tableName: 'Ranged_Tempdamage',
      secondaryEffects: [...new Set(secondaryEffects)],
    };

    console.log(`  ${displayName}: ${primaryDamageType} scale=${damageScale} ${areaType} r=${radius} arc=${arc}`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// LORE EXTRACTION
// ============================================

/** Map entity def names to display-friendly pet types */
function petTypeFromEntityDef(entityDef) {
  const lower = entityDef.toLowerCase();
  if (lower.includes('boss')) return 'Boss';
  if (lower.includes('support')) return 'Support';
  if (lower.includes('_lt')) return 'Lieutenant';
  return 'Pet';
}

/** Extract faction name from power ID (e.g., 'arachnos_core_superior_ally' → 'Arachnos') */
function factionFromPowerId(powerId) {
  const factionMap = {
    arachnos: 'Arachnos', banished: 'Banished Pantheon', carnival: 'Carnival of Shadows',
    cimeroran: 'Cimeroran', clockwork: 'Clockwork', demons: 'Demons',
    elementals: 'Elementals', idf: 'IDF', knives: 'Knives of Artemis',
    lights: 'Lights', longbow: 'Longbow', nemesis: 'Nemesis',
    phantoms: 'Phantoms', rikti: 'Rikti', rularuu: 'Rularuu',
    seers: 'Seers', talons: 'Talons of Vengeance', tsoo: 'Tsoo',
    vanguard: 'Vanguard', warworks: 'War Works', drones: 'Drones',
  };
  for (const [key, name] of Object.entries(factionMap)) {
    if (powerId.includes(key)) return name;
  }
  return powerId.split('_')[0].charAt(0).toUpperCase() + powerId.split('_')[0].slice(1);
}

function extractLore() {
  console.log('\n=== LORE ===');
  const mainDir = path.join(RAW_BASE, 'lore');
  const results = {};

  for (const f of readDir(mainDir)) {
    const data = readJson(path.join(mainDir, f));
    if (!data) continue;

    const powerId = f.replace('.json', '');
    const displayName = data.display_name || powerId;
    const rechargeTime = data.recharge_time || 900;

    // Extract pets from Create_Entity templates and check for level shift grants
    const pets = [];
    let duration = 300;
    let levelShift = 0;
    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        const attrib = (t.attribs || [])[0];
        if (attrib === 'Create_Entity') {
          const entityDef = (t.params || {}).entity_def || '';
          if (entityDef) {
            pets.push(petTypeFromEntityDef(entityDef));
          }
          // Extract duration
          const durMatch = (t.duration || '').match(/([\d.]+)\s*seconds?/i);
          if (durMatch) duration = parseFloat(durMatch[1]);
        }
        // Check for level shift grant (via Lore_Silent.Level_Shift).
        // Cross-format detection: Parse7 tags Grant_Power, Parse6 leaves
        // attribs as Null but populates params.power_names.
        if (isGrantPowerTemplate(t)) {
          const pnames = [
            ...(t.power_names || []),
            ...((t.params && t.params.power_names) || []),
          ];
          if (pnames.some(p => p.includes('Level_Shift'))) {
            levelShift = 1;
          }
        }
      }
    }

    const faction = factionFromPowerId(powerId);

    results[powerId] = {
      displayName,
      faction,
      pets: pets.length > 0 ? pets : ['Unknown'],
      duration,
      rechargeTime: round(rechargeTime, 1),
      levelShift,
    };

    console.log(`  ${displayName}: ${faction} pets=[${pets.join(', ')}] ${duration}s/${rechargeTime}s`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// TYPESCRIPT CODE GENERATION
// ============================================

function generateTypeScript(alpha, destiny, hybrid, iface, judgement, lore) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * Incarnate Effects Data — Auto-generated from raw Homecoming server data`);
  lines.push(` *`);
  lines.push(` * Generated by: scripts/convert-incarnate-effects.cjs`);
  lines.push(` * Source: bin-crawler JSON export — exported_powers[/<dataset>]/incarnate/`);
  lines.push(` *`);
  lines.push(` * DO NOT EDIT MANUALLY — re-run the script to regenerate.`);
  lines.push(` * Imported by incarnate-effects.ts which provides typed interfaces and lookup functions.`);
  lines.push(` */`);
  lines.push('');

  // ---- ALPHA ----
  lines.push('// ============================================');
  lines.push('// ALPHA EFFECTS');
  lines.push('// ============================================');
  lines.push('// Enhancement bonuses (decimal values, e.g. 0.33 = 33%)');
  lines.push('// Values are the total of regular + ED-bypass portions.');
  lines.push('');
  lines.push('export const GENERATED_ALPHA_EFFECTS: Record<string, Record<string, number>> = {');
  for (const [id, data] of Object.entries(alpha)) {
    const obj = {};
    if (data.levelShift) obj.levelShift = data.levelShift;
    Object.assign(obj, data.enhancements);
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': ${JSON.stringify(obj)},`);
  }
  lines.push('};');
  lines.push('');

  // ---- DESTINY ----
  lines.push('// ============================================');
  lines.push('// DESTINY EFFECTS');
  lines.push('// ============================================');
  lines.push('// Peak stat bonuses (decimals). These diminish over the 120s duration.');
  lines.push('');
  lines.push('export const GENERATED_DESTINY_EFFECTS: Record<string, Record<string, number>> = {');
  for (const [id, data] of Object.entries(destiny)) {
    const obj = {};
    if (data.levelShift) obj.levelShift = data.levelShift;
    Object.assign(obj, data.peakEffects);
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': ${JSON.stringify(obj)},`);
  }
  lines.push('};');
  lines.push('');

  // ---- HYBRID ----
  lines.push('// ============================================');
  lines.push('// HYBRID EFFECTS');
  lines.push('// ============================================');
  lines.push('// Three-layer model: passive (always-on), frontLoaded (toggle baseline), perTarget (per enemy)');
  lines.push('');
  lines.push('export interface GeneratedHybridEffects {');
  lines.push('  tree: string;');
  lines.push('  passive: Record<string, number>;');
  lines.push('  frontLoaded: Record<string, number>;');
  lines.push('  perTarget: Record<string, number>;');
  lines.push('  maxTargets: number;');
  lines.push('  duration: number;');
  lines.push('  recharge: number;');
  lines.push('}');
  lines.push('');
  lines.push('export const GENERATED_HYBRID_EFFECTS: Record<string, GeneratedHybridEffects> = {');
  for (const [id, data] of Object.entries(hybrid)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': {`);
    lines.push(`    tree: '${data.tree}',`);
    lines.push(`    passive: ${JSON.stringify(data.passive)},`);
    lines.push(`    frontLoaded: ${JSON.stringify(data.frontLoaded)},`);
    lines.push(`    perTarget: ${JSON.stringify(data.perTarget)},`);
    lines.push(`    maxTargets: ${data.maxTargets},`);
    lines.push(`    duration: ${data.duration},`);
    lines.push(`    recharge: ${data.recharge},`);
    lines.push(`  },`);
  }
  lines.push('};');
  lines.push('');

  // ---- INTERFACE ----
  lines.push('// ============================================');
  lines.push('// INTERFACE EFFECTS');
  lines.push('// ============================================');
  lines.push('// Proc-based debuffs applied to enemies. For display, not dashboard stats.');
  lines.push('');
  lines.push('export const GENERATED_INTERFACE_EFFECTS: Record<string, {');
  lines.push('  debuffType: string | null;');
  lines.push('  debuffMagnitude: number;');
  lines.push('  debuffDuration: number;');
  lines.push('  dotType: string | null;');
  lines.push('  dotDamage: number;');
  lines.push('  dotDuration: number;');
  lines.push('  dotTableName: string;');
  lines.push('  procChance: number;');
  lines.push('}> = {');
  for (const [id, data] of Object.entries(iface)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': ${JSON.stringify({
      debuffType: data.debuffType,
      debuffMagnitude: data.debuffMagnitude,
      debuffDuration: data.debuffDuration,
      dotType: data.dotType,
      dotDamage: data.dotDamage,
      dotDuration: data.dotDuration,
      dotTableName: data.dotTableName,
      procChance: data.procChance,
    })},`);
  }
  lines.push('};');
  lines.push('');

  // ---- JUDGEMENT ----
  lines.push('// ============================================');
  lines.push('// JUDGEMENT EFFECTS');
  lines.push('// ============================================');
  lines.push('// Click attack powers. For display, not dashboard stats.');
  lines.push('');
  lines.push('export const GENERATED_JUDGEMENT_EFFECTS: Record<string, {');
  lines.push('  damageType: string;');
  lines.push('  effectArea: string;');
  lines.push('  range: number;');
  lines.push('  radius: number;');
  lines.push('  arc: number;');
  lines.push('  maxTargets: number;');
  lines.push('  activationTime: number;');
  lines.push('  rechargeTime: number;');
  lines.push('  damageScale: number;');
  lines.push('  tableName: string;');
  lines.push('  secondaryEffects: string[];');
  lines.push('}> = {');
  for (const [id, data] of Object.entries(judgement)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': ${JSON.stringify(data).replace(/"displayName":"[^"]*",?/, '')},`);
  }
  lines.push('};');
  lines.push('');

  // ---- LORE ----
  lines.push('// ============================================');
  lines.push('// LORE EFFECTS');
  lines.push('// ============================================');
  lines.push('// Pet summoning powers. For display, not dashboard stats.');
  lines.push('');
  lines.push('export const GENERATED_LORE_EFFECTS: Record<string, {');
  lines.push('  faction: string;');
  lines.push('  pets: string[];');
  lines.push('  duration: number;');
  lines.push('  rechargeTime: number;');
  lines.push('  levelShift: number;');
  lines.push('}> = {');
  for (const [id, data] of Object.entries(lore)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': ${JSON.stringify({
      faction: data.faction,
      pets: data.pets,
      duration: data.duration,
      rechargeTime: data.rechargeTime,
      levelShift: data.levelShift || 0,
    })},`);
  }
  lines.push('};');
  lines.push('');

  return lines.join('\n');
}

// ============================================
// MAIN
// ============================================

function main() {
  console.log('Extracting incarnate effects from raw data...');
  console.log(`Source: ${RAW_BASE}`);

  if (!fs.existsSync(RAW_BASE)) {
    console.error(`ERROR: Raw data directory not found: ${RAW_BASE}`);
    process.exit(1);
  }

  const alpha = extractAlpha();
  const destiny = extractDestiny();
  const hybrid = extractHybrid();
  const iface = extractInterface();
  const judgement = extractJudgement();
  const lore = extractLore();

  const output = generateTypeScript(alpha, destiny, hybrid, iface, judgement, lore);

  if (DRY_RUN) {
    console.log('\n=== DRY RUN — would write to:', OUTPUT_FILE);
    console.log(`=== Output size: ${output.length} characters, ${output.split('\n').length} lines`);
  } else {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    console.log(`\nWrote ${output.split('\n').length} lines to ${OUTPUT_FILE}`);
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`  Alpha:     ${Object.keys(alpha).length} powers`);
  console.log(`  Destiny:   ${Object.keys(destiny).length} powers`);
  console.log(`  Hybrid:    ${Object.keys(hybrid).length} powers`);
  console.log(`  Interface: ${Object.keys(iface).length} powers`);
  console.log(`  Judgement: ${Object.keys(judgement).length} powers`);
  console.log(`  Lore:      ${Object.keys(lore).length} powers`);
}

main();
