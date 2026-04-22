/**
 * Fire Blast Powerset
 * Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/fire_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { Blaze as Blaze } from './blaze';
import { BlazingBolt as BlazingBolt } from './blazing-bolt';
import { FireBall as FireBall } from './fire-ball';
import { FireBlast as FireBlast } from './fire-blast';
import { FireBreath as FireBreath } from './fire-breath';
import { Flares as Flares } from './flares';
import { Inferno as Inferno } from './inferno';
import { RainofFire as RainofFire } from './rain-of-fire';

export const powerset: Powerset = {
  id: 'defender/fire-blast',
  name: 'Fire Blast',
  description: 'Fire Blast allows you to blast fire at foes, with a tendency to set them ablaze for added damage over time.',
  icon: 'fire_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Aim,
    Blaze,
    BlazingBolt,
    FireBall,
    FireBlast,
    FireBreath,
    Flares,
    Inferno,
    RainofFire,
  ],
};

export default powerset;
