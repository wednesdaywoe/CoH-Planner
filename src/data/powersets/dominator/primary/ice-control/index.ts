/**
 * Ice Control Powerset
 * You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/ice_control
 */

import type { Powerset } from '@/types';

import { ArcticAir as ArcticAir } from './arctic-air';
import { BlockofIce as BlockofIce } from './block-of-ice';
import { Chilblain as Chilblain } from './chilblain';
import { FlashFreeze as FlashFreeze } from './flash-freeze';
import { Frostbite as Frostbite } from './frostbite';
import { Glacier as Glacier } from './glacier';
import { IceSlick as IceSlick } from './ice-slick';
import { JackFrost as JackFrost } from './jack-frost';
import { ColdSnap as ColdSnap } from './shiver';

export const powerset: Powerset = {
  id: 'dominator/ice-control',
  name: 'Ice Control',
  description: 'You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.',
  icon: 'ice_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    ArcticAir,
    BlockofIce,
    Chilblain,
    FlashFreeze,
    Frostbite,
    Glacier,
    IceSlick,
    JackFrost,
    ColdSnap,
  ],
};

export default powerset;
