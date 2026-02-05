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
import { SpectralWall as SpectralWall } from './spectral-wall';
import { Deceive as Deceive } from './deceive';
import { SpectralTerror as SpectralTerror } from './spectral-terror';
import { SuperiorInvisibility as SuperiorInvisibility } from './superior-invisibility';
import { Gleam as Gleam } from './gleam';
import { PhantomArmy as PhantomArmy } from './phantom-army';
import { Flash as Flash } from './flash';
import { Phantasm as Phantasm } from './phantasm';

export const powerset: Powerset = {
  id: 'dominator/illusion-control',
  name: 'Illusion Control',
  description: 'You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.',
  icon: 'illusion_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Blind,
    SpectralWall,
    Deceive,
    SpectralTerror,
    SuperiorInvisibility,
    Gleam,
    PhantomArmy,
    Flash,
    Phantasm,
  ],
};

export default powerset;
