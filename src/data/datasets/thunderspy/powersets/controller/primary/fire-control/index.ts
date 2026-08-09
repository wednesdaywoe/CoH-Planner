/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/fire_control
 */

import type { Powerset } from '@/types';

import { FireImps as FireImps } from './fire-imps';
import { Soot as Soot } from './soot';
import { FireCages as FireCages } from './fire-cages';
import { RingofFire as RingofFire } from './ring-of-fire';
import { HotFeet as HotFeet } from './hot-feet';
import { Flashfire as Flashfire } from './flashfire';
import { Smoke as Smoke } from './smoke';
import { Bonfire as Bonfire } from './bonfire';
import { Cinders as Cinders } from './cinders';

export const powerset: Powerset = {
  id: 'controller/fire-control',
  internalName: 'fire_control',
  name: 'Fire Control',
  description: 'You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.',
  icon: 'fire_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    FireImps,
    Soot,
    FireCages,
    RingofFire,
    HotFeet,
    Flashfire,
    Smoke,
    Bonfire,
    Cinders,
  ],
};

export default powerset;
