/**
 * Spines Powerset
 * Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/quills
 */

import type { Powerset } from '@/types';

import { BarbSwipe as BarbSwipe } from './barb-swipe';
import { BuildUp as BuildUp } from './build-up';
import { SpineBurst as SpineBurst } from './fling-quills';
import { Quills as Quills } from './quills';
import { Impale as Impale } from './impale';
import { Lunge as Lunge } from './lunge';
import { ThrowSpines as ThrowSpines } from './quill-throwing';
import { Ripper as Ripper } from './ripper';
import { Confront as Confront } from './taunt';

export const powerset: Powerset = {
  id: 'scrapper/spines',
  name: 'Spines',
  description: 'Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly. Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.',
  icon: 'quills_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BarbSwipe,
    BuildUp,
    SpineBurst,
    Quills,
    Impale,
    Lunge,
    ThrowSpines,
    Ripper,
    Confront,
  ],
};

export default powerset;
