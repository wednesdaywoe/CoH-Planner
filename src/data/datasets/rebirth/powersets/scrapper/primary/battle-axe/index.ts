/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.
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
import { Swoop as Swoop } from './swoop';
import { Confront as Confront } from './confront';
import { WhirlingAxe as WhirlingAxe } from './whirling-axe';
import { Cleave as Cleave } from './cleave';
import { Pendulum as Pendulum } from './pendulum';

export const powerset: Powerset = {
  id: 'scrapper/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'scrapper',
  category: 'primary',
  powers: [
    Beheader,
    Chop,
    Gash,
    BuildUp,
    Swoop,
    Confront,
    WhirlingAxe,
    Cleave,
    Pendulum,
  ],
};

export default powerset;
