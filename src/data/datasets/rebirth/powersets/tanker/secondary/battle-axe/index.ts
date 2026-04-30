/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.
 *
 * Archetype: tanker
 * Category: secondary
 * Source: tanker_melee/battle_axe
 */

import type { Powerset } from '@/types';

import { Beheader as Beheader } from './gash';
import { Chop as Chop } from './chop';
import { Gash as Gash } from './beheader';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { Swoop as Swoop } from './swoop';
import { WhirlingAxe as WhirlingAxe } from './whirling-axe';
import { Cleave as Cleave } from './cleave';
import { Pendulum as Pendulum } from './pendulum';

export const powerset: Powerset = {
  id: 'tanker/battle-axe',
  name: 'Battle Axe',
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'tanker',
  category: 'secondary',
  powers: [
    Beheader,
    Chop,
    Gash,
    Taunt,
    BuildUp,
    Swoop,
    WhirlingAxe,
    Cleave,
    Pendulum,
  ],
};

export default powerset;
