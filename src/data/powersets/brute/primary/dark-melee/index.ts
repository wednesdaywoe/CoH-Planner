/**
 * Dark Melee Powerset
 * Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target's Accuracy.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/dark_melee
 */

import type { Powerset } from '@/types';

import { DarkConsumption as DarkConsumption } from './dark-consumption';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';
import { ShadowMaul as ShadowMaul } from './shadow-maul';
import { ShadowPunch as ShadowPunch } from './shadow-punch';
import { SiphonLife as SiphonLife } from './siphon-life';
import { Smite as Smite } from './smite';
import { SoulDrain as SoulDrain } from './soul-drain';
import { Taunt as Taunt } from './taunt';
import { TouchofFear as TouchofFear } from './touch-of-fear';

export const powerset: Powerset = {
  id: 'brute/dark-melee',
  name: 'Dark Melee',
  description: 'Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target\'s Accuracy.',
  icon: 'dark_melee_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    DarkConsumption,
    MidnightGrasp,
    ShadowMaul,
    ShadowPunch,
    SiphonLife,
    Smite,
    SoulDrain,
    Taunt,
    TouchofFear,
  ],
};

export default powerset;
