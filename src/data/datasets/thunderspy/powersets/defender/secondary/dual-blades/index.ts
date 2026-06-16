/**
 * Dual Blades Powerset
 * You are a master of fighting with a blade in each hand.  Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/dual_blades
 */

import type { Powerset } from '@/types';

import { LightOpening as LightOpening } from './light-opening';
import { ModerateOpening as ModerateOpening } from './moderate-opening';
import { ModerateBridge as ModerateBridge } from './moderate-bridge';
import { AoEBridge as AoEBridge } from './aoe-bridge';
import { Taunt as Taunt } from './taunt';
import { FollowUp as FollowUp } from './follow-up';
import { Special1 as Special1 } from './special-1';
import { Special2 as Special2 } from './special-2';
import { HighLow as HighLow } from './high-low';

export const powerset: Powerset = {
  id: 'defender/dual-blades',
  name: 'Dual Blades',
  description: 'You are a master of fighting with a blade in each hand.  Your precision and skill with the blades enable you to strike in numerous combinations, each of which has unique secondary effects on a target which withstands your onslaught.',
  icon: 'dual_blades_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    LightOpening,
    ModerateOpening,
    ModerateBridge,
    AoEBridge,
    Taunt,
    FollowUp,
    Special1,
    Special2,
    HighLow,
  ],
};

export default powerset;
