/**
 * Pyrotechnic Control Powerset
 * You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/pyrotechnic_control
 */

import type { Powerset } from '@/types';

import { Dazzle as Dazzle } from './dazzle';
import { SparklingCage as SparklingCage } from './sparkling-cage';
import { SparklingChain as SparklingChain } from './sparkling-chain';
import { GlitteringColumn as GlitteringColumn } from './glittering-column';
import { HypnotizingLights as HypnotizingLights } from './hypnotizing-lights';
import { BrilliantBarrage as BrilliantBarrage } from './brilliant-barrage';
import { IncendiaryAura as IncendiaryAura } from './incendiary-aura';
import { ExplosiveBouquet as ExplosiveBouquet } from './explosive-bouquet';
import { CatherineWheel as CatherineWheel } from './catherine-wheel';

export const powerset: Powerset = {
  id: 'dominator/pyrotechnic-control',
  name: 'Pyrotechnic Control',
  description: 'You have the ability to incapacitate enemies with creative and dazzling fireworks-like displays that incorporate elements of light, fire, energy and sound. Many powers have a chance to Blast Off targets, flinging them into the air and reducing their damage resistance with a vibrant explosion.',
  icon: 'electric_control_set.png',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    Dazzle,
    SparklingCage,
    SparklingChain,
    GlitteringColumn,
    HypnotizingLights,
    BrilliantBarrage,
    IncendiaryAura,
    ExplosiveBouquet,
    CatherineWheel,
  ],
};

export default powerset;
