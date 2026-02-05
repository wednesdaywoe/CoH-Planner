/**
 * Fiery Melee Powerset
 * Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/fiery_melee
 */

import type { Powerset } from '@/types';

import { FireSword as FireSword } from './fire-sword';
import { Scorch as Scorch } from './scorch';
import { Cremate as Cremate } from './cremate';
import { AssassinsBlaze as AssassinsBlaze } from './assassin-s-blaze';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { BreathofFire as BreathofFire } from './breath-of-fire';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';

export const powerset: Powerset = {
  id: 'stalker/fiery-melee',
  name: 'Fiery Melee',
  description: 'Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_melee_set.png',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    FireSword,
    Scorch,
    Cremate,
    AssassinsBlaze,
    BuildUp,
    Placate,
    BreathofFire,
    FireSwordCircle,
    GreaterFireSword,
  ],
};

export default powerset;
