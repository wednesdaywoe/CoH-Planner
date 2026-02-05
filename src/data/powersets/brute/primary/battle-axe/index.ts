/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/battle_axe
 */

import type { Powerset } from '@/types';

import { Chop as Chop } from './chop';
import { Beheader as Beheader } from './beheader';
import { Gash as Gash } from './gash';
import { BuildUp as BuildUp } from './build-up';
import { Pendulum as Pendulum } from './pendulum';
import { Taunt as Taunt } from './taunt';
import { Swoop as Swoop } from './swoop';
import { AxeCyclone as AxeCyclone } from './axe-cyclone';
import { Cleave as Cleave } from './cleave';

export const powerset: Powerset = {
  id: 'brute/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.png',
  archetype: 'brute',
  category: 'primary',
  powers: [
    Chop,
    Beheader,
    Gash,
    BuildUp,
    Pendulum,
    Taunt,
    Swoop,
    AxeCyclone,
    Cleave,
  ],
};

export default powerset;
