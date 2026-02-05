/**
 * Ice Melee Powerset
 * Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/ice_melee
 */

import type { Powerset } from '@/types';

import { FrozenFists as FrozenFists } from './frozen-fists';
import { IceSword as IceSword } from './ice-sword';
import { Frost as Frost } from './frost';
import { BuildUp as BuildUp } from './build-up';
import { IcePatch as IcePatch } from './ice-patch';
import { Confront as Confront } from './confront';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';

export const powerset: Powerset = {
  id: 'scrapper/ice-melee',
  name: 'Ice Melee',
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    FrozenFists,
    IceSword,
    Frost,
    BuildUp,
    IcePatch,
    Confront,
    GreaterIceSword,
    FreezingTouch,
    FrozenAura,
  ],
};

export default powerset;
