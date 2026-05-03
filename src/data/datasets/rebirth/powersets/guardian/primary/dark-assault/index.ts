/**
 * Dark Assault Powerset
 * Blind and drain your foes with dark energies. Dark Assault allows you to pummel your foes with heavy hitting melee attacks as well as several ranged attacks. Many of Dark Assaults powers reduce their victims' chance to hit.
 *
 * Archetype: guardian
 * Category: primary
 * Source: guardian_assault/dark_assault
 */

import type { Powerset } from '@/types';

import { DarkBlast as DarkBlast } from './dark-blast';
import { Smite as Smite } from './smite';
import { Gloom as Gloom } from './gloom';
import { NightFall as NightFall } from './night-fall';
import { BuildUp as BuildUp } from './build-up';
import { EngulfingDarkness as EngulfingDarkness } from './engulfing-darkness';
import { LifeDrain as LifeDrain } from './life-drain';
import { Moonbeam as Moonbeam } from './moonbeam';
import { MidnightGrasp as MidnightGrasp } from './midnight-grasp';

export const powerset: Powerset = {
  id: 'guardian/dark-assault',
  name: 'Dark Assault',
  description: 'Blind and drain your foes with dark energies. Dark Assault allows you to pummel your foes with heavy hitting melee attacks as well as several ranged attacks. Many of Dark Assaults powers reduce their victims\' chance to hit.',
  icon: 'dark_assault_set.ico',
  archetype: 'guardian',
  category: 'primary',
  powers: [
    DarkBlast,
    Smite,
    Gloom,
    NightFall,
    BuildUp,
    EngulfingDarkness,
    LifeDrain,
    Moonbeam,
    MidnightGrasp,
  ],
};

export default powerset;
