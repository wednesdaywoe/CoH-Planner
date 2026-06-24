/**
 * Ice Control Powerset
 * You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/ice_control
 */

import type { Powerset } from '@/types';

import { Chilblain as Chilblain } from './chilblain';
import { BlockofIce as BlockofIce } from './block-of-ice';
import { IceComet as IceComet } from './ice-comet';
import { Frostbite as Frostbite } from './frostbite';
import { JackFrost as JackFrost } from './jack-frost';
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
    Chilblain,
    BlockofIce,
    IceComet,
    Frostbite,
    JackFrost,
    ArticAir,
    Shiver,
    IceSlick,
    FlashFreeze,
    Glacier,
  ],
};

export default powerset;
