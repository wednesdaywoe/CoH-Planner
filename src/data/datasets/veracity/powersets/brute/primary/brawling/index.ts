/**
 * Brawling Powerset
 * undefined
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/brawling
 */

import type { Powerset } from '@/types';

import { InitialStrike as InitialStrike } from './initial-strike';
import { HeavyBlow as HeavyBlow } from './heavy-blow';
import { SweepingCross as SweepingCross } from './sweeping-cross';
import { CombatReadiness as CombatReadiness } from './combat-readiness';
import { ThroatStrike as ThroatStrike } from './throat-strike';
import { Taunt as Taunt } from './taunt';
import { SpinningStrike as SpinningStrike } from './spinning-strike';
import { LowKick as LowKick } from './low-kick';
import { CrushingUppercut as CrushingUppercut } from './crushing-uppercut';

export const powerset: Powerset = {
  id: 'brute/brawling',
  name: 'Brawling',
  description: 'undefined',
  icon: '',
  archetype: 'brute',
  category: 'primary',
  powers: [
    InitialStrike,
    HeavyBlow,
    SweepingCross,
    CombatReadiness,
    ThroatStrike,
    Taunt,
    SpinningStrike,
    LowKick,
    CrushingUppercut,
  ],
};

export default powerset;
