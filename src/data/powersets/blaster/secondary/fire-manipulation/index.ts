/**
 * Fire Manipulation Powerset
 * Fire Manipulation lets you surround yourself with various manifestations of fire and flames, assaulting and burning nearby foes. Fire Manipulation powers tend to set foes ablaze for added damage over time.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/fire_manipulation
 */

import type { Powerset } from '@/types';

import { CauterizingAura as CauterizingAura } from './blazing-aura';
import { BuildUp as BuildUp } from './build-up';
import { Burn as Burn } from './burn';
import { Combustion as Combustion } from './combustion';
import { Consume as Consume } from './consume';
import { FireSword as FireSword } from './fire-sword';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { HotFeet as HotFeet } from './hot-feet';
import { RingofFire as RingofFire } from './ring-of-fire';

export const powerset: Powerset = {
  id: 'blaster/fire-manipulation',
  name: 'Fire Manipulation',
  description: 'Fire Manipulation lets you surround yourself with various manifestations of fire and flames, assaulting and burning nearby foes. Fire Manipulation powers tend to set foes ablaze for added damage over time.',
  icon: 'fire_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    CauterizingAura,
    BuildUp,
    Burn,
    Combustion,
    Consume,
    FireSword,
    FireSwordCircle,
    HotFeet,
    RingofFire,
  ],
};

export default powerset;
