/**
 * Darkness Manipulation Powerset
 * Assail your foes with powers drawn from the abyss. Darkness Manipulation offers powers that can both control and heavily damage their targets while reducing their chance to hit.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/darkness_manipulation
 */

import type { Powerset } from '@/types';

import { PenumbralGrasp as PenumbralGrasp } from './penumbral-grasp';
import { Smite as Smite } from './smite';
import { DeathShroud as DeathShroud } from './death-shroud';
import { ShadowMaul as ShadowMaul } from './shadow-maul';
import { SoulDrain as SoulDrain } from './soul-drain';
import { TouchofFear as TouchofFear } from './touch-of-fear';
import { DarkConsumption as DarkConsumption } from './dark-consumption';
import { DarkPit as DarkPit } from './dark-pit';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';

export const powerset: Powerset = {
  id: 'blaster/darkness-manipulation',
  setPath: 'Blaster_Support.Darkness_Manipulation',
  name: 'Darkness Manipulation',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'Assail your foes with powers drawn from the abyss. Darkness Manipulation offers powers that can both control and heavily damage their targets while reducing their chance to hit.',
  icon: 'darkness_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    PenumbralGrasp,
    Smite,
    DeathShroud,
    ShadowMaul,
    SoulDrain,
    TouchofFear,
    DarkConsumption,
    DarkPit,
    MidnightGrasp,
  ],
};

export default powerset;
