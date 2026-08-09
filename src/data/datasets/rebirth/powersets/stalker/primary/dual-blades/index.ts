/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand.  Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/dual_blades
 */

import type { Powerset } from '@/types';

import { LightOpening as LightOpening } from './light-opening';
import { ModerateOpening as ModerateOpening } from './moderate-opening';
import { ModerateBridge as ModerateBridge } from './moderate-bridge';
import { AssassinsBlades as AssassinsBlades } from './assassins-blades';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { Special1 as Special1 } from './special-1';
import { Special2 as Special2 } from './special-2';
import { HighLow as HighLow } from './high-low';

export const powerset: Powerset = {
  id: 'stalker/dual-blades',
  internalName: 'dual_blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand.  Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    LightOpening,
    ModerateOpening,
    ModerateBridge,
    AssassinsBlades,
    BuildUp,
    Placate,
    Special1,
    Special2,
    HighLow,
  ],
};

export default powerset;
