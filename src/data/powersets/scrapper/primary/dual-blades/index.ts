/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { NimbleSlash as NimbleSlash } from './nimble-slash';
import { PowerSlice as PowerSlice } from './power-slice';
import { AblatingStrike as AblatingStrike } from './ablating-strike';
import { TyphoonsEdge as TyphoonsEdge } from './typhoon-s-edge';
import { BlindingFeint as BlindingFeint } from './blinding-feint';
import { Confront as Confront } from './confront';
import { VengefulSlice as VengefulSlice } from './vengeful-slice';
import { SweepingStrike as SweepingStrike } from './sweeping-strike';
import { OneThousandCuts as OneThousandCuts } from './one-thousand-cuts';

export const powerset: Powerset = {
  id: 'scrapper/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    NimbleSlash,
    PowerSlice,
    AblatingStrike,
    TyphoonsEdge,
    BlindingFeint,
    Confront,
    VengefulSlice,
    SweepingStrike,
    OneThousandCuts,
  ],
};

export default powerset;
