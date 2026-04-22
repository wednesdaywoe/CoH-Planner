/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/fire_control
 */

import type { Powerset } from '@/types';

import { Bonfire as Bonfire } from './bonfire';
import { Cinders as Cinders } from './cinders';
import { FireCages as FireCages } from './fire-cages';
import { FireImps as FireImps } from './fire-imps';
import { Flashfire as Flashfire } from './flashfire';
import { HotFeet as HotFeet } from './hot-feet';
import { RingofFire as RingofFire } from './ring-of-fire';
import { Smoke as Smoke } from './smoke';
import { Char as Char } from './soot';

export const powerset: Powerset = {
  id: 'controller/fire-control',
  name: 'Fire Control',
  description: 'You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.',
  icon: 'fire_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Bonfire,
    Cinders,
    FireCages,
    FireImps,
    Flashfire,
    HotFeet,
    RingofFire,
    Smoke,
    Char,
  ],
};

export default powerset;
