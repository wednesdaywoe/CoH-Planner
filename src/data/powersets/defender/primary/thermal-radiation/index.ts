/**
 * Thermal Radiation Powerset
 * You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.
 *
 * Archetype: defender
 * Category: primary
 * Source: defender_buff/thermal_radiation
 */

import type { Powerset } from '@/types';

import { ThermalShield as ThermalShield } from './thermal-shield';
import { Warmth as Warmth } from './warmth';
import { Cauterize as Cauterize } from './cauterize';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { PowerofthePhoenix as PowerofthePhoenix } from './power-of-the-phoenix';
import { Thaw as Thaw } from './thaw';
import { Forge as Forge } from './forge';
import { HeatExhaustion as HeatExhaustion } from './heat-exhaustion';
import { MeltArmor as MeltArmor } from './melt-armor';

export const powerset: Powerset = {
  id: 'defender/thermal-radiation',
  name: 'Thermal Radiation',
  description: 'You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.',
  icon: 'thermal_radiation_set.png',
  archetype: 'defender',
  category: 'primary',
  powers: [
    ThermalShield,
    Warmth,
    Cauterize,
    PlasmaShield,
    PowerofthePhoenix,
    Thaw,
    Forge,
    HeatExhaustion,
    MeltArmor,
  ],
};

export default powerset;
