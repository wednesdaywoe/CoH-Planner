/**
 * Ice Melee Powerset
 * Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/ice_melee
 */

import type { Powerset } from '@/types';

import { FrozenFists as FrozenFists } from './frozen-fists';
import { Frost as Frost } from './frost';
import { BuildUp as BuildUp } from './build-up';
import { IcePatch as IcePatch } from './ice-patch';
import { Taunt as Taunt } from './taunt';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { IceSword as IceSword } from './ice-sword';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';

export const powerset: Powerset = {
  id: 'brute/ice-melee',
  name: 'Ice Melee',
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    FrozenFists,
    Frost,
    BuildUp,
    IcePatch,
    Taunt,
    GreaterIceSword,
    IceSword,
    FreezingTouch,
    FrozenAura,
  ],
};

export default powerset;
