/**
 * Fire Blast Powerset
 * Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { Blaze as Blaze } from './blaze';
import { BlazingBlast as BlazingBlast } from './blazing-blast';
import { FireBall as FireBall } from './fire-ball';
import { FireBlast as FireBlast } from './fire-blast';
import { FireBreath as FireBreath } from './fire-breath';
import { Flares as Flares } from './flares';
import { Inferno as Inferno } from './inferno';
import { RainofFire as RainofFire } from './rain-of-fire';

export const powerset: Powerset = {
  id: 'sentinel/fire-blast',
  name: 'Fire Blast',
  description: 'Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.ico',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    Aim,
    Blaze,
    BlazingBlast,
    FireBall,
    FireBlast,
    FireBreath,
    Flares,
    Inferno,
    RainofFire,
  ],
};

export default powerset;
