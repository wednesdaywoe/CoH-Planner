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
import { AssassinsIceSwords as AssassinsIceSwords } from './assassins-ice-swords';
import { Placate as Placate } from './placate';
import { BuildUp as BuildUp } from './build-up';
import { IcePatch as IcePatch } from './ice-patch';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';

export const powerset: Powerset = {
  id: 'stalker/ice-melee',
  setPath: 'Stalker_Melee.Ice_Melee',
  name: 'Ice Melee',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Ice Melee allows the player to use Cold-based attacks, and even conjure up frozen melee weapons. Ice Melee powers are known for their ability to slow an opponent.',
  icon: 'ice_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    FrozenFists,
    IceSword,
    Frost,
    AssassinsIceSwords,
    Placate,
    BuildUp,
    IcePatch,
    FreezingTouch,
    FrozenAura,
  ],
};

export default powerset;
