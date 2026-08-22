/**
 * Thermal Radiation Powerset
 * You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.
 *
 * Archetype: mastermind
 * Category: secondary
 * Source: mastermind_buff/thermal_radiation
 */

import type { Powerset } from '@/types';

import { Warmth as Warmth } from './warmth';
import { FireShield as FireShield } from './fire-shield';
import { Cauterize as Cauterize } from './cauterize';
import { PlasmaShield as PlasmaShield } from './plasma-shield';
import { PowerofthePhoenix as PowerofthePhoenix } from './power-of-the-phoenix';
import { Thaw as Thaw } from './thaw';
import { Forge as Forge } from './forge';
import { HeatExhaustion as HeatExhaustion } from './heat-exhaustion';
import { MeltArmor as MeltArmor } from './melt-armor';

export const powerset: Powerset = {
  id: 'mastermind/thermal-radiation',
  setPath: 'Mastermind_Buff.Thermal_Radiation',
  name: 'Thermal Radiation',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: "You have the ability to control heat and Thermal Radiation. This allows you to protect allies from harm, heal them or increase their abilities. You can also weaken your enemies.",
  icon: 'thermal_radiation_set.ico',
  archetype: 'mastermind',
  category: 'secondary',
  powers: [
    Warmth,
    FireShield,
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
