/**
 * Illusion Control Powerset
 * You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/illusion_control
 */

import type { Powerset } from '@/types';

import { SpectralWounds as SpectralWounds } from './spectral-wounds';
import { Blind as Blind } from './blind';
import { Deceive as Deceive } from './deceive';
import { Flash as Flash } from './flash';
import { SuperiorInvisibility as SuperiorInvisibility } from './invisibility';
import { GroupInvisibility as GroupInvisibility } from './group-invisibility';
import { PhantomArmy as PhantomArmy } from './decoy';
import { SpectralTerror as SpectralTerror } from './spectral-terror';
import { Phantasm as Phantasm } from './phantasm';

export const powerset: Powerset = {
  id: 'controller/illusion-control',
  name: 'Illusion Control',
  description: 'You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.',
  icon: 'illusion_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    SpectralWounds,
    Blind,
    Deceive,
    Flash,
    SuperiorInvisibility,
    GroupInvisibility,
    PhantomArmy,
    SpectralTerror,
    Phantasm,
  ],
};

export default powerset;
