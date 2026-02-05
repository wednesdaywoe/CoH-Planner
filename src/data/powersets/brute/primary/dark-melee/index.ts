/**
 * Dark Melee Powerset
 * Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target's Accuracy.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/dark_melee
 */

import type { Powerset } from '@/types';

import { ShadowPunch as ShadowPunch } from './shadow-punch';
import { Smite as Smite } from './smite';
import { ShadowMaul as ShadowMaul } from './shadow-maul';
import { TouchofFear as TouchofFear } from './touch-of-fear';
import { SiphonLife as SiphonLife } from './siphon-life';
import { Taunt as Taunt } from './taunt';
import { DarkConsumption as DarkConsumption } from './dark-consumption';
import { SoulDrain as SoulDrain } from './soul-drain';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';

export const powerset: Powerset = {
  id: 'brute/dark-melee',
  name: 'Dark Melee',
  description: 'Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target\'s Accuracy.',
  icon: 'dark_melee_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    ShadowPunch,
    Smite,
    ShadowMaul,
    TouchofFear,
    SiphonLife,
    Taunt,
    DarkConsumption,
    SoulDrain,
    MidnightGrasp,
  ],
};

export default powerset;
