/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/fire_control
 */

import type { Powerset } from '@/types';

import { RingofFire as RingofFire } from './ring-of-fire';
import { Soot as Soot } from './soot';
import { BalorsWhip as BalorsWhip } from './balor-s-whip';
import { FireCages as FireCages } from './fire-cages';
import { FireImps as FireImps } from './fire-imps';
import { Smoke as Smoke } from './smoke';
import { HotFeet as HotFeet } from './hot-feet';
import { Flashfire as Flashfire } from './flashfire';
import { Cinders as Cinders } from './cinders';
import { Bonfire as Bonfire } from './bonfire';

export const powerset: Powerset = {
  id: 'controller/fire-control',
  name: 'Fire Control',
  description: 'You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.',
  icon: 'fire_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    RingofFire,
    Soot,
    BalorsWhip,
    FireCages,
    FireImps,
    Smoke,
    HotFeet,
    Flashfire,
    Cinders,
    Bonfire,
  ],
};

export default powerset;
