/**
 * Thorny Combat Powerset
 * Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy's Defense.  Very few foes have resistance to Thorn toxins.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/thorny_assault
 */

import type { Powerset } from '@/types';

import { ThornyDarts as ThornyDarts } from './thorny-darts';
import { Skewer as Skewer } from './skewer';
import { FlingThorns as FlingThorns } from './fling-thorns';
import { Impale as Impale } from './impale';
import { ThornBurst as ThornBurst } from './thorn-burst';
import { Aim as Aim } from './aim';
import { Thorntrops as Thorntrops } from './thorntrops';
import { ThornBarrage as ThornBarrage } from './thorn-barrage';
import { Ripper as Ripper } from './ripper';

export const powerset: Powerset = {
  id: 'defender/thorny-combat',
  internalName: 'thorny_assault',
  name: 'Thorny Combat',
  description: 'Thorns protrude from your body and can deal damage in melee or at range. Thorns are hollow and inject toxin that deals additional Toxic damage and can weaken your enemy\'s Defense.  Very few foes have resistance to Thorn toxins.',
  icon: 'thorny_assault_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    ThornyDarts,
    Skewer,
    FlingThorns,
    Impale,
    ThornBurst,
    Aim,
    Thorntrops,
    ThornBarrage,
    Ripper,
  ],
};

export default powerset;
