/**
 * Accolades Data
 *
 * Accolades are special permanent passive powers that provide stat bonuses.
 * They are typically earned through completing specific content in-game.
 *
 * This table is a HAND TRANSCRIPTION of powers the game data already carries — each entry
 * here is `Temporary_Powers.Accolades.<InternalName>`, an ordinary auto-on Self power whose
 * atoms the engine reads straight out of the contract. The transcription is therefore only a
 * label: what the totals actually apply is the power's own `MaxHP` / `MaxEndurance` atoms.
 * `accolades.test.ts` grades every row below against what the engine really applies, so the
 * two cannot drift — it is what caught the two rows corrected on 2026-07-26 (Marshall's
 * phantom +5% Max Health, Born In Battle's dropped +5% Max Health) and the `excludes` pairing
 * those two errors had crossed.
 *
 * `excludes` pairs each accolade with its opposite-faction twin — the hero and villain powers
 * that carry the SAME effect under opposite `activateRequires` gates (`type char> hero eq` /
 * `… villain eq`). Pair by effect, never by earn-order or theme.
 */

import type { Accolade } from '@/types';

// ============================================
// ACCOLADES REGISTRY
// ============================================

export const ACCOLADES: Accolade[] = [
  {
    id: 'the_atlas_medallion',
    name: 'The Atlas Medallion',
    description: '+5 Max Endurance',
    icon: 'accolade_atlas.png',
    bonuses: [{ stat: 'maxEndurance', value: 5 }],
    excludes: 'marshall',
  },
  {
    id: 'freedom_phalanx_reserve',
    name: 'Freedom Phalanx Reserve',
    description: '+10% Max Health',
    icon: 'accolade_freedom.png',
    bonuses: [{ stat: 'maxHP', value: 10 }],
    excludes: 'high_pain_threshold',
  },
  {
    id: 'task_force_commander',
    name: 'Task Force Commander',
    description: '+5% Max Health',
    icon: 'accolade_taskforce.png',
    bonuses: [{ stat: 'maxHP', value: 5 }],
    excludes: 'invader',
  },
  {
    id: 'portal_jockey',
    name: 'Portal Jockey',
    description: '+5% Max Health, +5 Max Endurance',
    icon: 'accolade_portal.png',
    bonuses: [
      { stat: 'maxHP', value: 5 },
      { stat: 'maxEndurance', value: 5 },
    ],
    excludes: 'born_in_battle',
  },
  // Villain-side equivalents
  {
    id: 'born_in_battle',
    name: 'Born in Battle',
    // The villain twin of Portal Jockey (`MaxHP 0.5` + `MaxEndurance 5`), not of Atlas
    // Medallion. The transcription dropped its +5% Max Health entirely.
    description: '+5% Max Health, +5 Max Endurance',
    icon: 'accolade_born.png',
    bonuses: [
      { stat: 'maxHP', value: 5 },
      { stat: 'maxEndurance', value: 5 },
    ],
    excludes: 'portal_jockey',
  },
  {
    id: 'high_pain_threshold',
    name: 'High Pain Threshold',
    description: '+10% Max Health',
    icon: 'accolade_highpain.png',
    bonuses: [{ stat: 'maxHP', value: 10 }],
    excludes: 'freedom_phalanx_reserve',
  },
  {
    id: 'invader',
    name: 'Invader',
    description: '+5% Max Health',
    icon: 'accolade_invader.png',
    bonuses: [{ stat: 'maxHP', value: 5 }],
    excludes: 'task_force_commander',
  },
  {
    id: 'marshall',
    name: 'Marshall',
    // The villain twin of Atlas Medallion (`MaxEndurance 5` alone). The transcription gave it
    // a +5% Max Health the power's def does not carry.
    description: '+5 Max Endurance',
    icon: 'accolade_marshall.png',
    bonuses: [{ stat: 'maxEndurance', value: 5 }],
    excludes: 'the_atlas_medallion',
  },
];

// ============================================
// ACCESSOR FUNCTIONS
// ============================================

/**
 * Get all available accolades
 */
export function getAccolades(): Accolade[] {
  return ACCOLADES;
}

/**
 * Get an accolade by ID
 */
export function getAccolade(id: string): Accolade | undefined {
  return ACCOLADES.find((a) => a.id === id);
}
