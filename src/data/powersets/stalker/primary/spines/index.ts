/**
 * Spines Powerset
 * Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all Stalker primary attack powers, Spine attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/spines
 */

import type { Powerset } from '@/types';

import { BarbSwipe as BarbSwipe } from './barb-swipe';
import { Lunge as Lunge } from './lunge';
import { SpineBurst as SpineBurst } from './spine-burst';
import { AssassinsImpaler as AssassinsImpaler } from './assassin-s-impaler';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { Impale as Impale } from './impale';
import { Ripper as Ripper } from './ripper';
import { ThrowSpines as ThrowSpines } from './throw-spines';

export const powerset: Powerset = {
  id: 'stalker/spines',
  name: 'Spines',
  description: 'Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all Stalker primary attack powers, Spine attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'spines_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    BarbSwipe,
    Lunge,
    SpineBurst,
    AssassinsImpaler,
    BuildUp,
    Placate,
    Impale,
    Ripper,
    ThrowSpines,
  ],
};

export default powerset;
