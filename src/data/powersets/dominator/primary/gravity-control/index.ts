/**
 * Gravity Control Powerset
 * This power set allows you to manipulate the forces of gravity to control your foes. Enemies have little defense against Gravity powers.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/gravity_control
 */

import type { Powerset } from '@/types';

import { Crush as Crush } from './crush';
import { CrushingField as CrushingField } from './crushing-field';
import { DimensionShift as DimensionShift } from './dimension-shift';
import { GravityDistortion as GravityDistortion } from './gravity-distortion';
import { GravityDistortionField as GravityDistortionField } from './gravity-distortion-field';
import { Lift as Lift } from './lift';
import { Propel as Propel } from './propel';
import { Singularity as Singularity } from './singularity';
import { Wormhole as Wormhole } from './wormhole';

export const powerset: Powerset = {
  id: 'dominator/gravity-control',
  name: 'Gravity Control',
  description: 'This power set allows you to manipulate the forces of gravity to control your foes. Enemies have little defense against Gravity powers.',
  icon: 'gravity_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Crush,
    CrushingField,
    DimensionShift,
    GravityDistortion,
    GravityDistortionField,
    Lift,
    Propel,
    Singularity,
    Wormhole,
  ],
};

export default powerset;
