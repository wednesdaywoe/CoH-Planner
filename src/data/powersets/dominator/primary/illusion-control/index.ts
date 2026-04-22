/**
 * Illusion Control Powerset
 * You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/illusion_control
 */

import type { Powerset } from '@/types';

import { Blind as Blind } from './blind';
import { Deceive as Deceive } from './deceive';
import { PhantomArmy as PhantomArmy } from './decoy';
import { Flash as Flash } from './flash';
import { Gleam as Gleam } from './gleam';
import { SuperiorInvisibility as SuperiorInvisibility } from './invisibility';
import { Phantasm as Phantasm } from './phantasm';
import { SpectralTerror as SpectralTerror } from './spectral-terror';
import { SpectralWall as SpectralWall } from './spectral-wall';

export const powerset: Powerset = {
  id: 'dominator/illusion-control',
  name: 'Illusion Control',
  description: 'You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.',
  icon: 'illusion_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Blind,
    Deceive,
    PhantomArmy,
    Flash,
    Gleam,
    SuperiorInvisibility,
    Phantasm,
    SpectralTerror,
    SpectralWall,
  ],
};

export default powerset;
