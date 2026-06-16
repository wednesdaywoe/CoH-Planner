/**
 * Fire Blast Powerset
 * Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { Flares as Flares } from './flares';
import { FireBlast as FireBlast } from './fire-blast';
import { FireBall as FireBall } from './fire-ball';
import { FireBreath as FireBreath } from './fire-breath';
import { Blaze as Blaze } from './blaze';
import { RainofFire as RainofFire } from './rain-of-fire';
import { Aim as Aim } from './aim';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { Inferno as Inferno } from './inferno';

export const powerset: Powerset = {
  id: 'corruptor/fire-blast',
  name: 'Fire Blast',
  description: 'Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    Flares,
    FireBlast,
    FireBall,
    FireBreath,
    Blaze,
    RainofFire,
    Aim,
    BlazingBolt,
    Inferno,
  ],
};

export default powerset;
