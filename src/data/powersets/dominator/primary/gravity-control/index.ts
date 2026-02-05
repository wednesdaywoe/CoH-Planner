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
import { Lift as Lift } from './lift';
import { GravityDistortion as GravityDistortion } from './gravity-distortion';
import { Propel as Propel } from './propel';
import { CrushingField as CrushingField } from './crushing-field';
import { DimensionShift as DimensionShift } from './dimension-shift';
import { GravityDistortionField as GravityDistortionField } from './gravity-distortion-field';
import { Wormhole as Wormhole } from './wormhole';
import { Singularity as Singularity } from './singularity';

export const powerset: Powerset = {
  id: 'dominator/gravity-control',
  name: 'Gravity Control',
  description: 'This power set allows you to manipulate the forces of gravity to control your foes. Enemies have little defense against Gravity powers.',
  icon: 'gravity_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Crush,
    Lift,
    GravityDistortion,
    Propel,
    CrushingField,
    DimensionShift,
    GravityDistortionField,
    Wormhole,
    Singularity,
  ],
};

export default powerset;
