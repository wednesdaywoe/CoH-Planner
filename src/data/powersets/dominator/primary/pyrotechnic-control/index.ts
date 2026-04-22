/**
 * Pyrotechnic Control Powerset
 * You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/pyrotechnic_control
 */

import type { Powerset } from '@/types';

import { CatherineWheel as CatherineWheel } from './catherine-wheel';
import { Dazzle as Dazzle } from './dazzle';
import { ExplosiveBouquet as ExplosiveBouquet } from './explosive-bouquet';
import { GlitteringColumn as GlitteringColumn } from './glittering-column';
import { BrilliantBarrage as BrilliantBarrage } from './glitz';
import { HypnotizingLights as HypnotizingLights } from './hypnotizing-lights';
import { IncendiaryAura as IncendiaryAura } from './incendiary-aura';
import { SparklingCage as SparklingCage } from './sparkling-cage';
import { SparklingChain as SparklingChain } from './sparkling-field';

export const powerset: Powerset = {
  id: 'dominator/pyrotechnic-control',
  name: 'Pyrotechnic Control',
  description: 'You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.',
  icon: 'electric_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    CatherineWheel,
    Dazzle,
    ExplosiveBouquet,
    GlitteringColumn,
    BrilliantBarrage,
    HypnotizingLights,
    IncendiaryAura,
    SparklingCage,
    SparklingChain,
  ],
};

export default powerset;
