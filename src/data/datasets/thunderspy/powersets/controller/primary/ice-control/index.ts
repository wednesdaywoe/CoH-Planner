/**
 * Ice Control Powerset
 * You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/ice_control
 */

import type { Powerset } from '@/types';

import { JackFrost as JackFrost } from './jack-frost';
import { BlockofIce as BlockofIce } from './block-of-ice';
import { Frostbite as Frostbite } from './frostbite';
import { Chilblain as Chilblain } from './chilblain';
import { ArticAir as ArticAir } from './artic-air';
import { Shiver as Shiver } from './shiver';
import { IceSlick as IceSlick } from './ice-slick';
import { FlashFreeze as FlashFreeze } from './flash-freeze';
import { Glacier as Glacier } from './glacier';

export const powerset: Powerset = {
  id: 'controller/ice-control',
  name: 'Ice Control',
  description: 'You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.',
  icon: 'ice_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    JackFrost,
    BlockofIce,
    Frostbite,
    Chilblain,
    ArticAir,
    Shiver,
    IceSlick,
    FlashFreeze,
    Glacier,
  ],
};

export default powerset;
