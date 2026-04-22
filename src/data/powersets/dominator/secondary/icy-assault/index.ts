/**
 * Icy Assault Powerset
 * Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/icy_assault
 */

import type { Powerset } from '@/types';

import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';
import { IceBlast as IceBlast } from './ice-blast';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { FrostBreath as FrostBreath } from './frost-breath';
import { IceSlash as IceSlash } from './greater-ice-sword';
import { IceSword as IceSword } from './ice-sword';
import { IceBolt as IceBolt } from './ice-bolt';
import { IceSwordCircle as IceSwordCircle } from './ice-sword-circle';
import { PowerUp as PowerUp } from './power-boost';

export const powerset: Powerset = {
  id: 'dominator/icy-assault',
  name: 'Icy Assault',
  description: 'Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.',
  icon: 'icy_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    BitterIceBlast,
    IceBlast,
    ChillingEmbrace,
    FrostBreath,
    IceSlash,
    IceSword,
    IceBolt,
    IceSwordCircle,
    PowerUp,
  ],
};

export default powerset;
