/**
 * Dark Melee Powerset
 * Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target's chance to hit. Like all Stalker primary attack powers, Dark Melee attacks can land a Critical Hit for double damage, if you are properly Hidden, or if the target is Slept or Held.
 *
 * Archetype: stalker
 * Category: primary
 * Source: stalker_melee/dark_melee
 */

import type { Powerset } from '@/types';

import { AssassinsEclipse as AssassinsEclipse } from './assassins-eclipse';
import { BuildUp as BuildUp } from './build-up';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';
import { Placate as Placate } from './placate';
import { ShadowMaul as ShadowMaul } from './shadow-maul';
import { ShadowPunch as ShadowPunch } from './shadow-punch';
import { SiphonLife as SiphonLife } from './siphon-life';
import { Smite as Smite } from './smite';
import { TouchofFear as TouchofFear } from './touch-of-fear';

export const powerset: Powerset = {
  id: 'stalker/dark-melee',
  name: 'Dark Melee',
  description: 'Dark Melee allows you to focus the powers of the Netherworld to defeat your foes. The draining effects of most of these powers can reduce the target\'s chance to hit. Like all Stalker primary attack powers, Dark Melee attacks can land a Critical Hit for double damage, if you are properly Hidden, or if the target is Slept or Held.',
  icon: 'dark_melee_set.ico',
  archetype: 'stalker',
  category: 'primary',
  powers: [
    AssassinsEclipse,
    BuildUp,
    MidnightGrasp,
    Placate,
    ShadowMaul,
    ShadowPunch,
    SiphonLife,
    Smite,
    TouchofFear,
  ],
};

export default powerset;
