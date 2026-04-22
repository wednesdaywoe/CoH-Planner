/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { TyphoonsEdge as TyphoonsEdge } from './aoe-bridge';
import { BlindingFeint as BlindingFeint } from './follow-up';
import { OneThousandCuts as OneThousandCuts } from './high-low';
import { NimbleSlash as NimbleSlash } from './light-opening';
import { AblatingStrike as AblatingStrike } from './moderate-bridge';
import { PowerSlice as PowerSlice } from './moderate-opening';
import { VengefulSlice as VengefulSlice } from './special-1';
import { SweepingStrike as SweepingStrike } from './special-2';
import { Confront as Confront } from './taunt';

export const powerset: Powerset = {
  id: 'scrapper/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    TyphoonsEdge,
    BlindingFeint,
    OneThousandCuts,
    NimbleSlash,
    AblatingStrike,
    PowerSlice,
    VengefulSlice,
    SweepingStrike,
    Confront,
  ],
};

export default powerset;
