/**
 * Fiery Melee Powerset
 * Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/fiery_melee
 */

import type { Powerset } from '@/types';

import { BreathofFire as BreathofFire } from './breath-of-fire';
import { BuildUp as BuildUp } from './build-up';
import { Cremate as Cremate } from './cremate';
import { FireSword as FireSword } from './fire-sword';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';
import { Incinerate as Incinerate } from './incinerate';
import { Confront as Confront } from './provoke';
import { Scorch as Scorch } from './scorch';

export const powerset: Powerset = {
  id: 'scrapper/fiery-melee',
  name: 'Fiery Melee',
  description: 'Fiery Melee allows you to attack with fire, and even conjure up flaming melee weapons. Fiery Melee powers tend to set foes ablaze for added Damage Over Time.',
  icon: 'fiery_melee_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    BreathofFire,
    BuildUp,
    Cremate,
    FireSword,
    FireSwordCircle,
    GreaterFireSword,
    Incinerate,
    Confront,
    Scorch,
  ],
};

export default powerset;
