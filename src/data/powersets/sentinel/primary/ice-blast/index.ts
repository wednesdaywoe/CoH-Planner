/**
 * Ice Blast Powerset
 * Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: sentinel
 * Category: primary
 * Source: sentinel_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { IceBlast as IceBlast } from './ice-blast';
import { IceBolt as IceBolt } from './ice-bolt';
import { FrostBreath as FrostBreath } from './frost-breath';
import { ChillingRay as ChillingRay } from './chilling-ray';
import { Aim as Aim } from './aim';
import { IceStorm as IceStorm } from './ice-storm';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { Blizzard as Blizzard } from './blizzard';

export const powerset: Powerset = {
  id: 'sentinel/ice-blast',
  name: 'Ice Blast',
  description: 'Ice Blast allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.',
  icon: 'ice_blast_set.png',
  archetype: 'sentinel',
  category: 'primary',
  powers: [
    IceBlast,
    IceBolt,
    FrostBreath,
    ChillingRay,
    Aim,
    IceStorm,
    BitterIceBlast,
    BitterFreezeRay,
    Blizzard,
  ],
};

export default powerset;
