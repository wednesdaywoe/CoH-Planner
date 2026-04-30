/**
 * Water Control Powerset
 * You have total control over the power of water. Water Control grants you superior control over large groups and the ability to deal a good amount of damage to single targets. Your powers have a chance to inflict Drowning on a target, while under this effect, Deluge, Suffocate, Hypothermia, Turbulent Aura and Tidal Wave will deal more damage and these powers' secondary effects are enhanced.
 *
 * Archetype: controller
 * Category: primary
 * Source: controller_control/water_control
 */

import type { Powerset } from '@/types';

import { Deluge as Deluge } from './deluge';
import { Suffocate as Suffocate } from './suffocate';
import { Hypothermia as Hypothermia } from './hypothermia';
import { GeyserBurst as GeyserBurst } from './geyser-burst';
import { TurbulentAura as TurbulentAura } from './turbulent-aura';
import { Riptide as Riptide } from './riptide';
import { TidalWave as TidalWave } from './tidal-wave';
import { DrowningPool as DrowningPool } from './drowning-pool';
import { WaterGolem as WaterGolem } from './water-golem';

export const powerset: Powerset = {
  id: 'controller/water-control',
  name: 'Water Control',
  description: 'You have total control over the power of water. Water Control grants you superior control over large groups and the ability to deal a good amount of damage to single targets. Your powers have a chance to inflict Drowning on a target, while under this effect, Deluge, Suffocate, Hypothermia, Turbulent Aura and Tidal Wave will deal more damage and these powers\' secondary effects are enhanced.',
  icon: 'water_control_set.ico',
  archetype: 'controller',
  category: 'primary',
  powers: [
    Deluge,
    Suffocate,
    Hypothermia,
    GeyserBurst,
    TurbulentAura,
    Riptide,
    TidalWave,
    DrowningPool,
    WaterGolem,
  ],
};

export default powerset;
