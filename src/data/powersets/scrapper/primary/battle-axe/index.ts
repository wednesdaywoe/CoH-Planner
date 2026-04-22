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
import { BuildUp as BuildUp } from './build-up';
import { Chop as Chop } from './chop';
import { Cleave as Cleave } from './cleave';
import { Confront as Confront } from './confront';
import { Gash as Gash } from './gash';
import { Pendulum as Pendulum } from './pendulum';
import { Swoop as Swoop } from './swoop';
import { AxeCyclone as AxeCyclone } from './whirling-axe';

export const powerset: Powerset = {
  id: 'scrapper/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Beheader,
    BuildUp,
    Chop,
    Cleave,
    Confront,
    Gash,
    Pendulum,
    Swoop,
    AxeCyclone,
  ],
};

export default powerset;
