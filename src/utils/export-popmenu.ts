/**
 * Popmenu (.mnu) export for CoH test server
 *
 * Generates a .mnu file that can be placed in the game's
 * data/texts/English/Menus/ folder and used with /popmenu <name>
 * to grant all build enhancements on the test server.
 */

import type { Build, Enhancement } from '@/types';
import type { IOSetEnhancement, GenericIOEnhancement, SpecialEnhancement } from '@/types/enhancement';
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
  'Immobilize': 'Immobilize',
  'Sleep': 'Sleep',
  'Confuse': 'Confuse',
  'Fear': 'Fear',
  'Knockback': 'Knockback',
  'Run Speed': 'Run',
  'Jump': 'Jump',
  'Fly': 'Flight',
  'Slow': 'Slow',
  'Taunt': 'Taunt',
  'EnduranceModification': 'Recovery',
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

// ============================================
// SPECIAL ENHANCEMENT → BOOST UID MAPPING
// ============================================

/** Maps special enhancement id (e.g. "hamidon-nucleolus") to popmenu boost uid */
const SPECIAL_BOOST_UID: Record<string, string> = {
  // Hamidon
  'hamidon-nucleolus': 'Hamidon_Damage_Accuracy',
  'hamidon-centriole': 'Hamidon_Damage_Range',
  'hamidon-enzyme': 'Hamidon_DeBuff_Endurance_Discount',
  'hamidon-lysosome': 'Hamidon_DeBuff_Accuracy',
  'hamidon-membrane': 'Hamidon_Buff_Recharge',
  'hamidon-peroxisome': 'Hamidon_Damage_Mez',
  'hamidon-ribosome': 'Hamidon_Res_Damage_Endurance_Discount',
  'hamidon-golgi': 'Hamidon_Heal_Endurance_Discount',
  'hamidon-endoplasm': 'Hamidon_Accuracy_Mez',
  'hamidon-cytoskeleton': 'Hamidon_Buff_Endurance_Discount',
  'hamidon-microfilament': 'Hamidon_Travel_Endurance_Discount',
  'hamidon-vesicle': 'Hamidon_Endurance_Modification_Recharge',
  'hamidon-stereocilia': 'Hamidon_Slow_Recharge_Endurance_Discount',
  'hamidon-microtubule': 'Hamidon_Endurance_Modification_Accuracy',
  'hamidon-karyoplasm': 'Hamidon_Damage_Endurance_Discount',
  'hamidon-microvillus': 'Hamidon_Accuracy_Range',
  'hamidon-chromatin': 'Hamidon_Damage_Recharge',
  'hamidon-ectosome': 'Hamidon_Threat_Accuracy_Recharge',
  'hamidon-amyloplast': 'Hamidon_Heal_Recharge',
  'hamidon-chloroplast': 'Hamidon_Heal_Accuracy',

  // Hydra
  'hydra-antiproton': 'Hydra_DeBuff_Endurance_Discount',
  'hydra-delta': 'Hydra_DeBuff_Accuracy',
  'hydra-electron': 'Hydra_Res_Damage_Endurance_Discount',
  'hydra-gluon': 'Hydra_Damage_Mez',
  'hydra-graviton': 'Hydra_Accuracy_Mez',
  'hydra-neutrino': 'Hydra_Damage_Accuracy',
  'hydra-neutron': 'Hydra_Damage_Range',
  'hydra-positron': 'Hydra_Heal_Endurance_Discount',
  'hydra-proton': 'Hydra_Buff_Endurance_Discount',
  'hydra-quark': 'Hydra_Buff_Recharge',
  'hydra-theta': 'Hydra_Travel_Endurance_Discount',

  // Titan
  'titan-amethyst': 'Titan_Damage_Mez',
  'titan-calcite': 'Titan_Accuracy_Mez',
  'titan-citrine': 'Titan_Buff_Recharge',
  'titan-diamond': 'Titan_Damage_Accuracy',
  'titan-gypsum': 'Titan_DeBuff_Accuracy',
  'titan-kyanite': 'Titan_Heal_Endurance_Discount',
  'titan-peridont': 'Titan_Res_Damage_Endurance_Discount',
  'titan-quartz': 'Titan_Damage_Range',
  'titan-selenite': 'Titan_Travel_Endurance_Discount',
  'titan-tanzanite': 'Titan_Buff_Endurance_Discount',
  'titan-zeolite': 'Titan_DeBuff_Endurance_Discount',

  // D-Sync
  'd-sync-acceleration': 'DSync_Travel_Endurance_Discount',
  'd-sync-binding': 'DSync_Accuracy_Mez',
  'd-sync-conduit': 'DSync_Endurance_Modification_Recharge',
  'd-sync-containment': 'DSync_Damage_Mez',
  'd-sync-deceleration': 'DSync_Slow_Recharge_Endurance_Discount',
  'd-sync-drain': 'DSync_Endurance_Modification_Accuracy',
  'd-sync-efficiency': 'DSync_Damage_Endurance_Discount',
  'd-sync-elusivity': 'DSync_Buff_Endurance_Discount',
  'd-sync-empowerment': 'DSync_Damage_Accuracy',
  'd-sync-extension': 'DSync_Damage_Range',
  'd-sync-fortification': 'DSync_Res_Damage_Endurance_Discount',
  'd-sync-guidance': 'DSync_Accuracy_Range',
  'd-sync-marginalization': 'DSync_DeBuff_Endurance_Discount',
  'd-sync-obfuscation': 'DSync_DeBuff_Accuracy',
  'd-sync-optimization': 'DSync_Damage_Recharge',
  'd-sync-provocation': 'DSync_Threat_Accuracy_Recharge',
  'd-sync-reconstitution': 'DSync_Heal_Endurance_Discount',
  'd-sync-reconstruction': 'DSync_Heal_Recharge',
  'd-sync-shifting': 'DSync_Buff_Recharge',
  'd-sync-siphon': 'DSync_Heal_Accuracy',
};

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
      const letter = pieceToLetter(ioSet.pieceNum);
      const setDef = getIOSet(ioSet.setId);
      const isAto = setDef?.category === 'ato';
      const isEvent = setDef?.category === 'event';
      const isSuperior = ioSet.setId.startsWith('superior_');

      let prefix: string;
      if (isAto || isEvent) {
        // ATOs and event sets don't have crafted versions — always attuned
        prefix = isSuperior ? 'Superior_Attuned_' : 'Attuned_';
      } else if (!ioSet.attuned) {
        prefix = 'Crafted_';
      } else if (setDef?.category === 'purple' || isSuperior) {
        prefix = 'Superior_Attuned_';
      } else {
        prefix = 'Attuned_';
      }

      // Strip "superior_" from setId when prefix already includes "Superior_"
      const baseId = isSuperior ? ioSet.setId.slice('superior_'.length) : ioSet.setId;
      const pascal = toPascalUnderscore(baseId);

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

    case 'special': {
      const special = enh as SpecialEnhancement;
      const uid = SPECIAL_BOOST_UID[special.id];
      if (!uid) return null;
      return `boost ${uid} ${uid} 50`;
    }

    // Origin enhancements can't be granted via boost command
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
  lines.push(`// Generated by Sidekick - ${dateStr}`);
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
  lines.push('\t\tDisplayName "Sidekick"');
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
