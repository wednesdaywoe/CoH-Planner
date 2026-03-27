/**
 * Calculation Debug Logger
 *
 * Verbose console output system for scrutinizing the calculation pipeline.
 * Enable via browser console: window.cohDebug.enable()
 * Disable: window.cohDebug.disable()
 * Status: window.cohDebug.status()
 *
 * When enabled, every call to calculateCharacterTotals() prints a detailed
 * trace of every calculation step — set bonuses, AT table lookups, enhancement
 * values, active power effects, procs, inherents, and final stats.
 */

const STORAGE_KEY = 'coh-calc-debug';

// Colors for console output
const C = {
  header: 'color: #60a5fa; font-weight: bold; font-size: 13px',
  step: 'color: #34d399; font-weight: bold',
  label: 'color: #fbbf24',
  value: 'color: #f9fafb',
  dim: 'color: #9ca3af',
  warn: 'color: #f87171; font-weight: bold',
  power: 'color: #a78bfa; font-weight: bold',
  formula: 'color: #67e8f9; font-style: italic',
} as const;

let _enabled = false;

// Initialize from localStorage
try {
  _enabled = localStorage.getItem(STORAGE_KEY) === 'true';
} catch { /* SSR or storage unavailable */ }

/** Check if debug logging is currently enabled */
export function isCalcDebugEnabled(): boolean {
  return _enabled;
}

/** Enable debug logging */
export function enableCalcDebug(): void {
  _enabled = true;
  try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ }
  console.log('%c[CoH Debug] Calculation debug logging ENABLED. Totals will be traced on next recalc.', C.header);
}

/** Disable debug logging */
export function disableCalcDebug(): void {
  _enabled = false;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  console.log('%c[CoH Debug] Calculation debug logging DISABLED.', C.dim);
}

/** Print current status */
function statusCalcDebug(): void {
  console.log(`%c[CoH Debug] Logging is ${_enabled ? 'ENABLED' : 'DISABLED'}`, _enabled ? C.header : C.dim);
}

// ============================================
// LOGGING HELPERS
// ============================================

/** Start a collapsible group */
export function debugGroup(label: string, style = C.step): void {
  if (!_enabled) return;
  console.groupCollapsed(`%c${label}`, style);
}

/** Start an expanded group (for top-level) */
export function debugGroupOpen(label: string, style = C.header): void {
  if (!_enabled) return;
  console.group(`%c${label}`, style);
}

/** End a group */
export function debugGroupEnd(): void {
  if (!_enabled) return;
  console.groupEnd();
}

/** Log a labeled value */
export function debugLog(label: string, value?: unknown): void {
  if (!_enabled) return;
  if (value === undefined) {
    console.log(`%c${label}`, C.dim);
  } else {
    console.log(`%c${label}: %c${typeof value === 'number' ? formatNum(value) : value}`, C.label, C.value);
  }
}

/** Log a formula/expression */
export function debugFormula(expression: string): void {
  if (!_enabled) return;
  console.log(`%c  ${expression}`, C.formula);
}

/** Log a warning */
export function debugWarn(msg: string): void {
  if (!_enabled) return;
  console.log(`%c  WARNING: ${msg}`, C.warn);
}

/** Log a table */
export function debugTable(data: Record<string, unknown>[] | Record<string, unknown>): void {
  if (!_enabled) return;
  console.table(data);
}

/** Log power name as a sub-header */
export function debugPower(name: string): void {
  if (!_enabled) return;
  console.log(`%c  ${name}`, C.power);
}

// ============================================
// SPECIALIZED LOGGERS
// ============================================

/** Log the build context at the start of a calculation */
export function debugBuildContext(
  archetype: string,
  level: number,
  effectiveLevel: number,
  exemplarLevel: number | undefined,
  options: Record<string, unknown>
): void {
  if (!_enabled) return;
  debugGroupOpen('CoH Sidekick — Calculation Debug Trace');
  debugGroup('Build Context');
  debugLog('Archetype', archetype);
  debugLog('Build Level', level);
  debugLog('Effective Level', effectiveLevel);
  if (exemplarLevel !== undefined) debugLog('Exemplar Level', exemplarLevel);
  const relevantOpts = Object.entries(options).filter(([, v]) => v !== undefined && v !== false && v !== 0);
  if (relevantOpts.length > 0) {
    debugLog('Options', Object.fromEntries(relevantOpts));
  }
  debugGroupEnd();
}

