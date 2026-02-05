/**
 * Fiery Melee Powerset
 * Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/fiery_melee
 */

import type { Powerset } from '@/types';

import { FireSword as FireSword } from './fire-sword';
import { Scorch as Scorch } from './scorch';
import { Combustion as Combustion } from './combustion';
import { Taunt as Taunt } from './taunt';
import { BreathofFire as BreathofFire } from './breath-of-fire';
import { BuildUp as BuildUp } from './build-up';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { Incinerate as Incinerate } from './incinerate';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';

export const powerset: Powerset = {
  id: 'tanker/fiery-melee',
  name: 'Fiery Melee',
  description: 'Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_melee_set.png',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    FireSword,
    Scorch,
    Combustion,
    Taunt,
    BreathofFire,
    BuildUp,
    FireSwordCircle,
    Incinerate,
    GreaterFireSword,
  ],
};

export default powerset;
