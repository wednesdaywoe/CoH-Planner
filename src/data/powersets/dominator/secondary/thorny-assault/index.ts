/**
 * Thorny Assault Powerset
 * Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy's Defense. Very few foes have resistance to Thorn toxins.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/thorny_assault
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './aim';
import { FlingThorns as FlingThorns } from './fling-thorns';
import { Impale as Impale } from './impale';
import { Ripper as Ripper } from './ripper';
import { Skewer as Skewer } from './skewer';
import { ThornBarrage as ThornBarrage } from './thorn-barrage';
import { ThornBurst as ThornBurst } from './thorn-burst';
import { Thorntrops as Thorntrops } from './thorntrops';
import { ThornyDarts as ThornyDarts } from './thorny-darts';

export const powerset: Powerset = {
  id: 'dominator/thorny-assault',
  name: 'Thorny Assault',
  description: 'Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy\'s Defense. Very few foes have resistance to Thorn toxins.',
  icon: 'thorny_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    BuildUp,
    FlingThorns,
    Impale,
    Ripper,
    Skewer,
    ThornBarrage,
    ThornBurst,
    Thorntrops,
    ThornyDarts,
  ],
};

export default powerset;
