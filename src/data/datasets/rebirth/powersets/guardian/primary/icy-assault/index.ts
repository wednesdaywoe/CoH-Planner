/**
 * Icy Assault Powerset
 * Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/icy_assault
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { IceSword as IceSword } from './ice-sword';
import { IceSwordCircle as IceSwordCircle } from './ice-sword-circle';
import { IceBlast as IceBlast } from './ice-blast';
import { BuildUp as BuildUp } from './build-up';
import { FrostBreath as FrostBreath } from './frost-breath';
import { IceSlash as IceSlash } from './ice-slash';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { BitterFreezeRay as BitterFreezeRay } from './bitter-freeze-ray';

export const powerset: Powerset = {
  id: 'guardian/icy-assault',
  name: 'Icy Assault',
  description: 'Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.',
  icon: 'icy_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    IceBolt,
    IceSword,
    IceSwordCircle,
    IceBlast,
    BuildUp,
    FrostBreath,
    IceSlash,
    BitterIceBlast,
    BitterFreezeRay,
  ],
};

export default powerset;
