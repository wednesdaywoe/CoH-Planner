/**
 * Ice Blast Powerset
 * Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { IceBlast as IceBlast } from './ice-blast';
import { FrostBreath as FrostBreath } from './frost-breath';
import { Aim as Aim } from './aim';
import { FreezeRay as FreezeRay } from './freeze-ray';
import { IceStorm as IceStorm } from './freezing-rain';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { Blizzard as Blizzard } from './blizzard';

export const powerset: Powerset = {
  id: 'defender/ice-blast',
  name: 'Ice Blast',
  description: 'Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.',
  icon: 'ice_blast_set.png',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    IceBolt,
    IceBlast,
    FrostBreath,
    Aim,
    FreezeRay,
    IceStorm,
    BitterIceBlast,
    BitterFreezeRay,
    Blizzard,
  ],
};

export default powerset;
