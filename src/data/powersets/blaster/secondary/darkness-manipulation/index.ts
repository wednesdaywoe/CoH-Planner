/**
 * Darkness Manipulation Powerset
 * Assail your foes with powers drawn from the abyss. Darkness Manipulation offers powers that can both control and heavily damage their targets while reducing their chance to hit.
 *
 * Archetype: blaster
 * Category: secondary
 * Source: blaster_support/darkness_manipulation
 */

import type { Powerset } from '@/types';

import { DarkConsumption as DarkConsumption } from './dark-consumption';
import { DarkPit as DarkPit } from './dark-pit';
import { DeathShroud as DeathShroud } from './death-shroud';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';
import { PenumbralGrasp as PenumbralGrasp } from './penumbral-grasp';
import { ShadowMaul as ShadowMaul } from './shadow-maul';
import { Smite as Smite } from './smite';
import { SoulDrain as SoulDrain } from './soul-drain';
import { TouchoftheBeyond as TouchoftheBeyond } from './touch-of-fear';

export const powerset: Powerset = {
  id: 'blaster/darkness-manipulation',
  name: 'Darkness Manipulation',
  description: 'Assail your foes with powers drawn from the abyss. Darkness Manipulation offers powers that can both control and heavily damage their targets while reducing their chance to hit.',
  icon: 'darkness_manipulation_set.ico',
  archetype: 'blaster',
  category: 'secondary',
  powers: [
    DarkConsumption,
    DarkPit,
    DeathShroud,
    MidnightGrasp,
    PenumbralGrasp,
    ShadowMaul,
    Smite,
    SoulDrain,
    TouchoftheBeyond,
  ],
};

export default powerset;
