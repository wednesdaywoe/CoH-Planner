/**
 * Ice Blast Powerset
 * Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: corruptor
 * Category: primary
 * Source: corruptor_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { FrostBreath as FrostBreath } from './frost-breath';
import { Aim as Aim } from './aim';
import { IceStorm as IceStorm } from './ice-storm';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { IceBlast as IceBlast } from './ice-blast';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { FreezeRay as FreezeRay } from './freeze-ray';
import { Blizzard as Blizzard } from './blizzard';

export const powerset: Powerset = {
  id: 'corruptor/ice-blast',
  name: 'Ice Blast',
  description: 'Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.',
  icon: 'ice_blast_set.ico',
  archetype: 'corruptor',
  category: 'primary',
  powers: [
    IceBolt,
    FrostBreath,
    Aim,
    IceStorm,
    BitterIceBlast,
    IceBlast,
    BitterFreezeRay,
    FreezeRay,
    Blizzard,
  ],
};

export default powerset;
