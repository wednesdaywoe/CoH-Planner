/**
 * Illusion Control Powerset
 * You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/illusion_control
 */

import type { Powerset } from '@/types';

import { SpectralWall as SpectralWall } from './spectral-wall';
import { Blind as Blind } from './blind';
import { Deceive as Deceive } from './deceive';
import { SpectralTerror as SpectralTerror } from './spectral-terror';
import { Invisibility as Invisibility } from './invisibility';
import { Gleam as Gleam } from './gleam';
import { Decoy as Decoy } from './decoy';
import { Flash as Flash } from './flash';
import { Phantasm as Phantasm } from './phantasm';

export const powerset: Powerset = {
  id: 'dominator/illusion-control',
  setPath: 'Dominator_Control.Illusion_Control',
  name: 'Illusion Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You can manipulate light and sound to manifest all sorts of Illusions, aiding your allies as well as deceiving your foes.",
  icon: 'illusion_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    SpectralWall,
    Blind,
    Deceive,
    SpectralTerror,
    Invisibility,
    Gleam,
    Decoy,
    Flash,
    Phantasm,
  ],
};

export default powerset;
