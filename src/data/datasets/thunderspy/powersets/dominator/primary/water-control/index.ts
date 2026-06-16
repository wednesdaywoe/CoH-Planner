/**
 * Water Control Powerset
 * You have total control over the power of water. Water Control grants you superior control over large groups and the ability to deal a good amount of damage to single targets. Your powers have a chance to inflict Drowning on a target, while under this effect, Deluge, Suffocate, Hypothermia, Turbulent Aura and Tidal Wave will deal more damage and these powers' secondary effects are enhanced.
 *
 * Archetype: dominator
 * Category: primary
 * Source: dominator_control/water_control
 */

import type { Powerset } from '@/types';

import { WaterGolem as WaterGolem } from './water-golem';
import { Suffocate as Suffocate } from './suffocate';
import { TurbulentAura as TurbulentAura } from './turbulent-aura';
import { Deluge as Deluge } from './deluge';
import { GeyserBurst as GeyserBurst } from './geyser-burst';
import { TidalWave as TidalWave } from './tidal-wave';
import { Riptide as Riptide } from './riptide';
import { Hypothermia as Hypothermia } from './hypothermia';
import { DrowningPool as DrowningPool } from './drowning-pool';

export const powerset: Powerset = {
  id: 'dominator/water-control',
  name: 'Water Control',
  description: 'You have total control over the power of water. Water Control grants you superior control over large groups and the ability to deal a good amount of damage to single targets. Your powers have a chance to inflict Drowning on a target, while under this effect, Deluge, Suffocate, Hypothermia, Turbulent Aura and Tidal Wave will deal more damage and these powers\' secondary effects are enhanced.',
  icon: 'water_control_set.ico',
  archetype: 'dominator',
  category: 'primary',
  powers: [
    WaterGolem,
    Suffocate,
    TurbulentAura,
    Deluge,
    GeyserBurst,
    TidalWave,
    Riptide,
    Hypothermia,
    DrowningPool,
  ],
};

export default powerset;
