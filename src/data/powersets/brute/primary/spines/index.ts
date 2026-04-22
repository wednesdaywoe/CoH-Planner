/**
 * Spines Powerset
 * Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/spines
 */

import type { Powerset } from '@/types';

import { BarbSwipe as BarbSwipe } from './barb-swipe';
import { BuildUp as BuildUp } from './build-up';
import { Impale as Impale } from './impale';
import { Lunge as Lunge } from './lunge';
import { Quills as Quills } from './quills';
import { Ripper as Ripper } from './ripper';
import { SpineBurst as SpineBurst } from './spine-burst';
import { Taunt as Taunt } from './taunt';
import { ThrowSpines as ThrowSpines } from './throw-spines';

export const powerset: Powerset = {
  id: 'brute/spines',
  name: 'Spines',
  description: 'Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.',
  icon: 'quills_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    BarbSwipe,
    BuildUp,
    Impale,
    Lunge,
    Quills,
    Ripper,
    SpineBurst,
    Taunt,
    ThrowSpines,
  ],
};

export default powerset;
