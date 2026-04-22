/**
 * Plant Control Powerset
 * You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes. Many Plant Control powers are only effective if the target is near the ground.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/plant_control
 */

import type { Powerset } from '@/types';

import { CarrionCreepers as CarrionCreepers } from './carrion-creepers';
import { Entangle as Entangle } from './entangle';
import { FlyTrap as FlyTrap } from './fly-trap';
import { Roots as Roots } from './roots';
import { SeedsofConfusion as SeedsofConfusion } from './seeds-of-confusion';
import { SpiritTree as SpiritTree } from './spirit-tree';
import { SporeBurst as SporeBurst } from './spore-burst';
import { Strangler as Strangler } from './strangler';
import { Vines as Vines } from './vines';

export const powerset: Powerset = {
  id: 'controller/plant-control',
  name: 'Plant Control',
  description: 'You can call forth and control the power of plants and flora to control your foes. Animate and control vines, roots and spores to entrap, entwine and utterly dominate your foes. Many Plant Control powers are only effective if the target is near the ground.',
  icon: 'plant_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    CarrionCreepers,
    Entangle,
    FlyTrap,
    Roots,
    SeedsofConfusion,
    SpiritTree,
    SporeBurst,
    Strangler,
    Vines,
  ],
};

export default powerset;
