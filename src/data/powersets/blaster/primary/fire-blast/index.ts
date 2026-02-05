/**
 * Fire Blast Powerset
 * Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { FireBlast as FireBlast } from './fire-blast';
import { Flares as Flares } from './flares';
import { FireBall as FireBall } from './fire-ball';
import { RainofFire as RainofFire } from './rain-of-fire';
import { FireBreath as FireBreath } from './fire-breath';
import { Aim as Aim } from './aim';
import { Blaze as Blaze } from './blaze';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Inferno as Inferno } from './inferno';

export const powerset: Powerset = {
  id: 'blaster/fire-blast',
  name: 'Fire Blast',
  description: 'Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.png',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    FireBlast,
    Flares,
    FireBall,
    RainofFire,
    FireBreath,
    Aim,
    Blaze,
    BlazingBolt,
    Inferno,
  ],
};

export default powerset;
