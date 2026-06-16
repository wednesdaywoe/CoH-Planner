/**
 * Plant Control Powerset
 * You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes.  Many Plant Control powers are only effective if the target is near the ground.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/plant_control
 */

import type { Powerset } from '@/types';

import { FlyTrap as FlyTrap } from './fly-trap';
import { Strangler as Strangler } from './strangler';
import { Roots as Roots } from './roots';
import { Entangle as Entangle } from './entangle';
import { SeedsofConfusion as SeedsofConfusion } from './seeds-of-confusion';
import { SporeBurst as SporeBurst } from './spore-burst';
import { SpiritTree as SpiritTree } from './spirit-tree';
import { CarrionCreepers as CarrionCreepers } from './carrion-creepers';
import { Vines as Vines } from './vines';

export const powerset: Powerset = {
  id: 'controller/plant-control',
  name: 'Plant Control',
  description: 'You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes.  Many Plant Control powers are only effective if the target is near the ground.',
  icon: 'plant_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    FlyTrap,
    Strangler,
    Roots,
    Entangle,
    SeedsofConfusion,
    SporeBurst,
    SpiritTree,
    CarrionCreepers,
    Vines,
  ],
};

export default powerset;
