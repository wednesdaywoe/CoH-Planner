/**
 * Ice Melee Powerset
 * Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/ice_melee
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { Frost as Frost } from './frost';
import { FrozenAura as FrozenAura } from './frozen-aura';
import { FrozenFists as FrozenFists } from './frozen-fists';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { IceSword as IceSword } from './ice-sword';
import { IcePatch as IcePatch } from './ice-patch';
import { Taunt as Taunt } from './taunt';

export const powerset: Powerset = {
  id: 'brute/ice-melee',
  name: 'Ice Melee',
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    BuildUp,
    FreezingTouch,
    Frost,
    FrozenAura,
    FrozenFists,
    GreaterIceSword,
    IceSword,
    IcePatch,
    Taunt,
  ],
};

export default powerset;
