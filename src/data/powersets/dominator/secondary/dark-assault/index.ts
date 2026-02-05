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
import { Smite as Smite } from './smite';
import { Gloom as Gloom } from './gloom';
import { NightFall as NightFall } from './night-fall';
import { GatherShadows as GatherShadows } from './gather-shadows';
import { EngulfingDarkness as EngulfingDarkness } from './engulfing-darkness';
import { LifeDrain as LifeDrain } from './life-drain';
import { MoonBeam as MoonBeam } from './moon-beam';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';

export const powerset: Powerset = {
  id: 'dominator/dark-assault',
  name: 'Dark Assault',
  description: 'Blind and drain your foes with dark energies. Dark Assault allows you to pummel your foes with heavy hitting melee attacks as well as several ranged attacks. Many of Dark Assaults powers reduce their victims\' chance to hit.',
  icon: 'dark_assault_set.png',
  archetype: 'dominator',
  category: 'secondary',
  powers: [
    DarkBlast,
    Smite,
    Gloom,
    NightFall,
    GatherShadows,
    EngulfingDarkness,
    LifeDrain,
    MoonBeam,
    MidnightGrasp,
  ],
};

export default powerset;
