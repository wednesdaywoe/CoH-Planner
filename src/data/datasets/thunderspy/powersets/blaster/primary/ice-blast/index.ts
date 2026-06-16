/**
 * Ice Blast Powerset
 * Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: blaster
 * Category: primary
 * Source: blaster_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { IceBlast as IceBlast } from './ice-blast';
import { FrostBreath as FrostBreath } from './frost-breath';
import { FreezingRain as FreezingRain } from './freezing-rain';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { FreezeRay as FreezeRay } from './freeze-ray';
import { Aim as Aim } from './aim';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { Blizzard as Blizzard } from './blizzard';

export const powerset: Powerset = {
  id: 'blaster/ice-blast',
  name: 'Ice Blast',
  description: 'Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.',
  icon: 'ice_blast_set.ico',
  archetype: 'blaster',
  category: 'primary',
  powers: [
    IceBolt,
    IceBlast,
    FrostBreath,
    FreezingRain,
    BitterIceBlast,
    FreezeRay,
    Aim,
    BitterFreezeRay,
    Blizzard,
  ],
};

export default powerset;
