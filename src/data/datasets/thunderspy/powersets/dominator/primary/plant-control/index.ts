/**
 * Plant Control Powerset
 * You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes.  Many Plant Control powers are only effective if the target is near the ground.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/plant_control
 */

import type { Powerset } from '@/types';

import { FlyTrap as FlyTrap } from './fly-trap';
import { Strangler as Strangler } from './strangler';
import { Roots as Roots } from './roots';
import { SporeBurst as SporeBurst } from './spore-burst';
import { SeedsofConfusion as SeedsofConfusion } from './seeds-of-confusion';
import { SpiritTree as SpiritTree } from './spirit-tree';
import { Entangle as Entangle } from './entangle';
import { CarrionCreepers as CarrionCreepers } from './carrion-creepers';
import { Vines as Vines } from './vines';

export const powerset: Powerset = {
  id: 'dominator/plant-control',
  internalName: 'plant_control',
  name: 'Plant Control',
  description: 'You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes.  Many Plant Control powers are only effective if the target is near the ground.',
  icon: 'plant_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    FlyTrap,
    Strangler,
    Roots,
    SporeBurst,
    SeedsofConfusion,
    SpiritTree,
    Entangle,
    CarrionCreepers,
    Vines,
  ],
};

export default powerset;
