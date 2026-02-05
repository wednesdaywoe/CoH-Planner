/**
 * Fire Blast Powerset
 * Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { FireBlast as FireBlast } from './fire-blast';
import { Flares as Flares } from './flares';
import { FireBall as FireBall } from './fire-ball';
import { Blaze as Blaze } from './blaze';
import { Aim as Aim } from './aim';
import { FireBreath as FireBreath } from './fire-breath';
import { BlazingBlast as BlazingBlast } from './blazing-blast';
import { RainofFire as RainofFire } from './rain-of-fire';
import { Inferno as Inferno } from './inferno';

export const powerset: Powerset = {
  id: 'sentinel/fire-blast',
  name: 'Fire Blast',
  description: 'Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    FireBlast,
    Flares,
    FireBall,
    Blaze,
    Aim,
    FireBreath,
    BlazingBlast,
    RainofFire,
    Inferno,
  ],
};

export default powerset;
