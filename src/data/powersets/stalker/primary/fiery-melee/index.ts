/**
 * Fiery Melee Powerset
 * Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/fiery_melee
 */

import type { Powerset } from '@/types';

import { AssassinsBlaze as AssassinsBlaze } from './assassins-blaze';
import { BreathofFire as BreathofFire } from './breath-of-fire';
import { BuildUp as BuildUp } from './build-up';
import { Cremate as Cremate } from './cremate';
import { FireSword as FireSword } from './fire-sword';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';
import { Placate as Placate } from './placate';
import { Scorch as Scorch } from './scorch';

export const powerset: Powerset = {
  id: 'stalker/fiery-melee',
  name: 'Fiery Melee',
  description: 'Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsBlaze,
    BreathofFire,
    BuildUp,
    Cremate,
    FireSword,
    FireSwordCircle,
    GreaterFireSword,
    Placate,
    Scorch,
  ],
};

export default powerset;
