/**
 * Spines Powerset
 * Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly.  Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/quills
 */

import type { Powerset } from '@/types';

import { BarbSwipe as BarbSwipe } from './barb-swipe';
import { Lunge as Lunge } from './lunge';
import { QuillThrowing as QuillThrowing } from './quill-throwing';
import { BuildUp as BuildUp } from './build-up';
import { Impale as Impale } from './impale';
import { Taunt as Taunt } from './taunt';
import { Quills as Quills } from './quills';
import { Ripper as Ripper } from './ripper';
import { FlingQuills as FlingQuills } from './fling-quills';

export const powerset: Powerset = {
  id: 'scrapper/spines',
  setPath: 'Scrapper_Melee.Quills',
  name: 'Spines',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Spines protrude from your body and can deal damage in melee or at very short ranges. Spines are hollow and hold a neural toxin that deals additional Toxic damage and can Slow or Immobilize your enemies. The toxin is cumulative, and multiple hits will affect a target more strongly.  Very few foes have resistance to Spine poison. Like all scrapper powers, all Spine attacks can sometimes land a critical hit for double damage.',
  icon: 'quills_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BarbSwipe,
    Lunge,
    QuillThrowing,
    BuildUp,
    Impale,
    Taunt,
    Quills,
    Ripper,
    FlingQuills,
  ],
};

export default powerset;
