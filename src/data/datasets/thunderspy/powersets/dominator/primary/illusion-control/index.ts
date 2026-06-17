/**
 * Illusion Control Powerset
 * You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/illusion_control
 */

import type { Powerset } from '@/types';

import { Invisibility as Invisibility } from './invisibility';
import { Phantasm as Phantasm } from './phantasm';
import { Blind as Blind } from './blind';
import { Deceive as Deceive } from './deceive';
import { SpectralWounds as SpectralWounds } from './spectral-wounds';
import { SpectralTerror as SpectralTerror } from './spectral-terror';
import { Mirage as Mirage } from './mirage';
import { Decoy as Decoy } from './decoy';
import { GroupInvisibility as GroupInvisibility } from './group-invisibility';
import { Flash as Flash } from './flash';

export const powerset: Powerset = {
  id: 'dominator/illusion-control',
  name: 'Illusion Control',
  description: 'You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.',
  icon: 'illusion_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Invisibility,
    Phantasm,
    Blind,
    Deceive,
    SpectralWounds,
    SpectralTerror,
    Mirage,
    Decoy,
    GroupInvisibility,
    Flash,
  ],
};

export default powerset;