/** Log set bonus results */
export function debugSetBonuses(
  aggregated: Record<string, number>,
  trackingStats: { stat: string; count: number; capped: number }[]
): void {
  if (!_enabled) return;
  debugGroup('Step 1-3: Set Bonuses (Rule of 5)');
  const nonZero = Object.entries(aggregated).filter(([, v]) => v !== 0);
  if (nonZero.length === 0) {
    debugLog('No set bonuses active');
  } else {
    const tableData = nonZero.map(([stat, val]) => ({ Stat: stat, Bonus: `${formatNum(val)}%` }));
    debugTable(tableData);
  }
  const cappedEntries = trackingStats.filter(s => s.capped > 0);
  if (cappedEntries.length > 0) {
    debugGroup('Rule of 5 Caps Hit');
    for (const entry of cappedEntries) {
      debugLog(`${entry.stat}: ${entry.count} active, ${entry.capped} capped`);
    }
    debugGroupEnd();
  }
  debugGroupEnd();
}

/** Log alpha incarnate bonuses */
export function debugAlphaBonuses(bonuses: Record<string, number | undefined>): void {
  if (!_enabled) return;
  const nonZero = Object.entries(bonuses).filter(([, v]) => v !== undefined && v !== 0);
  if (nonZero.length === 0) return;
  debugGroup('Step 5: Alpha Incarnate Enhancement Bonuses');
  for (const [aspect, val] of nonZero) {
    debugLog(aspect, `+${formatNum((val as number) * 100)}%`);
  }
  debugGroupEnd();
}

/** Log fitness power contributions */
export function debugFitnessPower(
  name: string,
  effects: { stat: string; base: number; enhanced: number; enhBonus: number }[]
): void {
  if (!_enabled) return;
  debugGroup(`${name}`);
  for (const e of effects) {
    debugFormula(`${e.stat}: ${formatNum(e.base)}% base × (1 + ${formatNum(e.enhBonus * 100)}% enh) = ${formatNum(e.enhanced)}%`);
  }
  debugGroupEnd();
}

/** Log a single active power's contributions */
export function debugActivePower(
  name: string,
  contributions: { stat: string; value: number; formula: string }[]
): void {
  if (!_enabled) return;
  if (contributions.length === 0) return;
  debugGroup(`${name}`);
  for (const c of contributions) {
    debugFormula(`${c.stat}: ${c.formula} = ${formatNum(c.value)}%`);
  }
  debugGroupEnd();
}

/** Log a resolveScaledEffect call */
export function debugScaledEffect(
  context: string,
  effect: { scale: number; table?: string } | number,
  archetypeId: string,
  level: number,
  tableValue: number | undefined,
  result: number
): void {
  if (!_enabled) return;
  if (typeof effect === 'number') {
    debugFormula(`${context}: plain value ${formatNum(effect)}`);
  } else if (effect.table) {
    const tv = tableValue !== undefined ? formatNum(tableValue) : 'NOT FOUND (fallback 0.10)';
    debugFormula(`${context}: scale ${formatNum(effect.scale)} × ${effect.table}[${archetypeId}, lvl ${level}] (=${tv}) = ${formatNum(result)}`);
  } else {
    debugFormula(`${context}: scale ${formatNum(effect.scale)} (no table) = ${formatNum(result)}`);
  }
}

/** Log proc contributions */
export function debugProc(name: string, category: string, value: number, details?: string): void {
  if (!_enabled) return;
  debugFormula(`${name}: ${category} +${formatNum(value)}%${details ? ` (${details})` : ''}`);
}

/** Log accolade contributions */
export function debugAccolade(name: string, stat: string, value: number): void {
  if (!_enabled) return;
  debugFormula(`${name}: ${stat} +${formatNum(value)}`);
}

/** Log incarnate contributions */
export function debugIncarnateStat(name: string, stat: string, value: number): void {
  if (!_enabled) return;
  debugFormula(`${name}: ${stat} +${formatNum(value)}%`);
}

