/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/fire_control
 */

import type { Powerset } from '@/types';

import { Bonfire as Bonfire } from './bonfire';
import { Char as Char } from './char';
import { Cinders as Cinders } from './cinders';
import { FireCages as FireCages } from './fire-cages';
import { FireImps as FireImps } from './fire-imps';
import { Flashfire as Flashfire } from './flashfire';
import { HotFeet as HotFeet } from './hot-feet';
import { RingofFire as RingofFire } from './ring-of-fire';
import { Smoke as Smoke } from './smoke';

export const powerset: Powerset = {
  id: 'dominator/fire-control',
  name: 'Fire Control',
  description: 'You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.',
  icon: 'fire_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Bonfire,
    Char,
    Cinders,
    FireCages,
    FireImps,
    Flashfire,
    HotFeet,
    RingofFire,
    Smoke,
  ],
};

export default powerset;
