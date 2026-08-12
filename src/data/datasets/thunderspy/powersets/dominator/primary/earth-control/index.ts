/**
 * Earth Control Powerset
 * You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target's Defense. Being of the Earth, many of these powers need to be performed while on the ground.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/earth_control
 */

import type { Powerset } from '@/types';

import { AnimateStone as AnimateStone } from './animate-stone';
import { Fossilize as Fossilize } from './fossilize';
import { StoneCages as StoneCages } from './stone-cages';
import { StonePrison as StonePrison } from './stone-prison';
import { SaltCrystals as SaltCrystals } from './salt-crystals';
import { Stalagmites as Stalagmites } from './stalagmites';
import { Earthquake as Earthquake } from './earthquake';
import { Quicksand as Quicksand } from './quicksand';
import { VolcanicGasses as VolcanicGasses } from './volcanic-gasses';

export const powerset: Powerset = {
  id: 'dominator/earth-control',
  setPath: 'Dominator_Control.Earth_Control',
  name: 'Earth Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can control the forces of the Earth. You can manipulate earth and stone to defeat your foes. The crushing force of many Earth Powers can reduce a target\'s Defense. Being of the Earth, many of these powers need to be performed while on the ground.',
  icon: 'earth_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    AnimateStone,
    Fossilize,
    StoneCages,
    StonePrison,
    SaltCrystals,
    Stalagmites,
    Earthquake,
    Quicksand,
    VolcanicGasses,
  ],
};

export default powerset;
