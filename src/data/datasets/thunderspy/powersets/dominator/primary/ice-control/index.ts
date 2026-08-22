/**
 * Ice Control Powerset
 * You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/ice_control
 */

import type { Powerset } from '@/types';

import { JackFrost as JackFrost } from './jack-frost';
import { BlockofIce as BlockofIce } from './block-of-ice';
import { Frostbite as Frostbite } from './frostbite';
import { ArcticAir as ArcticAir } from './arctic-air';
import { Shiver as Shiver } from './shiver';
import { IceSlick as IceSlick } from './ice-slick';
import { Chilblain as Chilblain } from './chilblain';
import { FlashFreeze as FlashFreeze } from './flash-freeze';
import { Glacier as Glacier } from './glacier';

export const powerset: Powerset = {
  id: 'dominator/ice-control',
  setPath: 'Dominator_Control.Ice_Control',
  name: 'Ice Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You can draw moisture from the air to create Icy formations. With these abilities, you can control ice with remarkable precision to dominate your foes.",
  icon: 'ice_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    JackFrost,
    BlockofIce,
    Frostbite,
    ArcticAir,
    Shiver,
    IceSlick,
    Chilblain,
    FlashFreeze,
    Glacier,
  ],
};

export default powerset;
