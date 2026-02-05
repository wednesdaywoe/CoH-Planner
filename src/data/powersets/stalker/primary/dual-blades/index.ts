/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { NimbleSlash as NimbleSlash } from './nimble-slash';
import { PowerSlice as PowerSlice } from './power-slice';
import { AblatingStrike as AblatingStrike } from './ablating-strike';
import { AssassinsBlades as AssassinsBlades } from './assassin-s-blades';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { VengefulSlice as VengefulSlice } from './vengeful-slice';
import { SweepingStrike as SweepingStrike } from './sweeping-strike';
import { OneThousandCuts as OneThousandCuts } from './one-thousand-cuts';

export const powerset: Powerset = {
  id: 'stalker/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand. Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    NimbleSlash,
    PowerSlice,
    AblatingStrike,
    AssassinsBlades,
    BuildUp,
    Placate,
    VengefulSlice,
    SweepingStrike,
    OneThousandCuts,
  ],
};

export default powerset;
