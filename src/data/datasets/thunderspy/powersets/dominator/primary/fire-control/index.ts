/**
 * Fire Control Powerset
 * You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/fire_control
 */

import type { Powerset } from '@/types';

import { FireImps as FireImps } from './fire-imps';
import { Char as Char } from './char';
import { FireCages as FireCages } from './fire-cages';
import { Smoke as Smoke } from './smoke';
import { HotFeet as HotFeet } from './hot-feet';
import { Flashfire as Flashfire } from './flashfire';
import { Bonfire as Bonfire } from './bonfire';
import { RingofFire as RingofFire } from './ring-of-fire';
import { Cinders as Cinders } from './cinders';

export const powerset: Powerset = {
  id: 'dominator/fire-control',
  setPath: 'Dominator_Control.Fire_Control',
  name: 'Fire Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You can control the essence of fire to entrap, scorch, and manipulate your foes with smoke and flame.",
  icon: 'fire_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    FireImps,
    Char,
    FireCages,
    Smoke,
    HotFeet,
    Flashfire,
    Bonfire,
    RingofFire,
    Cinders,
  ],
};

export default powerset;
