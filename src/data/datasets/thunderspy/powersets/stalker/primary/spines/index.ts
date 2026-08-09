/**
 * Spines Powerset
 * Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly.  Very few foes have resistance to Spine poison. Like all Stalker primary attack powers, Spine attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/spines
 */

import type { Powerset } from '@/types';

import { BarbSwipe as BarbSwipe } from './barb-swipe';
import { Lunge as Lunge } from './lunge';
import { ThrowSpines as ThrowSpines } from './throw-spines';
import { AssassinsImpaler as AssassinsImpaler } from './assassins-impaler';
import { BuildUp as BuildUp } from './build-up';
import { Impale as Impale } from './impale';
import { Placate as Placate } from './placate';
import { Ripper as Ripper } from './ripper';
import { SpineBurst as SpineBurst } from './spine-burst';

export const powerset: Powerset = {
  id: 'stalker/spines',
  internalName: 'spines',
  name: 'Spines',
  description: 'Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly.  Very few foes have resistance to Spine poison. Like all Stalker primary attack powers, Spine attacks can land a Critical Hit for double damage, if you are properly Hidden or if your target is Slept or Held.',
  icon: 'spines_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    BarbSwipe,
    Lunge,
    ThrowSpines,
    AssassinsImpaler,
    BuildUp,
    Impale,
    Placate,
    Ripper,
    SpineBurst,
  ],
};

export default powerset;
