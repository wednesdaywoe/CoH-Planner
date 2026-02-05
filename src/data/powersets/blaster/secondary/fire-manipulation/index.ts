/**
 * Fire Manipulation Powerset
 * Fire Manipulation lets you surround yourself with various manifestations of fire and flames, assaulting and burning nearby foes. Fire Manipulation powers tend to set foes ablaze for added damage over time.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/fire_manipulation
 */

import type { Powerset } from '@/types';

import { FireSword as FireSword } from './fire-sword';
import { RingofFire as RingofFire } from './ring-of-fire';
import { Combustion as Combustion } from './combustion';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { BuildUp as BuildUp } from './build-up';
import { CauterizingAura as CauterizingAura } from './cauterizing-aura';
import { Consume as Consume } from './consume';
import { Burn as Burn } from './burn';
import { HotFeet as HotFeet } from './hot-feet';

export const powerset: Powerset = {
  id: 'blaster/fire-manipulation',
  name: 'Fire Manipulation',
  description: 'Fire Manipulation lets you surround yourself with various manifestations of fire and flames, assaulting and burning nearby foes. Fire Manipulation powers tend to set foes ablaze for added damage over time.',
  icon: 'fire_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    FireSword,
    RingofFire,
    Combustion,
    FireSwordCircle,
    BuildUp,
    CauterizingAura,
    Consume,
    Burn,
    HotFeet,
  ],
};

export default powerset;
