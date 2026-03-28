/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { NimbleSlash as NimbleSlash } from './light-opening';
import { PowerSlice as PowerSlice } from './moderate-opening';
import { AblatingStrike as AblatingStrike } from './moderate-bridge';
import { TyphoonsEdge as TyphoonsEdge } from './aoe-bridge';
import { BlindingFeint as BlindingFeint } from './follow-up';
import { Taunt as Taunt } from './taunt';
import { VengefulSlice as VengefulSlice } from './special-1';
import { SweepingStrike as SweepingStrike } from './special-2';
import { OneThousandCuts as OneThousandCuts } from './high-low';

export const powerset: Powerset = {
  id: 'brute/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    NimbleSlash,
    PowerSlice,
    AblatingStrike,
    TyphoonsEdge,
    BlindingFeint,
    Taunt,
    VengefulSlice,
    SweepingStrike,
    OneThousandCuts,
  ],
};

export default powerset;
