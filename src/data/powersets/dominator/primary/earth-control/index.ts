/**
 * Earth Control Powerset
 * You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target's Defense. Being of the Earth, many of these powers need to be performed while on the ground.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/earth_control
 */

import type { Powerset } from '@/types';

import { Fossilize as Fossilize } from './fossilize';
import { StonePrison as StonePrison } from './stone-prison';
import { StoneCages as StoneCages } from './stone-cages';
import { Quicksand as Quicksand } from './quicksand';
import { SaltCrystals as SaltCrystals } from './salt-crystals';
import { Stalagmites as Stalagmites } from './stalagmites';
import { Earthquake as Earthquake } from './earthquake';
import { VolcanicGasses as VolcanicGasses } from './volcanic-gasses';
import { AnimateStone as AnimateStone } from './animate-stone';

export const powerset: Powerset = {
  id: 'dominator/earth-control',
  name: 'Earth Control',
  description: 'You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target\'s Defense. Being of the Earth, many of these powers need to be performed while on the ground.',
  icon: 'earth_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Fossilize,
    StonePrison,
    StoneCages,
    Quicksand,
    SaltCrystals,
    Stalagmites,
    Earthquake,
    VolcanicGasses,
    AnimateStone,
  ],
};

export default powerset;
