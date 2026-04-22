/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/battle_axe
 */

import type { Powerset } from '@/types';

import { Gash as Gash } from './beheader';
import { BuildUp as BuildUp } from './build-up';
import { Chop as Chop } from './chop';
import { Cleave as Cleave } from './cleave';
import { Beheader as Beheader } from './gash';
import { Pendulum as Pendulum } from './pendulum';
import { Swoop as Swoop } from './swoop';
import { Taunt as Taunt } from './taunt';
import { AxeCyclone as AxeCyclone } from './whirling-axe';

export const powerset: Powerset = {
  id: 'tanker/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying. This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Gash,
    BuildUp,
    Chop,
    Cleave,
    Beheader,
    Pendulum,
    Swoop,
    Taunt,
    AxeCyclone,
  ],
};

export default powerset;
