/**
 * Ice Melee Powerset
 * Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ice_melee
 */

import type { Powerset } from '@/types';

import { FrozenFists as FrozenFists } from './frozen-fists';
import { IceSword as IceSword } from './ice-sword';
import { Frost as Frost } from './frost';
import { AssassinsIcicle as AssassinsIcicle } from './assassins-strike';
import { BuildUp as BuildUp } from './build-up';
import { Placate as Placate } from './placate';
import { GreaterIceSword as GreaterIceSword } from './greater-ice-sword';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';

export const powerset: Powerset = {
  id: 'stalker/ice-melee',
  name: 'Ice Melee',
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    FrozenFists,
    IceSword,
    Frost,
    AssassinsIcicle,
    BuildUp,
    Placate,
    GreaterIceSword,
    FreezingTouch,
    FrozenAura,
  ],
};

export default powerset;
