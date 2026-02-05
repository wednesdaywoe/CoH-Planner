/**
 * Thorny Assault Powerset
 * Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy's Defense. Very few foes have resistance to Thorn toxins.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/thorny_assault
 */

import type { Powerset } from '@/types';

import { Skewer as Skewer } from './skewer';
import { ThornyDarts as ThornyDarts } from './thorny-darts';
import { FlingThorns as FlingThorns } from './fling-thorns';
import { Impale as Impale } from './impale';
import { BuildUp as BuildUp } from './build-up';
import { ThornBurst as ThornBurst } from './thorn-burst';
import { Thorntrops as Thorntrops } from './thorntrops';
import { Ripper as Ripper } from './ripper';
import { ThornBarrage as ThornBarrage } from './thorn-barrage';

export const powerset: Powerset = {
  id: 'dominator/thorny-assault',
  name: 'Thorny Assault',
  description: 'Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy\'s Defense. Very few foes have resistance to Thorn toxins.',
  icon: 'thorny_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    Skewer,
    ThornyDarts,
    FlingThorns,
    Impale,
    BuildUp,
    ThornBurst,
    Thorntrops,
    Ripper,
    ThornBarrage,
  ],
};

export default powerset;
