/**
 * Icy Assault Powerset
 * Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/icy_assault
 */

import type { Powerset } from '@/types';

import { IceBolt as IceBolt } from './ice-bolt';
import { IceSword as IceSword } from './ice-sword';
import { IceSwordCircle as IceSwordCircle } from './ice-sword-circle';
import { IceBlast as IceBlast } from './ice-blast';
import { PowerBoost as PowerBoost } from './power-boost';
import { FrostBreath as FrostBreath } from './frost-breath';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { IceSlash as IceSlash } from './greater-ice-sword';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';

export const powerset: Powerset = {
  id: 'dominator/icy-assault',
  name: 'Icy Assault',
  description: 'Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.',
  icon: 'icy_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    IceBolt,
    IceSword,
    IceSwordCircle,
    IceBlast,
    PowerBoost,
    FrostBreath,
    ChillingEmbrace,
    IceSlash,
    BitterIceBlast,
  ],
};

export default powerset;
