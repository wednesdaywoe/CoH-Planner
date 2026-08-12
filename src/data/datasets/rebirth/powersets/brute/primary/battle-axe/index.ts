/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.
 *
 * Archetype: brute
 * Category: primary
 * Source: brute_melee/battle_axe
 */

import type { Powerset } from '@/types';

import { Gash as Gash } from './gash';
import { Chop as Chop } from './chop';
import { Beheader as Beheader } from './beheader';
import { BuildUp as BuildUp } from './build-up';
import { Swoop as Swoop } from './swoop';
import { Taunt as Taunt } from './taunt';
import { WhirlingAxe as WhirlingAxe } from './whirling-axe';
import { Cleave as Cleave } from './cleave';
import { Pendulum as Pendulum } from './pendulum';

export const powerset: Powerset = {
  id: 'brute/battle-axe',
  setPath: 'Brute_Melee.Battle_Axe',
  name: 'Battle Axe',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'brute',
  category: 'primary',
  powers: [
    Gash,
    Chop,
    Beheader,
    BuildUp,
    Swoop,
    Taunt,
    WhirlingAxe,
    Cleave,
    Pendulum,
  ],
};

export default powerset;
