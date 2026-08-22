/**
 * Icy Combat Powerset
 * Icy Combat allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/ice_blast
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { IceBlast as IceBlast } from './ice-blast';
import { IceSword as IceSword } from './ice-sword';
import { FrostBreath as FrostBreath } from './frost-breath';
import { IceSwordCircle as IceSwordCircle } from './ice-sword-circle';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { FreezeRay as FreezeRay } from './freeze-ray';
import { Aim as Aim } from './aim';
import { FreezingRain as FreezingRain } from './freezing-rain';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { Blizzard as Blizzard } from './blizzard';

export const powerset: Powerset = {
  id: 'defender/icy-combat',
  setPath: 'Defender_Ranged.Ice_Blast',
  name: 'Icy Combat',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "Icy Combat allows you to use the power of ice against your foes, with a tendency to Slow their attacks and movement.",
  icon: 'ice_blast_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    IceBolt,
    IceBlast,
    IceSword,
    FrostBreath,
    IceSwordCircle,
    BitterIceBlast,
    GreaterIceSword,
    FreezeRay,
    Aim,
    FreezingRain,
    BitterFreezeRay,
    FreezingTouch,
    Blizzard,
  ],
};

export default powerset;
