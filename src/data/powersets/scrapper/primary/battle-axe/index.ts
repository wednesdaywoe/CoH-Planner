/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.
 *
 * Archetype: scrapper
 * Category: primary
 * Source: scrapper_melee/battle_axe
 */

import type { Powerset } from '@/types';

import { Beheader as Beheader } from './beheader';
import { Chop as Chop } from './chop';
import { Gash as Gash } from './gash';
import { BuildUp as BuildUp } from './build-up';
import { Pendulum as Pendulum } from './pendulum';
import { Confront as Confront } from './confront';
import { Swoop as Swoop } from './swoop';
import { AxeCyclone as AxeCyclone } from './axe-cyclone';
import { Cleave as Cleave } from './cleave';

export const powerset: Powerset = {
  id: 'scrapper/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.png',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Beheader,
    Chop,
    Gash,
    BuildUp,
    Pendulum,
    Confront,
    Swoop,
    AxeCyclone,
    Cleave,
  ],
};

export default powerset;
