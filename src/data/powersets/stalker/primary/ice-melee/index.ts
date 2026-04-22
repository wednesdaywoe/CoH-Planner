/**
 * Ice Melee Powerset
 * Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/ice_melee
 */

import type { Powerset } from '@/types';

import { AssassinsIceSword as AssassinsIceSword } from './assassins-ice-swords';
import { BuildUp as BuildUp } from './build-up';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { Frost as Frost } from './frost';
import { FrozenAura as FrozenAura } from './frozen-aura';
import { FrozenFists as FrozenFists } from './frozen-fists';
import { IcePatch as IcePatch } from './ice-patch';
import { IceSword as IceSword } from './ice-sword';
import { Placate as Placate } from './placate';

export const powerset: Powerset = {
  id: 'stalker/ice-melee',
  name: 'Ice Melee',
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsIceSword,
    BuildUp,
    FreezingTouch,
    Frost,
    FrozenAura,
    FrozenFists,
    IcePatch,
    IceSword,
    Placate,
  ],
};

export default powerset;
