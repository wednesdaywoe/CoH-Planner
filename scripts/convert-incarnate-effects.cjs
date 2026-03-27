#!/usr/bin/env node
/**
 * convert-incarnate-effects.cjs
 *
 * Extracts incarnate effects from raw Homecoming server data and generates
 * a TypeScript data file with correct values for all incarnate slots.
 *
 * Reads from: raw_data_homecoming-20251209_7415/powers/incarnate/
 *   - alpha/ + alpha_silent/       → Enhancement bonuses + level shift
 *   - destiny/ + destiny_silent/   → Click buffs with diminishing durations + level shift
 *   - hybrid/ + hybrid_silent/     → Passive + front-loaded + per-target toggle effects
 *   - interface/ + interface_silent/ → Proc debuffs on enemies
 *
 * Outputs: src/data/incarnate-effects-generated.ts
 *
 * Usage: node scripts/convert-incarnate-effects.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const RAW_BASE = path.join(__dirname, '..', 'raw_data_homecoming-20251209_7415', 'powers', 'incarnate');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'incarnate-effects-generated.ts');
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

/** Extract all "Incarnate.*Silent.*" references from a power's Grant_Power templates */
function extractGrantedPowers(data) {
  const grants = [];
  for (const eff of data.effects || []) {
    for (const t of eff.templates || []) {
      if ((t.attribs || []).includes('Grant_Power')) {
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

    // Extract level shift from main power
    let levelShift = 0;
    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        if ((t.attribs || []).includes('Level_Shift')) {
          levelShift = t.scale || 0;
        }
      }
    }

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

      // Get the first non-Set_Mode template's scale value
      // All attribs in the file share the same scale (e.g., all damage types get 0.11)
      for (const eff of silentData.effects || []) {
        for (const t of eff.templates || []) {
          const attrib = (t.attribs || [])[0];
          if (!attrib || attrib === 'Set_Mode') continue;
          const scale = t.scale || 0;
          if (scale === 0) continue;

          if (!enhancements[aspectKey]) enhancements[aspectKey] = 0;
          enhancements[aspectKey] = round(enhancements[aspectKey] + scale);
          break; // Only take the first value per silent file (all attribs same scale)
        }
        break; // Only first effect
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

    // Check for level shift from silent grants
    const grantedRefs = extractGrantedPowers(data);
    let levelShift = 0;
    for (const ref of grantedRefs) {
      const silentName = silentRefToFilename(ref);
      const silentData = silentCache[silentName];
      if (silentData) {
        for (const eff of silentData.effects || []) {
          for (const t of eff.templates || []) {
            if ((t.attribs || []).includes('Level_Shift')) {
              levelShift = t.scale || 0;
            }
          }
        }
      }
    }

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

        for (const attrib of attribs) {
          if (attrib === 'Grant_Power') {
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

function extractInterface() {
  console.log('\n=== INTERFACE ===');
  const mainDir = path.join(RAW_BASE, 'interface');
  const silentDir = path.join(RAW_BASE, 'interface_silent');
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

    // Interface powers grant proc effects to attacks
    // Extract the Global_Chance_Mod values (proc chances)
    const procs = [];
    const grantedRefs = extractGrantedPowers(data);

    for (const eff of data.effects || []) {
      for (const t of eff.templates || []) {
        if ((t.attribs || []).includes('Global_Chance_Mod')) {
          const chance = t.scale || 0;
          const pnames = t.power_names || [];
          for (const pn of pnames) {
            procs.push({ chance, ref: pn });
          }
          // If no power_names in this template, note the chance
          if (pnames.length === 0 && chance > 0) {
            procs.push({ chance, ref: 'unknown' });
          }
        }
      }
    }

    // Resolve proc effects from silent files
    const procEffects = [];
    for (const ref of grantedRefs) {
      const silentName = silentRefToFilename(ref);
      const silentData = silentCache[silentName];
      if (!silentData) continue;

      const effects = [];
      for (const eff of silentData.effects || []) {
        for (const t of eff.templates || []) {
          const attrib = (t.attribs || [])[0];
          const scale = t.scale || 0;
          const aspect = t.aspect || '';
          const target = t.target || '';
          const duration = t.duration || '';
          if (!attrib || scale === 0) continue;

          effects.push({
            attrib,
            scale: round(scale),
            aspect,
            target,
            duration,
          });
        }
      }

      if (effects.length > 0) {
        procEffects.push({ name: silentName, effects });
      }
    }

    results[powerId] = {
      displayName,
      procs,
      procEffects,
      grantedRefs,
    };

    console.log(`  ${displayName}: ${procs.length} proc triggers, ${procEffects.length} effect groups`);
  }

  console.log(`  Total: ${Object.keys(results).length} powers`);
  return results;
}

// ============================================
// TYPESCRIPT CODE GENERATION
// ============================================

function generateTypeScript(alpha, destiny, hybrid, iface) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * Incarnate Effects — Auto-generated from raw Homecoming server data`);
  lines.push(` *`);
  lines.push(` * Generated by: scripts/convert-incarnate-effects.cjs`);
  lines.push(` * Source: raw_data_homecoming-20251209_7415/powers/incarnate/`);
  lines.push(` *`);
  lines.push(` * DO NOT EDIT MANUALLY — re-run the script to regenerate.`);
  lines.push(` */`);
  lines.push('');

  // ---- ALPHA ----
  lines.push('// ============================================');
  lines.push('// ALPHA EFFECTS');
  lines.push('// ============================================');
  lines.push('');
  lines.push('export interface AlphaEffects {');
  lines.push('  /** Enhancement bonuses (decimal, e.g. 0.33 = 33%). Keys are enhancement aspect names. */');
  lines.push('  [aspect: string]: number | undefined;');
  lines.push('  levelShift?: number;');
  lines.push('}');
  lines.push('');
  lines.push('const ALPHA_EFFECTS: Record<string, AlphaEffects> = {');
  for (const [id, data] of Object.entries(alpha)) {
    const entries = [];
    if (data.levelShift) entries.push(`  levelShift: ${data.levelShift}`);
    for (const [aspect, value] of Object.entries(data.enhancements)) {
      entries.push(`  ${aspect}: ${value}`);
    }
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': {`);
    for (const e of entries) lines.push(`  ${e},`);
    lines.push(`  },`);
  }
  lines.push('};');
  lines.push('');

  // ---- DESTINY ----
  lines.push('// ============================================');
  lines.push('// DESTINY EFFECTS');
  lines.push('// ============================================');
  lines.push('');
  lines.push('export interface DestinyEffects {');
  lines.push('  levelShift?: number;');
  lines.push('  /** Peak stat bonuses (decimals). These diminish over the 120s duration. */');
  lines.push('  [stat: string]: number | undefined;');
  lines.push('}');
  lines.push('');
  lines.push('const DESTINY_EFFECTS: Record<string, DestinyEffects> = {');
  for (const [id, data] of Object.entries(destiny)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': {`);
    if (data.levelShift) lines.push(`    levelShift: ${data.levelShift},`);
    for (const [stat, value] of Object.entries(data.peakEffects)) {
      lines.push(`    ${stat}: ${value},`);
    }
    lines.push(`  },`);
  }
  lines.push('};');
  lines.push('');

  // ---- HYBRID ----
  lines.push('// ============================================');
  lines.push('// HYBRID EFFECTS');
  lines.push('// ============================================');
  lines.push('');
  lines.push('export interface HybridEffects {');
  lines.push('  tree: string;');
  lines.push('  /** Passive bonuses — always-on just by equipping (stat → decimal) */');
  lines.push('  passive: Record<string, number>;');
  lines.push('  /** Front-loaded bonuses — active when toggle is on, no enemies required (stat → decimal) */');
  lines.push('  frontLoaded: Record<string, number>;');
  lines.push('  /** Per-target bonuses — stacks per nearby enemy (stat → decimal per enemy) */');
  lines.push('  perTarget: Record<string, number>;');
  lines.push('  /** Maximum enemies for per-target stacking */');
  lines.push('  maxTargets: number;');
  lines.push('  duration: number;');
  lines.push('  recharge: number;');
  lines.push('}');
  lines.push('');
  lines.push('const HYBRID_EFFECTS: Record<string, HybridEffects> = {');
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
  lines.push('');
  lines.push('export interface InterfaceProc {');
  lines.push('  attrib: string;');
  lines.push('  scale: number;');
  lines.push('  aspect: string;');
  lines.push('  target: string;');
  lines.push('  duration: string;');
  lines.push('}');
  lines.push('');
  lines.push('export interface InterfaceEffects {');
  lines.push('  procs: Array<{ chance: number; ref: string }>;');
  lines.push('  procEffects: Array<{ name: string; effects: InterfaceProc[] }>;');
  lines.push('}');
  lines.push('');
  lines.push('const INTERFACE_EFFECTS: Record<string, InterfaceEffects> = {');
  for (const [id, data] of Object.entries(iface)) {
    lines.push(`  // ${data.displayName}`);
    lines.push(`  '${id}': {`);
    lines.push(`    procs: ${JSON.stringify(data.procs)},`);
    lines.push(`    procEffects: ${JSON.stringify(data.procEffects)},`);
    lines.push(`  },`);
  }
  lines.push('};');
  lines.push('');

  // ---- LOOKUP FUNCTIONS ----
  lines.push('// ============================================');
  lines.push('// LOOKUP FUNCTIONS');
  lines.push('// ============================================');
  lines.push('');
  lines.push('function normalizePowerId(powerId: string): string {');
  lines.push("  return powerId.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');");
  lines.push('}');
  lines.push('');
  lines.push('export function getAlphaEffects(powerId: string): AlphaEffects | null {');
  lines.push('  return ALPHA_EFFECTS[normalizePowerId(powerId)] || null;');
  lines.push('}');
  lines.push('');
  lines.push('export function getDestinyEffects(powerId: string): DestinyEffects | null {');
  lines.push('  return DESTINY_EFFECTS[normalizePowerId(powerId)] || null;');
  lines.push('}');
  lines.push('');
  lines.push('export function getHybridEffects(powerId: string): HybridEffects | null {');
  lines.push('  return HYBRID_EFFECTS[normalizePowerId(powerId)] || null;');
  lines.push('}');
  lines.push('');
  lines.push('export function getInterfaceEffects(powerId: string): InterfaceEffects | null {');
  lines.push('  return INTERFACE_EFFECTS[normalizePowerId(powerId)] || null;');
  lines.push('}');
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

  const output = generateTypeScript(alpha, destiny, hybrid, iface);

  if (DRY_RUN) {
    console.log('\n=== DRY RUN — would write to:', OUTPUT_FILE);
    console.log(`=== Output size: ${output.length} characters, ${output.split('\n').length} lines`);
  } else {
    fs.writeFileSync(OUTPUT_FILE, output, 'utf8');
    console.log(`\nWrote ${output.split('\n').length} lines to ${OUTPUT_FILE}`);
  }

  // Summary
  console.log('\n=== SUMMARY ===');
  console.log(`  Alpha:     ${Object.keys(alpha).length} powers`);
  console.log(`  Destiny:   ${Object.keys(destiny).length} powers`);
  console.log(`  Hybrid:    ${Object.keys(hybrid).length} powers`);
  console.log(`  Interface: ${Object.keys(iface).length} powers`);
}

main();
