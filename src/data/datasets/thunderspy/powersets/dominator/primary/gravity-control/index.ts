/**
 * Gravity Control Powerset
 * This power set allows you to manipulate the forces of gravity to control your foes. Enemies have little defense against Gravity powers.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/gravity_control
 */

import type { Powerset } from '@/types';

import { Singularity as Singularity } from './singularity';
import { GravityDistortion as GravityDistortion } from './gravity-distortion';
import { Lift as Lift } from './lift';
import { Propel as Propel } from './propel';
import { CrushingField as CrushingField } from './crushing-field';
import { Wormhole as Wormhole } from './wormhole';
import { Crush as Crush } from './crush';
import { DimensionShift as DimensionShift } from './dimension-shift';
import { GravityDistortionField as GravityDistortionField } from './gravity-distortion-field';

export const powerset: Powerset = {
  id: 'dominator/gravity-control',
  setPath: 'Dominator_Control.Gravity_Control',
  name: 'Gravity Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "This power set allows you to manipulate the forces of gravity to control your foes. Enemies have little defense against Gravity powers.",
  icon: 'gravity_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Singularity,
    GravityDistortion,
    Lift,
    Propel,
    CrushingField,
    Wormhole,
    Crush,
    DimensionShift,
    GravityDistortionField,
  ],
};

export default powerset;
