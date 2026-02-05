/**
 * Fiery Melee Powerset
 * Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/fiery_melee
 */

import type { Powerset } from '@/types';

import { FireSword as FireSword } from './fire-sword';
import { Scorch as Scorch } from './scorch';
import { Cremate as Cremate } from './cremate';
import { BuildUp as BuildUp } from './build-up';
import { BreathofFire as BreathofFire } from './breath-of-fire';
import { Confront as Confront } from './confront';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { Incinerate as Incinerate } from './incinerate';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';

export const powerset: Powerset = {
  id: 'scrapper/fiery-melee',
  name: 'Fiery Melee',
  description: 'Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_melee_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    FireSword,
    Scorch,
    Cremate,
    BuildUp,
    BreathofFire,
    Confront,
    FireSwordCircle,
    Incinerate,
    GreaterFireSword,
  ],
};

export default powerset;
