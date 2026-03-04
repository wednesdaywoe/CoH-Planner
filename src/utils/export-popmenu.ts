/**
 * Popmenu (.mnu) export for CoH test server
 *
 * Generates a .mnu file that can be placed in the game's
 * data/texts/English/Menus/ folder and used with /popmenu <name>
 * to grant all build enhancements on the test server.
 */

import type { Build, Enhancement } from '@/types';
import type { IOSetEnhancement, GenericIOEnhancement } from '@/types/enhancement';
import { getIOSet } from '@/data';

// ============================================
// STAT NAME MAPPING (app stat → popmenu name)
// ============================================

const STAT_TO_POPMENU: Record<string, string> = {
  'Damage': 'Damage',
  'Accuracy': 'Accuracy',
  'Recharge': 'Recharge',
  'EnduranceReduction': 'Endurance_Discount',
  'Range': 'Range',
  'Defense': 'Defense_Buff',
  'Defense Debuff': 'Defense_Debuff',
  'Resistance': 'Res_Damage',
  'Healing': 'Heal',
  'ToHit': 'ToHit_Buff',
  'ToHit Debuff': 'ToHit_Debuff',
  'Hold': 'Hold',
  'Stun': 'Stun',
  'Immobilize': 'Immob',
  'Sleep': 'Sleep',
  'Confuse': 'Confuse',
  'Fear': 'Fear',
  'Knockback': 'Knockback',
  'Run Speed': 'Run_Speed',
  'Jump': 'Jump',
  'Fly': 'Flight',
  'Slow': 'Slow',
  'Taunt': 'Taunt',
  'EnduranceModification': 'EndMod',
  'Interrupt': 'Interrupt',
};

// ============================================
// HELPERS
// ============================================

/** Convert a set ID like "force_feedback" to PascalCase "Force_Feedback" */
function toPascalUnderscore(setId: string): string {
  return setId
    .split('_')
    .map((seg) =>
      // Handle hyphens within segments: "fire-control" → "FireControl"
      seg.split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
    )
    .join('_');
}

/** Convert piece number (1-6) to letter (A-F) */
function pieceToLetter(num: number): string {
  return String.fromCharCode(64 + num); // 65='A', so 1→'A', 2→'B', etc.
}

// Max boost commands per Option line (game has a command length limit)
const MAX_BOOSTS_PER_OPTION = 70;

// ============================================
// ENHANCEMENT → BOOST COMMAND
// ============================================

/**
 * Convert an Enhancement object to a boost command string.
 * Returns null for unsupported enhancement types.
 */
function enhancementToBoostCmd(enh: Enhancement): string | null {
  switch (enh.type) {
    case 'io-set': {
      const ioSet = enh as IOSetEnhancement;
      const pascal = toPascalUnderscore(ioSet.setId);
      const letter = pieceToLetter(ioSet.pieceNum);
      const setDef = getIOSet(ioSet.setId);
      const isAto = setDef?.category === 'ato';
      const isEvent = setDef?.category === 'event';

      let prefix: string;
      if (isAto || isEvent) {
        // ATOs and event sets don't have crafted versions — always attuned
        prefix = ioSet.setId.startsWith('superior_') ? 'Superior_Attuned_' : 'Attuned_';
      } else if (!ioSet.attuned) {
        prefix = 'Crafted_';
      } else if (setDef?.category === 'purple' || ioSet.setId.startsWith('superior_')) {
        prefix = 'Superior_Attuned_';
      } else {
        prefix = 'Attuned_';
      }

      const uid = `${prefix}${pascal}_${letter}`;
      const level = ioSet.attuned ? 50 : (ioSet.level || 50);
      return `boost ${uid} ${uid} ${level}`;
    }

    case 'io-generic': {
      const generic = enh as GenericIOEnhancement;
      const statName = STAT_TO_POPMENU[generic.stat] || generic.stat;
      const uid = `Crafted_${statName}`;
      const level = generic.level || 50;
      return `boost ${uid} ${uid} ${level}`;
    }

    // Origin and special enhancements can't be granted via boost command
    default:
      return null;
  }
}

// ============================================
// FULL POPMENU GENERATION
// ============================================

/**
 * Collect all non-null enhancements from a build
 */
function collectEnhancements(build: Build): Enhancement[] {
  const enhancements: Enhancement[] = [];

  const processSlots = (slots: (Enhancement | null)[]) => {
    for (const slot of slots) {
      if (slot) enhancements.push(slot);
    }
  };

  for (const power of build.primary.powers) processSlots(power.slots);
  for (const power of build.secondary.powers) processSlots(power.slots);
  for (const pool of build.pools) {
    for (const power of pool.powers) processSlots(power.slots);
  }
  if (build.epicPool) {
    for (const power of build.epicPool.powers) processSlots(power.slots);
  }
  for (const power of build.inherents) processSlots(power.slots);

  return enhancements;
}

/**
 * Generate a .mnu popmenu file from a build.
 *
 * @param build - The build to export
 * @param menuName - Name for the popmenu (used with /popmenu <name> in-game)
 * @returns The complete .mnu file content
 */
export function generatePopmenu(build: Build, menuName: string): string {
  const enhancements = collectEnhancements(build);
  const boostCmds = enhancements
    .map(enhancementToBoostCmd)
    .filter((cmd): cmd is string => cmd !== null);

  if (boostCmds.length === 0) {
    return `// No exportable enhancements found in build\n`;
  }

  // Split into chunks for multiple Option lines
  const chunks: string[][] = [];
  for (let i = 0; i < boostCmds.length; i += MAX_BOOSTS_PER_OPTION) {
    chunks.push(boostCmds.slice(i, i + MAX_BOOSTS_PER_OPTION));
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const lines: string[] = [];
  lines.push(`// Generated by CoH Planner - ${dateStr}`);
  lines.push(`// Open the menu in game: /popmenu ${menuName}`);
  lines.push('');
  lines.push(`Menu "${menuName}"`);
  lines.push('{');
  lines.push('\tTitle "Test build"');
  lines.push('\tDIVIDER');

  for (let i = 0; i < chunks.length; i++) {
    const label = chunks.length === 1
      ? 'Give enhancements'
      : `Give enhancements (part ${i + 1})`;
    const cmdString = chunks[i].join('$$');
    lines.push(`\tOption "${label}" "${cmdString}"`);
  }

  lines.push('\tDIVIDER');
  lines.push('\tLockedOption');
  lines.push('\t{');
  lines.push('\t\tDisplayName "CoH Planner"');
  lines.push('\t\tBadge "X"');
  lines.push('\t}');
  lines.push('\tLockedOption');
  lines.push('\t{');
  lines.push(`\t\tDisplayName "Generated: ${dateStr}"`);
  lines.push('\t\tBadge "X"');
  lines.push('\t}');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}
