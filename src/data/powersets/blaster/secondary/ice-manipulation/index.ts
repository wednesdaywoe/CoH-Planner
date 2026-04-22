/**
 * Ice Manipulation Powerset
 * Ice Manipulation lets you surround yourself with various manifestations of ice and cold, assaulting and freezing nearby foes. Ice Manipulation powers are known to Slow opponents.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/ice_manipulation
 */

import type { Powerset } from '@/types';

import { BuildUp as BuildUp } from './build-up';
import { Chilblain as Chilblain } from './chilblain';
import { FrigidProtection as FrigidProtection } from './chilling-embrace';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';
import { FrozenFists as FrozenFists } from './frozen-fists';
import { IcePatch as IcePatch } from './ice-patch';
import { IceSword as IceSword } from './ice-sword';
import { Shiver as Shiver } from './shiver';

export const powerset: Powerset = {
  id: 'blaster/ice-manipulation',
  name: 'Ice Manipulation',
  description: 'Ice Manipulation lets you surround yourself with various manifestations of ice and cold, assaulting and freezing nearby foes. Ice Manipulation powers are known to Slow opponents.',
  icon: 'ice_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    BuildUp,
    Chilblain,
    FrigidProtection,
    FreezingTouch,
    FrozenAura,
    FrozenFists,
    IcePatch,
    IceSword,
    Shiver,
  ],
};

export default powerset;
