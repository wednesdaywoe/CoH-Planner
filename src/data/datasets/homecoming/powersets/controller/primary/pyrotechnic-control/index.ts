/**
 * Pyrotechnic Control Powerset
 * You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/pyrotechnic_control
 */

import type { Powerset } from '@/types';

import { SparklingCage as SparklingCage } from './sparkling-cage';
import { Dazzle as Dazzle } from './dazzle';
import { SparklingField as SparklingField } from './sparkling-field';
import { GlitteringColumn as GlitteringColumn } from './glittering-column';
import { HypnotizingLights as HypnotizingLights } from './hypnotizing-lights';
import { Glitz as Glitz } from './glitz';
import { IncendiaryAura as IncendiaryAura } from './incendiary-aura';
import { ExplosiveBouquet as ExplosiveBouquet } from './explosive-bouquet';
import { CatherineWheel as CatherineWheel } from './catherine-wheel';

export const powerset: Powerset = {
  id: 'controller/pyrotechnic-control',
  setPath: 'Controller_Control.Pyrotechnic_Control',
  name: 'Pyrotechnic Control',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.',
  icon: 'electric_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    SparklingCage,
    Dazzle,
    SparklingField,
    GlitteringColumn,
    HypnotizingLights,
    Glitz,
    IncendiaryAura,
    ExplosiveBouquet,
    CatherineWheel,
  ],
};

export default powerset;