/** Log hit chance calculation */
export function debugHitChance(
  targetOffset: number,
  levelShift: number,
  effectiveDiff: number,
  baseToHit: number,
  toHitBonus: number,
  accuracy: number,
  finalHitChance: number
): void {
  if (!_enabled) return;
  debugGroup('Step 9.5: Hit Chance (Purple Patch)');
  debugLog('Target Level Offset', `+${targetOffset}`);
  debugLog('Level Shift', levelShift);
  debugLog('Effective Level Diff', effectiveDiff);
  debugFormula(`baseToHit = ${formatNum(baseToHit * 100)}%`);
  const ftVal = Math.min(95, Math.max(5, baseToHit * 100 + toHitBonus));
  debugFormula(`finalToHit = min(95%, max(5%, ${formatNum(baseToHit * 100)}% + ${formatNum(toHitBonus)}%)) = ${formatNum(ftVal)}%`);
  debugFormula(`hitChance = finalToHit * (1 + ${formatNum(accuracy)}% acc) = ${formatNum(finalHitChance * 100)}%`);
  debugGroupEnd();
}

/** Log the final global bonuses summary */
export function debugFinalStats(global: Record<string, number>): void {
  if (!_enabled) return;
  debugGroup('Step 10: Final Global Bonuses');
  const nonZero = Object.entries(global)
    .filter(([k, v]) => v !== 0 && k !== 'baseToHit' && k !== 'hitChance' && k !== 'combatModifier');
  const tableData = nonZero.map(([stat, val]) => ({
    Stat: stat,
    Value: isPercentStat(stat) ? `${formatNum(val)}%` : formatNum(val),
  }));
  if (tableData.length > 0) {
    debugTable(tableData);
  }
  debugGroupEnd();
}

/** Log net endurance calculation */
export function debugNetEndurance(
  maxEnd: number,
  recoveryMod: number,
  recoveryEndPerSec: number,
  toggleCost: number,
  endDiscount: number,
  netEndPerSec: number
): void {
  if (!_enabled) return;
  debugGroup('Endurance Budget');
  debugFormula(`maxEnd = 100 × (1 + ${formatNum(recoveryMod)}%) = ${formatNum(maxEnd)}`);
  debugFormula(`recovery/sec = (${formatNum(maxEnd)} / 60) × (1 + ${formatNum(recoveryMod)}%) = ${formatNum(recoveryEndPerSec)}/sec`);
  if (endDiscount > 0) {
    debugFormula(`toggle cost (after ${formatNum(endDiscount)}% discount) = ${formatNum(toggleCost)}/sec`);
  } else {
    debugFormula(`toggle cost = ${formatNum(toggleCost)}/sec`);
  }
  debugFormula(`net end/sec = ${formatNum(recoveryEndPerSec)} - ${formatNum(toggleCost)} = ${formatNum(netEndPerSec)}/sec`);
  debugGroupEnd();
}

/** Close the top-level group */
export function debugEnd(): void {
  if (!_enabled) return;
  debugGroupEnd();
}

// ============================================
// UTILITIES
// ============================================

function formatNum(n: number): string {
  return Number.isInteger(n) ? n.toString() : n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

function isPercentStat(stat: string): boolean {
  // Most stats are percentages, except absolute values
  const absoluteStats = ['toggleEndCost', 'netEndPerSec', 'stealthRadiusPvE', 'stealthRadiusPvP',
    'perceptionRadius', 'levelShift', 'maxEndurance', 'baseToHit', 'hitChance', 'combatModifier'];
  return !absoluteStats.includes(stat);
}

// ============================================
// WINDOW GLOBAL REGISTRATION
// ============================================

interface CohDebugAPI {
  enable: () => void;
  disable: () => void;
  status: () => void;
}

declare global {
  interface Window {
    cohDebug: CohDebugAPI;
  }
}

// Register on window immediately
if (typeof window !== 'undefined') {
  window.cohDebug = {
    enable: enableCalcDebug,
    disable: disableCalcDebug,
    status: statusCalcDebug,
  };

  // Show a subtle hint on first load if not already enabled
  if (!_enabled) {
    console.log(
      '%c[CoH Sidekick] Calculation debug logging available. Run %cwindow.cohDebug.enable()%c to trace all math.',
      'color: #9ca3af',
      'color: #60a5fa; font-weight: bold',
      'color: #9ca3af'
    );
  }
}
