/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { AssassinsBlades as AssassinsBlades } from './assassins-blades';
import { BuildUp as BuildUp } from './build-up';
import { OneThousandCuts as OneThousandCuts } from './high-low';
import { NimbleSlash as NimbleSlash } from './light-opening';
import { AblatingStrike as AblatingStrike } from './moderate-bridge';
import { PowerSlice as PowerSlice } from './moderate-opening';
import { Placate as Placate } from './placate';
import { VengefulSlice as VengefulSlice } from './special-1';
import { SweepingStrike as SweepingStrike } from './special-2';

export const powerset: Powerset = {
  id: 'stalker/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsBlades,
    BuildUp,
    OneThousandCuts,
    NimbleSlash,
    AblatingStrike,
    PowerSlice,
    Placate,
    VengefulSlice,
    SweepingStrike,
  ],
};

export default powerset;
