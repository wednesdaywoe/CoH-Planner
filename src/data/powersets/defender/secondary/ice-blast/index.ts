/**
 * Ice Blast Powerset
 * Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { Aim as Aim } from './aim';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { FreezeRay as FreezeRay } from './freeze-ray';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { IceBlast as IceBlast } from './ice-blast';
import { Blizzard as Blizzard } from './blizzard';
import { IceStorm as IceStorm } from './freezing-rain';
import { FrostBreath as FrostBreath } from './frost-breath';
import { IceBolt as IceBolt } from './ice-bolt';

export const powerset: Powerset = {
  id: 'defender/ice-blast',
  name: 'Ice Blast',
  description: 'Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.',
  icon: 'ice_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Aim,
    BitterFreezeRay,
    FreezeRay,
    BitterIceBlast,
    IceBlast,
    Blizzard,
    IceStorm,
    FrostBreath,
    IceBolt,
  ],
};

export default powerset;
