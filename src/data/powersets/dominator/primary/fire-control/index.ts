/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/fire_control
 */

import type { Powerset } from '@/types';

import { Char as Char } from './char';
import { RingofFire as RingofFire } from './ring-of-fire';
import { FireCages as FireCages } from './fire-cages';
import { Smoke as Smoke } from './smoke';
import { HotFeet as HotFeet } from './hot-feet';
import { Flashfire as Flashfire } from './flashfire';
import { Cinders as Cinders } from './cinders';
import { Bonfire as Bonfire } from './bonfire';
import { FireImps as FireImps } from './fire-imps';

export const powerset: Powerset = {
  id: 'dominator/fire-control',
  name: 'Fire Control',
  description: 'You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.',
  icon: 'fire_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Char,
    RingofFire,
    FireCages,
    Smoke,
    HotFeet,
    Flashfire,
    Cinders,
    Bonfire,
    FireImps,
  ],
};

export default powerset;
