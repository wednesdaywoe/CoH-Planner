/**
 * Thermal Radiation Powerset
 * You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.
 *
 * Archetype: corruptor
 * Category: secondary
 * Source: corruptor_buff/thermal_radiation
 */

import type { Powerset } from '@/types';

import { Cauterize as Cauterize } from './cauterize';
import { FireShield as FireShield } from './fire-shield';
import { Forge as Forge } from './forge';
import { HeatExhaustion as HeatExhaustion } from './heat-exhaustion';
import { MeltArmor as MeltArmor } from './melt-armor';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { PowerofthePhoenix as PowerofthePhoenix } from './power-of-the-phoenix';
import { Thaw as Thaw } from './thaw';
import { Warmth as Warmth } from './warmth';

export const powerset: Powerset = {
  id: 'corruptor/thermal-radiation',
  name: 'Thermal Radiation',
  description: 'You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.',
  icon: 'thermal_radiation_set.ico',
  archetype: 'corruptor',
  category: 'secondary',
  powers: [
    Cauterize,
    FireShield,
    Forge,
    HeatExhaustion,
    MeltArmor,
    PlasmaShield,
    PowerofthePhoenix,
    Thaw,
    Warmth,
  ],
};

export default powerset;
