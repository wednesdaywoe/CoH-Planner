/**
 * Accolades Data
 *
 * Accolades are special permanent passive powers that provide stat bonuses.
 * They are typically earned through completing specific content in-game.
 */

import type { Accolade } from '@/types';

// ============================================
// ACCOLADES REGISTRY
// ============================================

export const ACCOLADES: Accolade[] = [
  {
    id: 'atlas_medallion',
    name: 'The Atlas Medallion',
    description: '+5 Max Endurance',
    icon: 'accolade_atlas.png',
    bonuses: [{ stat: 'maxEndurance', value: 5 }],
  },
  {
    id: 'freedom_phalanx',
    name: 'Freedom Phalanx Reserve',
    description: '+10% Max Health',
    icon: 'accolade_freedom.png',
    bonuses: [{ stat: 'maxHP', value: 10 }],
  },
  {
    id: 'task_force_commander',
    name: 'Task Force Commander',
    description: '+5% Max Health',
    icon: 'accolade_taskforce.png',
    bonuses: [{ stat: 'maxHP', value: 5 }],
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
