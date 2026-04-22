/**
 * Dark Assault Powerset
 * Blind and drain your foes with dark energies. Dark Assault allows you to pummel your foes with heavy hitting melee attacks as well as several ranged attacks. Many of Dark Assaults powers reduce their victims' chance to hit.
 *
 * Archetype: dominator
 * Category: secondary
 * Source: dominator_assault/dark_assault
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { MoonBeam as MoonBeam } from './death-shroud';
import { GatherShadows as GatherShadows } from './gather-shadows';
import { Gloom as Gloom } from './gloom';
import { LifeDrain as LifeDrain } from './life-drain';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';
import { EngulfingDarkness as EngulfingDarkness } from './moonbeam';
import { NightFall as NightFall } from './night-fall';
import { Smite as Smite } from './smite';

export const powerset: Powerset = {
  id: 'dominator/dark-assault',
  name: 'Dark Assault',
  description: 'Blind and drain your foes with dark energies. Dark Assault allows you to pummel your foes with heavy hitting melee attacks as well as several ranged attacks. Many of Dark Assaults powers reduce their victims\' chance to hit.',
  icon: 'dark_assault_set.ico',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    DarkBlast,
    MoonBeam,
    GatherShadows,
    Gloom,
    LifeDrain,
    MidnightGrasp,
    EngulfingDarkness,
    NightFall,
    Smite,
  ],
};

export default powerset;
