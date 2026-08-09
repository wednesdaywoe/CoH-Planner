/**
 * War Mace Powerset
 * You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon gives it a bonus to hit.
 *
 * Archetype: defender
 * Category: secondary
 * Source: defender_ranged/war_mace
 */

import type { Powerset } from '@/types';

import { Bash as Bash } from './bash';
import { Pulverize as Pulverize } from './pulverize';
import { WhirlingMace as WhirlingMace } from './whirling-mace';
import { Jawbreaker as Jawbreaker } from './jawbreaker';
import { Taunt as Taunt } from './taunt';
import { BuildUp as BuildUp } from './build-up';
import { CrowdControl as CrowdControl } from './crowd-control';
import { Shatter as Shatter } from './shatter';
import { Clobber as Clobber } from './clobber';

export const powerset: Powerset = {
  id: 'defender/war-mace',
  internalName: 'war_mace',
  name: 'War Mace',
  description: 'You can wield a Medieval Mace and master a variety of powerful Smashing attacks. Attack speeds are good, and the weight of the Mace has good Disorienting capabilities. The sheer weight of this weapon gives it a bonus to hit.',
  icon: 'war_mace_set.ico',
  archetype: 'defender',
  category: 'secondary',
  powers: [
    Bash,
    Pulverize,
    WhirlingMace,
    Jawbreaker,
    Taunt,
    BuildUp,
    CrowdControl,
    Shatter,
    Clobber,
  ],
};

export default powerset;
