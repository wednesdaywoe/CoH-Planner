/**
 * Fiery Combat Powerset
 * Fiery Combat allows you to attack with fire, and even conjure up flaming melee weapons. with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { Flares as Flares } from './flares';
import { FireBlast as FireBlast } from './fire-blast';
import { Scorch as Scorch } from './scorch';
import { FireBall as FireBall } from './fire-ball';
import { Blaze as Blaze } from './blaze';
import { FireSword as FireSword } from './fire-sword';
import { FireBreath as FireBreath } from './fire-breath';
import { Aim as Aim } from './aim';
import { RainofFire as RainofFire } from './rain-of-fire';
import { FireSwordCircle as FireSwordCircle } from './fire-sword-circle';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { GreaterFireSword as GreaterFireSword } from './greater-fire-sword';
import { Inferno as Inferno } from './inferno';

export const powerset: Powerset = {
  id: 'defender/fiery-combat',
  internalName: 'fire_blast',
  name: 'Fiery Combat',
  description: 'Fiery Combat allows you to attack with fire, and even conjure up flaming melee weapons. with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Flares,
    FireBlast,
    Scorch,
    FireBall,
    Blaze,
    FireSword,
    FireBreath,
    Aim,
    RainofFire,
    FireSwordCircle,
    BlazingBolt,
    GreaterFireSword,
    Inferno,
  ],
};

export default powerset;
