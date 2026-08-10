/**
 * Battle Axe Powerset
 * You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/battle_axe
 */

import type { Powerset } from '@/types';

import { Chop as Chop } from './chop';
import { Gash as Gash } from './gash';
import { WhirlingAxe as WhirlingAxe } from './whirling-axe';
import { Beheader as Beheader } from './beheader';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { Pendulum as Pendulum } from './pendulum';
import { Swoop as Swoop } from './swoop';
import { Cleave as Cleave } from './cleave';

export const powerset: Powerset = {
  id: 'defender/battle-axe',
  setPath: 'Defender_Ranged.Battle_Axe',
  name: 'Battle Axe',
  buyRequires: [],
  buyRequiresFailed: "",
  specializeAt: 0,
  specializeRequires: [],
  description: 'You can wield a Battle Axe and master a variety of powerful Lethal attacks. Battle Axe is a slow but powerful weapon that has a tendency to send foes flying.  This massive weapon has a bonus to hit.',
  icon: 'battle_axe_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Chop,
    Gash,
    WhirlingAxe,
    Beheader,
    Taunt,
    BuildUp,
    Pendulum,
    Swoop,
    Cleave,
  ],
};

export default powerset;
