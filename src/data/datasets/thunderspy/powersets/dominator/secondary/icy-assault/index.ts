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
import { IceBlast as IceBlast } from './ice-blast';
import { FrostBreath as FrostBreath } from './frost-breath';
import { PowerBoost as PowerBoost } from './power-boost';
import { IceSwordCircle as IceSwordCircle } from './ice-sword-circle';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { ChillingEmbrace as ChillingEmbrace } from './chilling-embrace';
import { BitterIceBlast as BitterIceBlast } from './bitter-ice-blast';

export const powerset: Powerset = {
  id: 'dominator/icy-assault',
  setPath: 'Dominator_Assault.Icy_Assault',
  name: 'Icy Assault',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Ice Assault allows the player to use Cold-based attacks. Conjure up frozen melee weapons or hurl deadly shards of Ice. Icy powers are known for their ability to slow an opponent.',
  icon: 'icy_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    IceBolt,
    IceSword,
    IceBlast,
    FrostBreath,
    PowerBoost,
    IceSwordCircle,
    GreaterIceSword,
    ChillingEmbrace,
    BitterIceBlast,
  ],
};

export default powerset;
