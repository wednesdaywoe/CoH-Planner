/**
 * Ice Manipulation Powerset
 * Ice Manipulation lets you surround yourself with various manifestations of ice and cold, assaulting and freezing nearby foes. Ice Manipulation powers are known to Slow opponents.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/ice_manipulation
 */

import type { Powerset } from '@/types';

import { Chilblain as Chilblain } from './chilblain';
import { FrozenFists as FrozenFists } from './frozen-fists';
import { IceSword as IceSword } from './ice-sword';
import { FrigidProtection as FrigidProtection } from './frigid-protection';
import { BuildUp as BuildUp } from './build-up';
import { IcePatch as IcePatch } from './ice-patch';
import { Shiver as Shiver } from './shiver';
import { FreezingTouch as FreezingTouch } from './freezing-touch';
import { FrozenAura as FrozenAura } from './frozen-aura';

export const powerset: Powerset = {
  id: 'blaster/ice-manipulation',
  name: 'Ice Manipulation',
  description: 'Ice Manipulation lets you surround yourself with various manifestations of ice and cold, assaulting and freezing nearby foes. Ice Manipulation powers are known to Slow opponents.',
  icon: 'ice_manipulation_set.png',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    Chilblain,
    FrozenFists,
    IceSword,
    FrigidProtection,
    BuildUp,
    IcePatch,
    Shiver,
    FreezingTouch,
    FrozenAura,
  ],
};

export default powerset;
