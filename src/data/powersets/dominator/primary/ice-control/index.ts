/**
 * Ice Control Powerset
 * You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/ice_control
 */

import type { Powerset } from '@/types';

import { Chilblain as Chilblain } from './chilblain';
import { BlockofIce as BlockofIce } from './block-of-ice';
import { Frostbite as Frostbite } from './frostbite';
import { ArcticAir as ArcticAir } from './arctic-air';
import { ColdSnap as ColdSnap } from './shiver';
import { IceSlick as IceSlick } from './ice-slick';
import { FlashFreeze as FlashFreeze } from './flash-freeze';
import { Glacier as Glacier } from './glacier';
import { JackFrost as JackFrost } from './jack-frost';

export const powerset: Powerset = {
  id: 'dominator/ice-control',
  name: 'Ice Control',
  description: 'You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.',
  icon: 'ice_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Chilblain,
    BlockofIce,
    Frostbite,
    ArcticAir,
    ColdSnap,
    IceSlick,
    FlashFreeze,
    Glacier,
    JackFrost,
  ],
};

export default powerset;
